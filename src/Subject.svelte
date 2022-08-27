<script lang="ts">
    import List, {Item, Text as TextList, Meta, Graphic, PrimaryText} from "@smui/list";
    import IconButton from "@smui/icon-button";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';

    import {subjects} from "./Constants/consts";

    import Avatar from "svelte-avatar";

    import Autocomplete from '@smui-extra/autocomplete';
    import {baseurl} from "./constants";
    import Select, {Option} from "@smui/select";
    import {navigate} from "svelte-navigator";

    import Slider from "@smui/slider";
    import FormField from '@smui/form-field';
    import Button, {Icon} from "@smui/button";
    import type {Subject} from "./typescript-definitions/tsdef";
    import Cookies from "js-cookie";


    let myClasses;
    let students: Subject;
    let studentsToAdd = [];
    let classId: string = "";
    let longName: string = "";
    let selectedHour: number = 1;
    let location: string = "";

    let realization: number = 60.0;

    export let id: number;

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }



    function getSubject() {
        fetch(`${baseurl}/subject/get/${id}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((r) => {
                let data: Subject = r.data;
                longName = data.LongName;
                students = data;
                realization = data.Realization;
                selectedHour = data.SelectedHours;
                location = data.Location;
            });
    }

    function patchSubjectName() {
        let fd = new FormData();
        fd.append("long_name", longName)
        fd.append("realization", realization.toString());
        fd.append("selected_hours", selectedHour.toString());
        fd.append("location", location);
        fetch(`${baseurl}/subject/get/${id}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH", body: fd})
            .then((response) => response.json())
            .then((r) => getSubject());
    }

    function getStudents() {
        fetch(`${baseurl}/students/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((r) => studentsToAdd = r.data);
    }

    function assignToSubject(cid: string) {
        fetch(`${baseurl}/subject/get/${id}/add_user/${cid}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => getSubject());
    }

    function deleteFromSubject(cid: string) {
        fetch(`${baseurl}/subject/get/${id}/remove_user/${cid}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((r) => getSubject());
    }

    getSubject()
    getStudents();
</script>

{#if students !== undefined}
    <Autocomplete combobox options={subjects} style="width: 100%;" bind:value={longName} label="Izberite ali vpišite dolgo ime predmeta, če ga ni vpisanega" on:change={() => setTimeout(patchSubjectName, 500)} />
    <Textfield type="number" label="Realizacija" bind:value={realization} input$step="0.5" on:change={() => setTimeout(patchSubjectName, 500)}>
        <HelperText slot="helper">Vpišite prosimo realizacijo</HelperText>
    </Textfield>
    <Textfield label="Učilnica/Lokacija" bind:value={location} on:change={() => setTimeout(patchSubjectName, 500)}>
        <HelperText slot="helper">Vnesite, prosimo lokacijo oz. učilnico, v kateri bo potekal ta predmet</HelperText>
    </Textfield>
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
        <Select bind:classId label="Izberite učenca" variant="outlined" style="width: 100%;">
            <Option value="" on:click={() => classId = ""}/>
            {#each studentsToAdd as c}
                <Option value={c["ID"]} on:click={() => assignToSubject(c["ID"])}>{c["Name"]}</Option>
            {/each}
        </Select>
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
                {#if sessionStorage.getItem("role") === "admin" || sessionStorage.getItem("role") === "principal" || sessionStorage.getItem("role") === "principal assistant"}
                    <Meta><IconButton class="material-icons" on:click={() => deleteFromSubject(item.ID)} title="Remove from class">delete</IconButton></Meta>
                {/if}
            </Item>
        {/each}
    </List>
{/if}
