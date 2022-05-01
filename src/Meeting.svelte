<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import {navigate} from "svelte-routing";
    import jwt_decode, { JwtPayload } from "jwt-decode";
    import Button, {Label} from "@smui/button";
    import Icon from '@smui/textfield/icon';
    import {baseurl} from "./constants";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import Select, {Option} from "@smui/select";
    import * as marked from 'marked';

    import { chart } from "svelte-apexcharts";
    let options;

    export let meetingId: number;

    let meetingData;

    let realization = 0;
    let realizationDone = 0;

    function fmtDate(date: Date): string {
        let dd = date.getDate().toString()
        if (dd < 10) {
            dd = `0${dd}`
        }
        let mm = date.getMonth().toString();
        if (mm < 10) {
            mm = `0${(date.getMonth() + 1).toString()}`
        }
        return `${dd}-${mm}-${date.getFullYear()}`
    }

    let teachers = [];
    let isSubstitution = false;
    let teacherId: number = undefined;
    let protonRatings = [];

    function getTeachers() {
        fetch(`${baseurl}/teachers/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    teachers = json["data"];
                },
            );
    }

    function getProtonSubstitutionRatings() {
        fetch(`${baseurl}/meeting/get/${meetingId}/substitutions/proton`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    protonRatings = json["data"];
                },
            );
    }


    function getMeetingData() {
        fetch(`${baseurl}/meeting/get/${meetingId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                meetingData = r.data;
                isSubstitution = meetingData.IsSubstitution;
                teacherId = meetingData.TeacherID;
                realizationDone = meetingData.Subject.RealizationDone;
                realization = meetingData.Subject.Realization;
                options = {
                    chart: {
                        type: "donut",
                        width: "25%",
                        offsetX: 0,
                    },
                    series: [realizationDone, realization-realizationDone],
                    labels: ["Trenutna realizacija", "Realizacija"],
                };
            })
    }

    function deleteMeeting() {
        fetch(`${baseurl}/meetings/new/${meetingId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((r) => r.json())
            .then((r) => navigate("/"))
    }

    function patchMeeting() {
        let fd = new FormData()
        fd.append("subjectId", meetingData.SubjectID);
        fd.append("date", meetingData.Date);
        fd.append("name", meetingData.MeetingName);
        fd.append("details", meetingData.Details);
        fd.append("url", meetingData.URL);
        fd.append("hour", meetingData.Hour)
        fd.append("is_mandatory", meetingData.IsMandatory)
        fd.append("is_grading", meetingData.IsGrading)
        fd.append("is_written_assessment", meetingData.IsWrittenAssessment)
        fd.append("is_test", meetingData.IsTest)
        fd.append("is_substitution", isSubstitution.toString())
        fd.append("teacherId", teacherId.toString());
        fetch(`${baseurl}/meetings/new/${meetingId}`,
            {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, body: fd, method: "PATCH"})
            .then((r) => r.json())
            .then((r) => getMeetingData())
    }

    getMeetingData();

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    let items = [];
    let classId = "";

    const decoded = jwt_decode<JwtPayload>(token);

    if (decoded["role"] === "admin" || decoded["role"] === "principal" || decoded["role"] === "principal assistant") {
        getTeachers();
        getProtonSubstitutionRatings();
    }
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
            <p>Je nadomeščanje: <b>{meetingData.IsSubstitution ? "Ja" : "Ne"}</b></p>
            {#if meetingData.Details !== ""}
                <h4>Opis srečanja:</h4>
                {@html marked.marked(meetingData.Details)}
            {/if}
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
            {#if decoded["role"] === "admin" || decoded.role === "principal" || decoded.role === "principal assistant"}
                <p/>
                <FormField>
                    <Switch bind:checked={isSubstitution} on:click={() => {
                        // Wait for the component to set new state
                        setTimeout(() => {
                            if (!isSubstitution) {
                                patchMeeting();
                            }
                        }, 200);
                    }} />
                    Je nadomeščanje
                </FormField>
                {#if isSubstitution}
                    <p/>
                    <Select bind:selected={meetingData.TeacherID} label="Izberite učitelja za nadomeščanje" variant="outlined" style="width: 100%;">
                        <Option value="" on:click={() => teacherId = undefined}/>
                        {#each teachers as c}
                            <Option on:click={async () => {
                                teacherId = c.ID;
                                patchMeeting();
                            }} value={c.ID}>{c["Name"]}</Option>
                        {/each}
                    </Select>
                    {#if protonRatings.length == 0}
                        Proton ni uspel oceniti najboljše možne zamenjave. <p/>
                    {:else}
                        Proton je sestavil lestvico najboljših možnih zamenjav: <p/>
                        {#each protonRatings as p}
                            {p.Name} je dobil(a) {p.Tier} točk na Proton lestvici <br>
                        {/each}
                    {/if}
                {/if}
            {/if}
            <p/>
            <div use:chart={options}/>
        {/if}
    </main>
</AppContent>
