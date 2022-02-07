<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import Textfield from "@smui/textfield";
    import Icon from '@smui/textfield/icon';
    import HelperText from '@smui/textfield/helper-text';
    import Select, {Option} from "@smui/select";
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import Button, {Label} from "@smui/button";
    import Timetable from "./Widgets/Timetable.svelte";
    import {baseurl} from "./constants";

    import {navigate} from "svelte-routing";

    let date = "";
    let name = "";
    let description = "";
    let url = "";

    let hour: number;
    let hours = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    let isMandatory = true;
    let isGrading = false;
    let isWrittenAssessment = false;
    let isTest = false;

    let items = [];
    let classId = "";

    export let editId;

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

    function loadThings() {
        fetch(`${baseurl}/classes/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    items = json["data"];
                },
            );
    }

    function getMeetingData() {
        fetch(`${baseurl}/meeting/get/${editId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    date = json["data"]["Date"];
                    classId = json["data"]["ClassID"];
                    name = json["data"]["MeetingName"];
                    description = json["data"]["Details"];
                    url = json["data"]["URL"];
                    hour = json["data"]["Hour"];
                    isMandatory = json["data"]["IsMandatory"];
                    isWrittenAssessment = json["data"]["IsWrittenAssessment"];
                    isGrading = json["data"]["IsGrading"];
                    isTest = json["data"]["IsTest"];
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
        console.log(hour)
        let fd = new FormData()
        console.log(fmtDate(new Date(date)));
        fd.append("classId", classId);
        fd.append("date", fmtDate(new Date(date)));
        fd.append("name", name);
        fd.append("details", description);
        fd.append("url", url);
        fd.append("hour", hour.toString())
        fd.append("is_mandatory", isMandatory ? "true" : "false")
        fd.append("is_grading", isGrading ? "true" : "false")
        fd.append("is_written_assessment", isWrittenAssessment ? "true" : "false")
        fd.append("is_test", isTest ? "true" : "false")
        fetch(`${baseurl}/${(editId === undefined ? "meetings/new" : "meetings/new/" + editId)}`,
            {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, body: fd, method: editId === undefined ? "POST" : "PATCH"})
            .then((r) => r.json())
            .then((r) => console.log(r))
            .then(() => navigate("/"))
    }

    loadThings();
    if (editId !== undefined) {
        getMeetingData();
    }
</script>

<Drawer active="novosrecanje" />
<AppContent class="app-content">
    <main class="main-content">
        <Select bind:classId label="Izberite razred" variant="outlined">
            <Option value="" on:click={() => classId = ""}/>
            {#each items as c}
                <Option on:click={async () => {
                    classId = c["ID"];
                }} value={c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
        <p/>
        <Textfield bind:value={date} label="Datum srečanja" type="date" required on:click={() => date = ""}>
            <Icon class="material-icons" slot="leadingIcon">event</Icon>
            <HelperText slot="helper">Izberite prosim datum srečanja</HelperText>
        </Textfield>
        <Select bind:hour label="Ura" required>
            {#each hours as h}
                <Option value={h} on:click={() => {
                    console.log("H", h)
                    hour = h;
                }}>{h}.</Option>
            {/each}
        </Select>
        <p/>
        {#if classId !== ""}
            {#if date !== ""}
                {#if hour !== undefined}
                    <Timetable classId={classId} date={new Date(date)} hour={hour} />
                {:else}
                    <Timetable classId={classId} date={new Date(date)} />
                {/if}
            {:else}
                <Timetable classId={classId} />
            {/if}
        {/if}
        <p/>
        <Textfield bind:value={name} label="Ime srečanja" required style="width: 100%;" helperLine$style="width: 100%;">
            <HelperText slot="helper">Izberite poljubno ime srečanja</HelperText>
        </Textfield>
        <Textfield bind:value={description} label="Opis srečanja" textarea style="width: 100%;" helperLine$style="width: 100%;" input$rows={8} />
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
        <p/><hr><p/>
        <Button on:click={() => createNew()}>
            <Icon class="material-icons">add</Icon>
            <Label>Dodaj</Label>
        </Button>
    </main>
</AppContent>