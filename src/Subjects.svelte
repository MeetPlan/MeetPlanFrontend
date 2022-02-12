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
    import {baseurl} from "./constants";

    let items = [];
    let teachers = [];
    let subjects = [];

    function loadThings() {
        fetch(`${baseurl}/classes/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    items = json["data"];
                },
            );
    }

    function getSubjects() {
        fetch(`${baseurl}/subjects/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    subjects = json["data"];
                },
            );
    }

    function getTeachers() {
        fetch(`${baseurl}/teachers/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    teachers = json["data"];
                },
            );
    }

    loadThings();
    getTeachers();
    getSubjects();

    let nclass = "";
    let teacherId = "";
    let classId = "";

    function newSubject() {
        let fd = new FormData();
        fd.append("teacher_id", teacherId);
        fd.append("name", nclass);
        fd.append("class_id", classId);
        fetch(`${baseurl}/subjects/new`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "POST", body: fd})
            .then((response) => response.json())
            .then((json) => {
                    getSubjects();
                },
            );
    }

    function deleteSubject(cid: number) {
        fetch(`${baseurl}/subject/get/${cid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((json) => {
                    getSubjects();
                },
            );
    }
</script>

<Drawer active="subjects" />
<AppContent class="app-content">
    <main class="main-content">
        <Textfield label="Nov predmet" bind:value={nclass}>
            <HelperText slot="helper">Vpišite prosimo ime novega predmeta</HelperText>
        </Textfield>
        <p/>
        <Select bind:classId label="Izberite razred" variant="outlined" style="width: 100%;">
            <Option value="" on:click={() => classId = ""}>Bom ročno dodal uporabnike (ne uporabi razreda)</Option>
            {#each items as c}
                <Option value={c["ID"]} on:click={() => classId = c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
        <p/>
        <Select bind:teacherId label="Izberite učitelja tega predmeta" variant="outlined" style="width: 100%;">
            <Option value="" />
            {#each teachers as c}
                <Option value={c["ID"]} on:click={() => teacherId = c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
        <p/>
        <Button on:click={() => newSubject()} variant="raised">
            <Label>OK</Label>
        </Button>
        <List class="demo-list">
            {#each subjects as item}
                <Item on:SMUI:action={() => navigate("/subject/" + item["ID"])}>
                    <Text>{item["Name"]}</Text>
                    <Meta><IconButton class="material-icons" on:click={(e) => {
                        e.stopPropagation();
                        deleteSubject(item["ID"])
                    }} title="Remove from class">delete</IconButton></Meta>
                </Item>
            {/each}
        </List>
    </main>
</AppContent>
