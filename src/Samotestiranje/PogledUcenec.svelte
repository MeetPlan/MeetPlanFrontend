<script lang="ts">
    import Drawer from "../Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import Button, {Icon, Label} from "@smui/button";

    import {onMount} from "svelte";

    let testings = [];
    let classId = "";

    async function getTestings() {
        let response = await fetch("http://127.0.0.1:8000/user/self_testing/get_results", {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        const r = await response.json();
        testings = r["data"];
    }

    onMount(async () => {
        await getTestings();
    });
</script>

<Drawer active="samotestiranje" />
<AppContent class="app-content">
    <main class="main-content">
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
                fetch("http://127.0.0.1:8000/user/self_testing/get_results/pdf/" + test["ID"], {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
                    .then((response) => response.blob())
                    .then((blob) => {
                      var _url = window.URL.createObjectURL(blob);
                      window.open(_url, "_blank").focus();
                  }).catch((err) => {
                    console.log(err);
                  });
            }}>
                <Icon class="material-icons">download</Icon>
                <Label>Prenos potrdila o samotestiranju</Label>
            </Button>
            <hr>
        {/each}
    </main>
</AppContent>