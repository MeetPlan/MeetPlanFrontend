<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import Select, {
        Option,
    } from '@smui/select';

    import List, {Item, Text as TextList, Meta} from "@smui/list";
    import IconButton from "@smui/icon-button";

    let classes = [];
    let myClasses = [];
    let classId = "";

    export let id: number;

    function getClasses() {
        fetch("http://127.0.0.1:8000/classes/get", {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => classes = r["data"]);
    }

    function getMyClasses() {
        fetch("http://127.0.0.1:8000/user/get/classes?id=" + id, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => myClasses = r["data"]);
    }

    function assignToClass(cid: string) {
        fetch("http://127.0.0.1:8000/class/get/" + cid + "/add_user/" + id, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => getMyClasses());
    }

    function deleteFromClass(cid: string) {
        fetch("http://127.0.0.1:8000/class/get/" + cid + "/remove_user/" + id, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((r) => getMyClasses());
    }

    getClasses();
    getMyClasses();
</script>

<Drawer active="user" />
<AppContent class="app-content">
    <main class="main-content">
        <h2>Dodaj učenca v razred:</h2>
        <Select bind:classId label="Izberite razred" variant="outlined">
            <Option value=""/>
            {#each classes as c}
                <Option on:click={() => {assignToClass(c["ID"])}} value={c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
        <h2>Razredi, v katere je učenec dodan:</h2>
        <List class="demo-list">
            {#each myClasses as item}
                <Item>
                    <TextList>{item["Name"]}</TextList>
                    <Meta><IconButton class="material-icons" on:click={() => deleteFromClass(item["ID"])} title="Remove from class">delete</IconButton></Meta>
                </Item>
            {/each}
        </List>
    </main>
</AppContent>