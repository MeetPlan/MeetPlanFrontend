<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import List, {Item, Text as TextList, Meta, Graphic, PrimaryText, SecondaryText} from "@smui/list";
    import IconButton from "@smui/icon-button";

    import Avatar from "svelte-avatar";

    import {baseurl} from "./constants";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';

    let myClasses;
    let students;
    let classId = "";
    let classYear = "";

    export let id: number;

    async function getClass() {
        let response = await fetch(`${baseurl}/class/get/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        let r = await response.json();
        students = r["data"];
        classYear = students["ClassYear"];
    }

    function assignToClass(cid: string) {
        fetch(`${baseurl}/class/get/${id}/add_user/${cid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    function deleteFromClass(cid: string) {
        fetch(`${baseurl}/class/get/${id}/remove_user/${cid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    function patchClass() {
        let fd = new FormData();
        fd.append("class_year", classYear);
        fetch(`${baseurl}/class/get/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH", body: fd})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    getClass()
</script>

<Drawer active="user" />
<AppContent class="app-content">
    <main class="main-content">
        {#if students !== undefined}
            <Textfield label="Šolsko leto" bind:value={classYear} style="width: 100%;" on:change={() => patchClass()}>
                <HelperText slot="helper">Vpišite prosimo šolsko leto - to ime se bo prikazalo na spričevalu, zato bodite še posebej previdni (primer - 2021/2022)</HelperText>
            </Textfield>
            <h2>Učitelj:</h2>
            <List class="demo-list" twoLine avatarList>
                <Item>
                    <Avatar name={students["TeacherName"]}/><div style="width: 15px;"/>
                    <TextList>
                        <PrimaryText>{students.TeacherName}</PrimaryText>
                    </TextList>
                </Item>
            </List>
            <h2>Učenci:</h2>
            <List class="demo-list" twoLine avatarList>
                {#each students.Students as item}
                    <Item>
                        <Avatar name={item.Name}/><div style="width: 15px;"/>
                        <TextList>
                            <PrimaryText>{item.Name}</PrimaryText>
                        </TextList>
                        <Meta><IconButton class="material-icons" on:click={() => deleteFromClass(item.ID)} title="Remove from class">delete</IconButton></Meta>
                    </Item>
                {/each}
            </List>
        {/if}
    </main>
</AppContent>
