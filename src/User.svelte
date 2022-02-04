<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import Select, {
        Option,
        Text,
    } from '@smui/select';

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import Button, {Label} from "@smui/button";

    import { navigate } from "svelte-routing";

    let classes = [];
    let classId = "";

    function getClasses() {
        fetch("http://127.0.0.1:8000/classes/get", {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => classes = r["data"]);
    }

    function assignToClass(cid: string) {
        fetch("http://127.0.0.1:8000/class/get/" + cid + "/add_user/" + id, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => console.log("R"));
    }

    getClasses();

    export let id: number;
</script>

<Drawer active="user" />
<AppContent class="app-content">
    <main class="main-content">
        <Select bind:classId label="Izberite razred" variant="outlined">
            <Option value="" on:click={() => console.log("T")}/>
            {#each classes as c}
                <Option on:click={() => {assignToClass(c["ID"])}} value={c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
    </main>
</AppContent>