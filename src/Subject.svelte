<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import List, {Item, Text as TextList, Meta, Graphic, PrimaryText} from "@smui/list";
    import IconButton from "@smui/icon-button";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';

    import {subjects} from "./Constants/consts";

    import Avatar from "svelte-avatar";

    import Autocomplete from '@smui-extra/autocomplete';
    import {baseurl} from "./constants";
    import Select, {Option} from "@smui/select";

    let myClasses;
    let students;
    let studentsToAdd = [];
    let classId = "";
    let longName = "";

    export let id: number;

    function getSubject() {
        fetch(`${baseurl}/subject/get/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => {
                longName = r.data.LongName;
                students = r.data;
            });
    }

    function patchSubjectName() {
        let fd = new FormData();
        fd.append("long_name", longName)
        fetch(`${baseurl}/subject/get/${id}/long_name`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH", body: fd})
            .then((response) => response.json())
            .then((r) => getSubject());
    }

    function getStudents() {
        fetch(`${baseurl}/students/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => studentsToAdd = r.data);
    }

    function assignToSubject(cid: string) {
        fetch(`${baseurl}/subject/get/${id}/add_user/${cid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => getSubject());
    }

    function deleteFromSubject(cid: string) {
        fetch(`${baseurl}/subject/get/${id}/remove_user/${cid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((r) => getSubject());
    }

    getSubject()
    getStudents();
</script>

<Drawer active="user" />
<AppContent class="app-content">
    <main class="main-content">
        {#if students !== undefined}
            <Autocomplete combobox options={subjects} style="width: 100%;" bind:value={longName} label="Izberite ali vpišite dolgo ime predmeta, če ga ni vpisanega" on:change={() => setTimeout(patchSubjectName, 500)} />
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
                        <Meta><IconButton class="material-icons" on:click={() => deleteFromSubject(item.ID)} title="Remove from class">delete</IconButton></Meta>
                    </Item>
                {/each}
            </List>
        {/if}
    </main>
</AppContent>
