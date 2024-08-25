<script lang="ts">
    import Button, {Icon, Label} from "@smui/button";
    import {baseurl, saveBlob} from "../constants";

    import {onMount} from "svelte";

    let testings = [];
    let classId = "";

    async function getTestings() {
        let response = await fetch(`${baseurl}/user/self_testing/get_results`, {credentials: "include"})
        const r = await response.json();
        testings = r["data"];
    }

    onMount(async () => {
        await getTestings();
    });
</script>

{#each testings as test}
    <h1>Samotestiranje</h1>
    Učitelj: {test.TeacherName}
    <br>
    Datum testiranja: {test.Date}
    <br>
    Veljavno do: {test.ValidUntil}
    <br>
    Rezultat: <b>{test.Result}</b>
    <p />
    <Button on:click={async () => {
        let response = await fetch(`${baseurl}/user/self_testing/get_results/pdf/${test["ID"]}`, {credentials: "include"});
        let blob = await response.blob();
        await saveBlob(blob);
    }}>
        <Icon class="material-icons">download</Icon>
        <Label>Prenos potrdila o samotestiranju</Label>
    </Button>
    <hr>
{/each}
