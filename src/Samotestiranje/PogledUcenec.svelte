<script lang="ts">
    import Button, {Icon, Label} from "@smui/button";
    import {baseurl, saveBlob} from "../constants";

    import {onMount} from "svelte";

    let testings = [];
    let classId = "";

    async function getTestings() {
        let response = await fetch(`${baseurl}/user/self_testing/get_results`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
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
    <Button on:click={() => {
        fetch(`${baseurl}/user/self_testing/get_results/pdf/${test["ID"]}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.blob())
            .then((blob) => saveBlob(blob))
            .catch((err) => {
            console.log(err);
          });
    }}>
        <Icon class="material-icons">download</Icon>
        <Label>Prenos potrdila o samotestiranju</Label>
    </Button>
    <hr>
{/each}
