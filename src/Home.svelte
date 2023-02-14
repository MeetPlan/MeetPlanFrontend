<script lang="ts">
    import Timetable from "./Widgets/Timetable.svelte";
    import Select, {Option} from "@smui/select";

    import {baseurl} from "./constants";
    import * as marked from 'marked';
    import isMobile from "is-mobile";
    import insane from "insane";

    import Cookies from "js-cookie";
    import {onMount} from "svelte";
    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        document.cookie = "";
        window.location.href = "/login";
    }

    let date = new Date();

    let items = [];
    let classId = "";

    let systemNotifications = [];

    const mobile = isMobile();

    function loadThings() {
        fetch(`${baseurl}/${(localStorage.getItem("role") === "student" || localStorage.getItem("role") === "parent" ? 'user/get/classes' : "classes/get")}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
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
                document.cookie = "";
                window.location.href = "/login";
        });
    }

    async function getSystemNotifications() {
        let response = await fetch(`${baseurl}/system/notifications`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let json = await response.json()
        systemNotifications = json.data
    }

    onMount(async () => {
        loadThings()
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
<h1>Pozdravljeni v MeetPlan sistemu</h1>
<b>Vaša dovoljenja: {localStorage.getItem("role")}</b>
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
