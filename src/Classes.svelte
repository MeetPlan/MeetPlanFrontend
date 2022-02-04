<script>
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import List, {
        Item,
        Text,
    } from '@smui/list';

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import Button, {Label} from "@smui/button";

    import { navigate } from "svelte-routing";

    let items = [];

    function loadThings() {
        fetch('http://127.0.0.1:8000/classes/get', {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    items = json["data"];
                },
            );
    }

    loadThings();

    let nclass = "";

    function newClass() {
        let fd = new FormData();
        // TODO: Popravi to
        fd.append("teacher_id", "1");
        fd.append("name", nclass);
        fetch('http://127.0.0.1:8000/class/new', {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "POST", body: fd})
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
        <Button on:click={() => newClass()} variant="raised">
            <Label>OK</Label>
        </Button>
        <List class="demo-list">
            {#each items as item}
                <Item on:SMUI:action={() => navigate("/class/" + item["ID"])}><Text>{item["Name"]}</Text></Item>
            {/each}
        </List>
    </main>
</AppContent>