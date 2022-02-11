<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import {navigate} from "svelte-routing";
    import jwt_decode, { JwtPayload } from "jwt-decode";
    import Button, {Label} from "@smui/button";
    import Icon from '@smui/textfield/icon';
    import {baseurl} from "./constants";

    export let meetingId: number;

    let meetingData;

    function getMeetingData() {
        fetch(`${baseurl}/meeting/get/${meetingId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => meetingData = r.data)
    }

    function deleteMeeting() {
        fetch(`${baseurl}/meetings/new/${meetingId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((r) => r.json())
            .then((r) => navigate("/"))
    }

    getMeetingData();

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    let items = [];
    let classId = "";

    const decoded = jwt_decode<JwtPayload>(token);
</script>

<Drawer active="srecanje" meetingActive={meetingId} />
<AppContent class="app-content">
    <main class="main-content">
        {#if meetingData !== undefined}
            <h1>{meetingData.MeetingName}</h1>
            <p>Učitelj: <b>{meetingData.TeacherName}</b></p>
            <p>Datum: <b>{meetingData.Date}</b></p>
            <p>Ura: <b>{meetingData.Hour}.</b></p>
            <p>Je obvezno: <b>{meetingData.IsMandatory ? "Ja" : "Ne"}</b></p>
            <p>Je ocenjevanje znanja: <b>{meetingData.IsGrading ? "Ja" : "Ne"}</b></p>
            {#if meetingData.IsGrading}
                <p>Je pisno ocenjevanje znanja: <b>{meetingData.IsWrittenAssessment}</b></p>
            {/if}
            <p>Je preverjanje znanja: <b>{meetingData.IsTest ? "Ja" : "Ne"}</b></p>
            <pre>
                {meetingData.Details}
            </pre>
            <a href="{meetingData.URL}">Povezava do srečanja</a>
            {#if decoded["role"] === "admin" || decoded["user_id"] === meetingData.TeacherID}
                <p/>
                <Button on:click={() => navigate("/edit/" + meetingData.ID)}>
                    <Icon class="material-icons">edit</Icon>
                    <Label>Uredi</Label>
                </Button>
                <Button on:click={() => deleteMeeting()}>
                    <Icon class="material-icons">delete</Icon>
                    <Label>Izbriši</Label>
                </Button>
            {/if}
        {/if}
    </main>
</AppContent>
