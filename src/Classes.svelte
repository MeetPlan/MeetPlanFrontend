<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

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

    let items = [];
    let teachers = [];

    function loadThings() {
        fetch('http://127.0.0.1:8000/classes/get', {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    items = json["data"];
                },
            );
    }

    function getTeachers() {
        fetch('http://127.0.0.1:8000/teachers/get', {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    teachers = json["data"];
                },
            );
    }

    loadThings();
    getTeachers();

    let nclass = "";
    let teacherId = "";

    function newClass() {
        let fd = new FormData();
        fd.append("teacher_id", teacherId);
        fd.append("name", nclass);
        fetch('http://127.0.0.1:8000/class/new', {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "POST", body: fd})
            .then((response) => response.json())
            .then((json) => {
                    loadThings();
                },
            );
    }

    function deleteClass(cid: number) {
        fetch('http://127.0.0.1:8000/class/get/' + cid, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((json) => {
                    loadThings();
                },
            );
    }
</script>

<Drawer active="classes" />
<AppContent class="app-content">
    <main class="main-content">
        <Textfield label="Nov razred" bind:value={nclass}>
            <HelperText slot="helper">Vpišite prosimo, ime novega razreda</HelperText>
        </Textfield>
        <Select bind:teacherId label="Izberite razrednika" variant="outlined">
            <Option value=""/>
            {#each teachers as c}
                <Option value={c["ID"]} on:click={() => teacherId = c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
        <Button on:click={() => newClass()} variant="raised">
            <Label>OK</Label>
        </Button>
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
    </main>
</AppContent>