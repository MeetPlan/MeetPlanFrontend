<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import jwt_decode, { JwtPayload } from "jwt-decode";

    import Timetable from "./Widgets/Timetable.svelte";
    import Select, {Option} from "@smui/select";

    import { navigate } from "svelte-routing";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    let items = [];
    let classId = "";

    const decoded = jwt_decode<JwtPayload>(token);

    function loadThings() {
        fetch('http://127.0.0.1:8000' + (decoded["role"] === "student" ? '/user/get/classes' : "/classes/get"), {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    items = json["data"];
                },
            );
    }

    loadThings()
</script>

<Drawer active="pregled" />
<AppContent class="app-content">
    <main class="main-content">
        <h1>Pozdravljeni</h1>
        <h3>To je pregled po MeetPlan sistemu.</h3>
        <h3>MeetPlan je bil popolnoma prenovljen. Dobrodošli v verzijo 2.0</h3>
        <b>Vaša dovoljenja: {decoded["role"]}</b>
        <hr />
        <Select bind:classId label="Izberite razred" variant="outlined">
            <Option value="" on:click={() => classId = ""}/>
            {#each items as c}
                <Option on:click={async () => {
                    classId = "";
                    setTimeout(() => {
                        classId = c["ID"];
                    }, 100);
                }} value={c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
        <p/>
        {#if classId !== ""}
            <Timetable classId={classId} />
        {/if}
    </main>
</AppContent>