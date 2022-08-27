<script lang="ts">
    import Textfield from "@smui/textfield";
    import Icon from '@smui/textfield/icon';
    import HelperText from '@smui/textfield/helper-text';
    import Select, {Option} from "@smui/select";
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import Button, {Label} from "@smui/button";
    import Timetable from "./Widgets/Timetable.svelte";
    import {baseurl} from "./constants";

    import {navigate} from "svelte-navigator";
    import * as marked from 'marked';
    import insane from "insane";
    import type {Subject} from "./typescript-definitions/tsdef";
    import Cookies from "js-cookie";

    let date: string = "";
    let lastDate: string = "";
    let name: string = "";
    let description: string = "";
    let url: string = "";
    let location: string = "";

    let repeatCycle: number = 1;

    let hour: number;
    let hours = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    let isMandatory: boolean = true;
    let isGrading: boolean = false;
    let isWrittenAssessment: boolean = false;
    let isTest: boolean = false;
    let isRepetitive: boolean = false;

    let subjects: Subject[] = [];
    let subjectId: number = undefined;

    export let editId;

    function getSubjects() {
        fetch(`${baseurl}/subjects/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((json) => {
                    subjects = json["data"];
                },
            );
    }

    function fmtDate(date: Date): string {
        let dd = date.getDate().toString()
        if (dd < 10) {
            dd = `0${dd}`
        }
        let mm = date.getMonth().toString();
        if (mm < 10) {
            mm = `0${(date.getMonth() + 1).toString()}`
        }
        return `${dd}-${mm}-${date.getFullYear()}`
    }

    function fmtDateReverse(date: Date): string {
        let dd = date.getDate().toString()
        if (dd < 10) {
            dd = `0${dd}`
        }
        let mm = date.getMonth().toString();
        if (mm < 10) {
            mm = `0${(date.getMonth() + 1).toString()}`
        }
        return `${date.getFullYear()}-${mm}-${dd}`
    }

    function reverseFmtDate(date: string): string {
        let pieces = date.split("-");
        return `${pieces[2]}-${pieces[1]}-${pieces[0]}`
    }

    function getMeetingData() {
        fetch(`${baseurl}/meeting/get/${editId}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((json) => {
                    date = fmtDateReverse(new Date(reverseFmtDate(json["data"]["Date"])));
                    console.log(date)
                    subjectId = json.data.SubjectID;
                    name = json.data.MeetingName;
                    description = json.data.Details;
                    url = json.data.URL;
                    hour = json.data.Hour;
                    isMandatory = json.data.IsMandatory;
                    isWrittenAssessment = json.data.IsWrittenAssessment;
                    isGrading = json.data.IsGrading;
                    isTest = json.data.IsTest;
                    location = json.data.Location;
                },
            );
    }

    function createNew() {
        if (date === "") {
            console.log("Date is empty");
            date = ""
            return
        }
        if (name === "") {
            console.log("Name is empty");
            name = ""
            return
        }
        if (hour === undefined) {
            console.log("Hour is undefined");
            hour = undefined
            return
        }
        if (subjectId === undefined) {
            console.log("Subject ID is undefined");
            return
        }
        console.log(hour)
        let fd = new FormData()
        console.log(fmtDate(new Date(date)));
        fd.append("subjectId", subjectId.toString());
        fd.append("date", fmtDate(new Date(date)));
        fd.append("name", name);
        fd.append("details", description);
        fd.append("url", url);
        fd.append("hour", hour.toString())
        fd.append("is_mandatory", isMandatory ? "true" : "false")
        fd.append("is_grading", isGrading ? "true" : "false")
        fd.append("is_written_assessment", isWrittenAssessment ? "true" : "false")
        fd.append("is_test", isTest ? "true" : "false")
        fd.append("repeat_cycle", repeatCycle.toString())
        fd.append("last_date", fmtDate(new Date(lastDate)))
        fd.append("location", location);
        fetch(`${baseurl}/${(editId === undefined ? "meetings/new" : "meetings/new/" + editId)}`,
            {headers: {"Authorization": "Bearer " + Cookies.get("key")}, body: fd, method: editId === undefined ? "POST" : "PATCH"})
            .then((r) => r.json())
            .then((r) => console.log(r))
            .then(() => navigate("/"))
    }

    getSubjects();
    if (editId !== undefined) {
        getMeetingData();
    }
</script>

Izberite predmet:
<Select bind:value={subjectId} variant="outlined">
    <Option value="" on:click={() => subjectId = undefined}/>
    {#each subjects as c}
        <Option on:click={async () => {
            subjectId = c.ID;
            for (let i in subjects) {
                let subject = subjects[i];
                if (subject.ID === subjectId) {
                    console.log(subject, subjectId);
                    location = subject.Location;
                }
            }
        }} value={c.ID}>{c["Name"]}</Option>
    {/each}
</Select>
<p/>
<Textfield bind:value={date} label="Datum srečanja" type="date" required on:click={() => date = ""}>
    <Icon class="material-icons" slot="leadingIcon">event</Icon>
    <HelperText slot="helper">Izberite prosim datum srečanja</HelperText>
</Textfield>
Izberite uro:
<Select bind:value={hour} required>
    {#each hours as h}
        <Option value={h} on:click={() => {
            console.log("H", h)
            hour = h;
        }}>{h}.</Option>
    {/each}
</Select>
<p/>
{#if subjectId !== ""}
    {#if date !== ""}
        {#if hour !== undefined}
            <Timetable subjectId={subjectId} date={new Date(date)} hour={hour} />
        {:else}
            <Timetable subjectId={subjectId} date={new Date(date)} />
        {/if}
    {:else}
        <Timetable subjectId={subjectId} />
    {/if}
{/if}
<p/>
<Textfield bind:value={name} label="Ime srečanja" required style="width: 100%;" helperLine$style="width: 100%;">
    <HelperText slot="helper">Izberite poljubno ime srečanja</HelperText>
</Textfield>
<Textfield bind:value={description} label="Opis srečanja" textarea style="width: 100%;" helperLine$style="width: 100%;" input$rows={8} />
{#if description !== ""}
    <h2>Predogled:</h2>
    {@html insane(marked.marked(description))}
{/if}
<Textfield label="Učilnica/Lokacija" required style="width: 100%;" helperLine$style="width: 100%;" bind:value={location}>
    <HelperText slot="helper">Vnesite, prosimo lokacijo oz. učilnico, v kateri bo potekal ta predmet</HelperText>
</Textfield>
<Textfield bind:value={url} label="URL do srečanja" style="width: 100%;" helperLine$style="width: 100%;">
    <HelperText slot="helper">Vpišite URL do srečanja</HelperText>
</Textfield>
<FormField>
    <Switch bind:checked={isMandatory} />
    Je srečanje obvezno
</FormField>
<p/>
{#if !isTest}
    <FormField>
        <Switch bind:checked={isGrading} />
        Je ocenjevanje znanja
    </FormField>
{/if}
<p/>
{#if isGrading && isMandatory}
    <FormField>
        <Switch bind:checked={isWrittenAssessment} />
        Je pisno ocenjevanje znanja
    </FormField>
{/if}
<p/>
{#if !isGrading}
    <FormField>
        <Switch bind:checked={isTest} />
        Je preverjanje znanja
    </FormField>
{/if}
<p/>
<FormField>
    <Switch bind:checked={isRepetitive} />
    Je ponavljajoče
</FormField>
{#if isRepetitive}
    <p/>
    <Textfield bind:value={lastDate} label="Datum zadnjega srečanja" type="date" on:click={() => lastDate = ""}>
        <Icon class="material-icons" slot="leadingIcon">event</Icon>
        <HelperText slot="helper">Izberite prosim zadnji datum srečanja</HelperText>
    </Textfield>
    <p/>
    <Textfield bind:value={repeatCycle} label="Cikel ponavljanja" type="number">
        <Icon class="material-icons" slot="leadingIcon">replay</Icon>
        <HelperText slot="helper">Vpišite na koliko tednov se srečanje ponovi</HelperText>
    </Textfield>
{/if}
<p/><hr><p/>
<Button on:click={() => createNew()}>
    <Icon class="material-icons">add</Icon>
    <Label>Dodaj</Label>
</Button>
