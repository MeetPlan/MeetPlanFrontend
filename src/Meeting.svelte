<script lang="ts">
    import {navigate} from "svelte-navigator";

    import Button, {Label} from "@smui/button";
    import Icon from '@smui/textfield/icon';
    import {baseurl} from "./constants";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import Select, {Option} from "@smui/select";
    import * as marked from 'marked';

    import { chart } from "svelte-apexcharts";
    import Timetable from "./Widgets/Timetable.svelte";
    import insane from "insane";
    import Cookies from "js-cookie";

    let options;

    export let meetingId: string;

    function removeAllTooltips() {
        // this is incredible junk, but it works
        [...document.getElementsByClassName("mdc-tooltip")].map(n => n && n.remove());
    }

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

    function reverseFmtDate(date: string): string {
        let pieces = date.split("-");
        return `${pieces[2]}-${pieces[1]}-${pieces[0]}`
    }

    let teachers = [];
    let isSubstitution = false;
    let teacherId: number = undefined;
    let protonRatings = [];

    function getTeachers() {
        fetch(`${baseurl}/teachers/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((json) => {
                    teachers = json["data"];
                },
            );
    }

    function getProtonSubstitutionRatings() {
        fetch(`${baseurl}/meeting/get/${meetingId}/substitutions/proton`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((json) => {
                    protonRatings = json["data"];
                },
            );
    }


    function getMeetingData() {
        fetch(`${baseurl}/meeting/get/${meetingId}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
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
                        width: "400px",
                        offsetX: 0,
                    },
                    series: [realizationDone, realization-realizationDone],
                    labels: ["Trenutna realizacija", "Realizacija"],
                };
            })
    }

    function deleteMeeting() {
        fetch(`${baseurl}/meetings/new/${meetingId}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
            .then((r) => r.json())
            .then((r) => navigate("/"))
    }

    function patchMeeting() {
        let fd = new FormData()
        fd.append("subjectId", meetingData.Subject.ID);
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
        fd.append("location", meetingData.Location);
        fetch(`${baseurl}/meetings/new/${meetingId}`,
            {headers: {"Authorization": "Bearer " + Cookies.get("key")}, body: fd, method: "PATCH"})
            .then((r) => r.json())
            .then((r) => getMeetingData())
    }

    getMeetingData();

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    let items = [];
    let classId = "";

    removeAllTooltips();

    if (localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant") {
        getTeachers();
        getProtonSubstitutionRatings();
    }
</script>

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
        {@html insane(marked.marked(meetingData.Details))}
    {/if}
    <a href="{meetingData.URL}">Povezava do srečanja</a>
    {#if localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant" || localStorage.getItem("userId") === meetingData.Subject.TeacherID.toString() || localStorage.getItem("userId") === meetingData.TeacherID.toString()}
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
    <p/>
    <div use:chart={options}/>
    {#if localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant"}
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
            <p/>
            {#if protonRatings.length === 0}
                Proton ni uspel oceniti najboljše možne zamenjave. <p/>
            {:else}
                Proton je sestavil lestvico najboljših možnih zamenjav: <p/>
                {#each protonRatings as p}
                    <h2>{p.Name}</h2>
                    {p.Name} je dobil(a) <b>{p.Tier}</b> točk na Proton lestvici, ker: <br>
                    <ul>
                        {#if p.GradingList.TeachesSameSubject}
                            <li>Uči isti predmet - 5 točk</li>
                        {/if}
                        {#if p.GradingList.HasMeetingBefore}
                            <li>Ima učno uro prej (tako zapolnimo možne luknje, ki bi bile neugodne učiteljem) - 3 točke</li>
                        {/if}
                        {#if p.GradingList.HasMeetingLater}
                            <li>Ima učno uro pozneje (tako zapolnimo možne luknje, ki bi bile neugodne učiteljem) - 3 točke</li>
                        {/if}
                        {#if p.GradingList.HasMeeting2HBefore}
                            <li>Ima učno uro dve uri prej (tako zapolnimo možne luknje, ki bi bile neugodne učiteljem) - 1 točka</li>
                        {/if}
                        {#if p.GradingList.HasMeeting2HLater}
                            <li>Ima učno uro dve uri kasneje (tako zapolnimo možne luknje, ki bi bile neugodne učiteljem) - 1 točka</li>
                        {/if}
                    </ul>
                    <h3>Urnik učitelja:</h3>
                    <Timetable teacherId="{p.TeacherID}" date={new Date(reverseFmtDate(meetingData.Date))} hour={meetingData.Hour} />
                {/each}
            {/if}
        {/if}
    {/if}
{/if}
