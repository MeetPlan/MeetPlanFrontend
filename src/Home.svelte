<script lang="ts">
    import Timetable from "./Widgets/Timetable.svelte";
    import Select, {Option} from "@smui/select";

    import {baseurl} from "./constants";
    import * as marked from 'marked';
    import isMobile from "is-mobile";
    import insane from "insane";
    import {onMount} from "svelte";

    let date = new Date();

    let items = [];
    let classId = "";

    let systemNotifications = [];

    const mobile = isMobile();

    async function getClasses() {
        let response = await fetch(`${baseurl}/${(localStorage.getItem("role") === "student" || localStorage.getItem("role") === "parent" ? 'user/get/classes' : "classes/get")}`, {credentials: "include"});
        let r = await response.json();
        items = r["data"];
    }

    async function getSystemNotifications() {
        let response = await fetch(`${baseurl}/system/notifications`, {credentials: "include"})
        let json = await response.json()
        systemNotifications = json.data
    }

    onMount(async () => {
        await getClasses()
        await getSystemNotifications();
    });
</script>

{#each systemNotifications as notification}
    <div
            tabindex="0"
            style="background-color: #f57c00; padding: 10px;"
    >
        {@html insane(marked.marked(notification.Notification))}
    </div>
{/each}
{#if mobile && !(localStorage.getItem("role") === "student" || localStorage.getItem("role") === "parent")}
    <p/>
    <div
            tabindex="0"
            style="background-color: #f57c00; padding: 10px;"
    >
        Uporabniška izkušnja je na mobilnih napravah zelo okrnjena za delavce šole zaradi prikazovanja veliko podatkov na zaslonu.
        Za čim boljšo uporabniško izkušnjo, razvijalci MeetPlan sistema priporočajo uporabo računalnikov (namiznih ali prenosnih).
    </div>
{/if}
Vaša dovoljenja: <b>{localStorage.getItem("role")}</b>
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
    <Timetable classId={classId} dateCallback={(d) => date = d} date={date} />
{/if}
