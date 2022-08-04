<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import jwt_decode from "jwt-decode";

    import { Icon } from '@smui/common';

    import Timetable from "./Widgets/Timetable.svelte";
    import Select, {Option} from "@smui/select";

    import {baseurl} from "./constants";
    import * as marked from 'marked';
    import isMobile from "is-mobile";
    import insane from "insane";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        localStorage.clear();
        window.location.href = "/login";
    }

    let items = [];
    let classId = "";

    let systemNotifications = [];

    const mobile = isMobile();

    const decoded = jwt_decode(token);

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

    function getSystemNotifications() {
        fetch(`${baseurl}/system/notifications`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => systemNotifications = json.data);
    }

    loadThings()
    getSystemNotifications();
</script>

<Drawer active="pregled" />
<AppContent class="app-content">
    <main class="main-content">
        {#each systemNotifications as notification}
            <div
                    tabindex="0"
                    style="background-color: #f57c00; padding: 10px;"
            >
                {@html insane(marked.marked(notification.Notification))}
            </div>
        {/each}
        {#if mobile && !(decoded.role === "student" || decoded.role === "parent")}
            <p/>
            <div
                    tabindex="0"
                    style="background-color: #f57c00; padding: 10px;"
            >
                Uporabniška izkušnja je na mobilnih napravah zelo okrnjena za delavce šole zaradi prikazovanja veliko podatkov na zaslonu.
                Za čim boljšo uporabniško izkušnjo, razvijalci MeetPlan sistema priporočajo uporabo računalnikov (namiznih ali prenosnih).
            </div>
        {/if}
        <h1>Pozdravljeni v MeetPlan sistemu</h1>
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