<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import jwt_decode, { JwtPayload } from "jwt-decode";

    import Timetable from "./Widgets/Timetable.svelte";
    import Select, {Option} from "@smui/select";

    import {baseurl} from "./constants";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        localStorage.clear();
        window.location.href = "/login";
    }

    let items = [];
    let classId = "";

    const decoded = jwt_decode<JwtPayload>(token);

    function loadThings() {
        fetch(`${baseurl}/${(decoded["role"] === "student" || decoded.role === "parent" ? 'user/get/classes' : "classes/get")}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => {
                if (response.ok) {
                    return response
                }
                throw Error("invalid request")
            })
            .then((response) => response.json())
            .then((json) => {
                    items = json["data"];
                },
            ).catch((e) => {
                console.log(e)
                localStorage.clear();
                window.location.href = "/login";
        });
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
        <Select bind:classId variant="outlined">
            <Option value="" on:click={() => {
                classId = undefined;
                setTimeout(() => classId = "", 100)
            }}>Moja srečanja</Option>
            {#each items as c}
                <Option on:click={async () => {
                    classId = undefined;
                    // We timeout to get effect of changing
                    setTimeout(() => {
                        classId = c["ID"];
                    }, 100);
                }} value={c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
        <p/>
        {#if classId !== undefined}
            <Timetable classId={classId} />
        {/if}
    </main>
</AppContent>