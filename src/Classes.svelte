<script lang="ts">
    import List, {
        Item,
        Text,
        Meta
    } from '@smui/list';

    import IconButton from "@smui/icon-button";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import Button, {Label} from "@smui/button";

    import Select, {Option} from "@smui/select";

    import { navigate } from "svelte-routing";
    import {baseurl} from "./constants";

    let items = [];
    let teachers = [];

    async function getClasses() {
        let response = await fetch(`${baseurl}/classes/get`, {credentials: "include"});
        let r = await response.json();
        items = r["data"];
    }

    async function getTeachers() {
        let response = await fetch(`${baseurl}/teachers/get`, {credentials: "include"});
        let r = response.json();
        teachers = r["data"];
    }

    getClasses();
    getTeachers();

    let nclass = "";
    let teacherId = "";
    let classYear = "";

    async function newClass() {
        let fd = new FormData();
        fd.append("teacher_id", teacherId);
        fd.append("name", nclass);
        fd.append("class_year", classYear);
        await fetch(`${baseurl}/class/new`, {credentials: "include", method: "POST", body: fd})
        await getClasses();
    }

    async function deleteClass(cid: string) {
        await fetch(`${baseurl}/class/get/${cid}`, {credentials: "include", method: "DELETE"})
        await getClasses();
    }
</script>

{#if localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant"}
    <Textfield label="Nov razred" bind:value={nclass}>
        <HelperText slot="helper">Vpišite prosimo ime novega razreda</HelperText>
    </Textfield>
    <Textfield label="Šolsko leto" bind:value={classYear} style="width: 100%;">
        <HelperText slot="helper">Vpišite prosimo šolsko leto - to ime se bo prikazalo na spričevalu, zato bodite še posebej previdni (primer - 2021/2022)</HelperText>
    </Textfield>
    <Select bind:value={teacherId} label="Izberite razrednika" variant="outlined">
        <Option value=""/>
        {#each teachers as c}
            <Option value={c["ID"]} on:click={() => teacherId = c["ID"]}>{c["Name"]}</Option>
        {/each}
    </Select>
    <Button on:click={() => newClass()} variant="raised">
        <Label>OK</Label>
    </Button>
{/if}
<List class="demo-list">
    {#each items as item}
        <Item on:SMUI:action={() => navigate("/class/" + item["ID"])}>
            <Text>{item["Name"]}</Text>
            <Meta><IconButton class="material-icons" on:click={(e) => {
                e.stopPropagation();
                deleteClass(item["ID"])
            }} title="Remove from class">delete</IconButton></Meta>
        </Item>
    {/each}
</List>
