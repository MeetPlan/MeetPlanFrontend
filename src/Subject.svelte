<script lang="ts">
    import List, {Item, Text as TextList, Meta, Graphic, PrimaryText} from "@smui/list";
    import IconButton from "@smui/icon-button";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';

    import {subjects} from "./Constants/consts";

    import Avatar from "svelte-avatar";

    import Autocomplete from '@smui-extra/autocomplete';
    import {baseurl} from "./constants";
    import {navigate} from "svelte-routing";

    import Slider from "@smui/slider";
    import FormField from '@smui/form-field';
    import Button, {Icon} from "@smui/button";
    import type {Subject} from "./typescript-definitions/tsdef";
    import Cookies from "js-cookie";
    import {onMount} from "svelte";
    import Switch from "@smui/switch";

    let studentPick;
    let students: Subject;
    let studentsToAdd = [];
    let classId: string = "";
    let longName: string = "";
    let selectedHour: number = 1;
    let location: string = "";
    let isGraded: boolean = true;

    let realization: number = 60.0;

    export let id: number;

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    async function getSubject() {
        let response = await fetch(`${baseurl}/subject/get/${id}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let r = await response.json()
        let data: Subject = r.data;
        longName = data.LongName;
        students = data;
        realization = data.Realization;
        selectedHour = data.SelectedHours;
        location = data.Location;
        isGraded = data.IsGraded;
    }

    async function patchSubjectName() {
        let fd = new FormData();
        fd.append("long_name", longName)
        fd.append("realization", realization.toString());
        fd.append("selected_hours", selectedHour.toString());
        fd.append("location", location);
        fd.append("is_graded", isGraded.toString());
        await fetch(`${baseurl}/subject/get/${id}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH", body: fd})
        await getSubject();
    }

    async function getStudents() {
        let response = await fetch(`${baseurl}/students/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let r = await response.json()
        studentsToAdd = r.data;
    }

    async function assignToSubject() {
        await fetch(`${baseurl}/subject/get/${id}/add_user/${studentPick["ID"]}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH"})
        await getSubject();
    }

    async function deleteFromSubject(cid: string) {
        await fetch(`${baseurl}/subject/get/${id}/remove_user/${cid}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
        await getSubject();
    }

    onMount(async () => {
        await getSubject();
        await getStudents();
    })
</script>

{#if students !== undefined}
    <Autocomplete combobox options={subjects} textfield$style="width: 100%;" style="width: 100%;" bind:value={longName} label="Izberite ali vpišite dolgo ime predmeta, če ga ni vpisanega" on:change={() => setTimeout(patchSubjectName, 200)} />
    <Textfield type="number" label="Realizacija" bind:value={realization} input$step="0.5" on:change={() => setTimeout(patchSubjectName, 200)}>
        <HelperText slot="helper">Vpišite prosimo realizacijo</HelperText>
    </Textfield>
    <Textfield label="Učilnica/Lokacija" bind:value={location} on:change={() => setTimeout(patchSubjectName, 200)}>
        <HelperText slot="helper">Vnesite, prosimo lokacijo oz. učilnico, v kateri bo potekal ta predmet</HelperText>
    </Textfield>
    <p/>
    <FormField>
        <Switch bind:checked={isGraded} on:change={() => setTimeout(patchSubjectName, 200)} />
        <span slot="label">Se ocenjuje</span>
    </FormField>
    <p/>
    <FormField align="end" style="display: flex;">
        <Slider discrete style="flex-grow: 1;" bind:value={selectedHour} min={1} max={10} step={0.5} />
        <span slot="label" style="padding-right: 12px; width: max-content; display: block;">Število ur na teden</span>
    </FormField>
    <Button on:click={patchSubjectName}>
        <Icon class="material-icons">done</Icon>
        Spremeni število ur na teden
    </Button>
    <p/>
    {#if !students.InheritsClass}
        <Autocomplete
            options={studentsToAdd}
            getOptionLabel={(option) => option ? option["Name"] : ""}
            bind:value={studentPick}
            label="Izberite učenca"
            on:change={() => setTimeout(assignToSubject, 200)}
        />
    {/if}
    <h2>Učitelj:</h2>
    <List class="demo-list" twoLine avatarList>
        <Item>
            <Avatar name={students.TeacherName}/><div style="width: 15px;"/>
            <TextList>
                <PrimaryText>{students.TeacherName}</PrimaryText>
            </TextList>
        </Item>
    </List>
    <h2>Učenci:</h2>
    <List class="demo-list" twoLine avatarList>
        {#each students.User as item}
            <Item>
                <Avatar name={item.Name}/><div style="width: 15px;"/>
                <TextList>
                    <PrimaryText>{item.Name}</PrimaryText>
                </TextList>
                {#if localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant"}
                    <Meta><IconButton class="material-icons" on:click={() => deleteFromSubject(item.ID)} title="Remove from class">delete</IconButton></Meta>
                {/if}
            </Item>
        {/each}
    </List>
{/if}
