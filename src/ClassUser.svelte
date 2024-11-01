<script lang="ts">
    import {navigate} from "svelte-routing";
    import Button from "@smui/button";
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {baseurl, saveBlob} from "./constants";
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import IconButton, { Icon } from '@smui/icon-button';
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import * as marked from 'marked';
    import List, {
        Item,
        Meta,
    } from '@smui/list';
    import insane from "insane";
    import Tooltip, {Wrapper} from "@smui/tooltip";

    let grades;
    let userData;
    let absences = [];

    const c = {
        "UNMANAGED": "Še ne urejeno",
        "ABSENT": "Odsoten",
        "PRESENT": "Prisoten",
        "PRESENT ONLINE": "Prisoten na daljavo",
        "LATE": "Zamudil",
    }

    export let studentId: number;

    let absenceList = [];
    let homework = [];
    let gradings = [];
    let improvements = [];

    let viewGrades = true;
    let viewAbsences = true;
    let viewHomework = true;
    let viewGradings = true;

    let isPassing = true;
    let printTemplate = false;

    async function getUserData() {
        let response = await fetch(`${baseurl}/user/get/data/${studentId}`, {credentials: "include"})
        let r = await response.json()
        userData = r["data"];
        isPassing = userData.IsPassing;
    }

    async function getImprovements() {
        let response = await fetch(`${baseurl}/user/get/improvements?studentId=${studentId}`, {credentials: "include"})
        let r = await response.json()
        improvements = r.data;
    }

    async function getAbsences() {
        let response = await fetch(`${baseurl}/user/get/absences/${studentId}`, {credentials: "include"})
        let r = await response.json()
        absences = r["data"];
        let al = [];
        for (let absence in absences) {
            al = [...al, !(absences[absence].IsExcused)]
        }
        console.log(al);
        absenceList = al;
    }

    async function getUserGradings() {
        let response = await fetch(`${baseurl}/my/gradings?studentId=${studentId}`, {credentials: "include"})
        let r = await response.json()
        gradings = r["data"];
    }

    async function getHomework() {
        let response = await fetch(`${baseurl}/user/get/homework/${studentId}`, {credentials: "include"})
        let r = await response.json()
        homework = r["data"];
    }

    async function getGrades() {
        let response = await fetch(`${baseurl}/my/grades?studentId=${studentId}`, {credentials: "include"})
        let r = await response.json();
        if (r.data !== "Forbidden") {
            grades = r.data;
        }
    }

    async function getParentConfig() {
        if (localStorage.getItem("role") === "parent") {
            let response = await fetch(`${baseurl}/parents/get/config`, {credentials: "include"})
            let r = await response.json()
            let data = r["data"];
            viewAbsences = data["parent_view_absences"];
            viewHomework = data["parent_view_homework"];
            viewGrades = data["parent_view_grades"];
            viewGradings = data["parent_view_gradings"];
            if (viewGrades) {
                await getGrades();
            }
            if (viewHomework) {
                await getHomework();
            }
            if (viewAbsences) {
                await getAbsences();
            }
            if (viewGradings) {
                await getUserGradings();
            }
        } else {
            await getGrades();
            await getUserData();
            await getAbsences();
            await getHomework();
            await getUserGradings();
        }
        await getImprovements();
    }

    const gradeColors = [
        "#F44336",
        "#FF9800",
        "#FFC107",
        "#8BC34A",
        "#64DD17"
    ];

    const translatedSegments = {
        "DONE": "NAREJENO",
        "ABSENT": "MANJKAL",
        "INCOMPLETE": "NEPOPOLNO",
        "NOT MANAGED": "NI VPISANO"
    }

    $: {
        console.log(studentId)
        getParentConfig();
    }
</script>

{#if userData}
    <h1>{userData.Name} {userData.Surname}</h1>
{/if}
{#if localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant" || localStorage.getItem("role") === "school psychologist"}
    <Button on:click={async () => {
        let response = await fetch(`${baseurl}/user/get/certificate_of_schooling/${studentId}`, {credentials: "include"});
        let blob = await response.blob();
        await saveBlob(blob);
    }}>
        <Icon class="material-icons">download</Icon>
        Prenesi potrdilo o šolanju
    </Button>
{/if}
<h1>Ocene</h1>
{#if viewGrades}
    <DataTable table$aria-label="People list" style="width: 100%;">
        <Head>
            <Row>
                <Cell>Predmet</Cell>
                <Cell>1. ocenjevalno obdobje</Cell>
                <Cell>2. ocenjevalno obdobje</Cell>
                <Cell>Zaključeno</Cell>
            </Row>
        </Head>
        <Body>
        {#if grades}
            {#each grades["Subjects"] as subject}
                <Row>
                    <Cell class="sameline">
                        <div style="display:inline-block;">{subject.Name}</div>
                        <div style="display:inline-block; font-size: 20px; float:right; color: gray;">{subject.Average.toFixed(2)}</div>
                    </Cell>
                    {#if subject.IsGraded}
                        {#each subject.Periods as period, i}
                            <Cell>
                                <div class="sameline">
                                    <div style="display:inline-block; width: 5px;"/>
                                    {#each period.Grades as grade}
                                        <Wrapper>
                                            <span style="color: {grade.Counts ? gradeColors[grade.Grade - 1] : 'gray'}; display:inline-block; font-size: {grade.Counts ? 20 : 15}px;">{grade.Grade}</span>
                                            <Tooltip>
                                                {#if grade.Description !== ''}
                                                    Opis ocene: {grade.Description}<br>
                                                {/if}
                                                {#if grade.CanPatch}
                                                    Se lahko popravlja
                                                {:else}
                                                    Se ne more popravljati
                                                {/if}
                                            </Tooltip>
                                        </Wrapper>
                                        <div style="display:inline-block; width: 5px;"/>
                                    {/each}
                                    <Meta style="display:inline-block; font-size: 20px; float:right;">{period.Average.toFixed(2)}</Meta>
                                </div>
                            </Cell>
                        {/each}
                        <Cell>
                            {#if subject.Final !== 0}
                                <div style="color: {gradeColors[subject.Final - 1]}; display:inline-block; font-size: 20px;">
                                    {subject.Final}
                                </div>
                            {/if}
                        </Cell>
                    {:else}
                        <Cell style="font-size: 20px;">/</Cell>
                        <Cell style="font-size: 20px;">/</Cell>
                        <Cell style="font-size: 20px;">/</Cell>
                    {/if}
                </Row>
            {/each}
        {/if}
        </Body>
    </DataTable>
{:else}
    Sistemski administrator je izključil vpogled v ocene otroka za vse starše.
{/if}
{#if localStorage.getItem("role") === "teacher" || localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant"}
    <p/>
    <FormField>
        <Switch bind:checked={isPassing} on:click={() => {
            setTimeout(async () => {
                let fd = new FormData();
                fd.append("is_passing", isPassing.toString());
                await fetch(`${baseurl}/user/get/data/${studentId}`, {credentials: "include", method: "PATCH", body: fd});
                await getUserData();
            }, 0);
        }}/>
        Bo opravil razred?
    </FormField>
    <p/>
    <FormField>
        <Switch bind:checked={printTemplate} />
        Natisni predlogo
    </FormField>
    <p/>
    <Button on:click={async () => {
        let response = await fetch(`${baseurl}/user/get/ending_certificate/${studentId}?useDocument=${printTemplate.toString()}`, {credentials: "include"});
        let blob = await response.blob();
        await saveBlob(blob);
    }}>
        <Icon class="material-icons">download</Icon>
        Prenesi spričevalo
    </Button>
{/if}
<h1>Odsotnost</h1>
{#if viewAbsences}
    <Accordion multiple>
        {#each absences as item, i}
            <Panel bind:open={absenceList[i]}>
                <Header>
                    {item["MeetingName"]}
                    <IconButton slot="icon" toggle pressed={absenceList[i]}>
                        <Icon class="material-icons" on>expand_less</Icon>
                        <Icon class="material-icons">expand_more</Icon>
                    </IconButton>
                </Header>
                <Content>
                    <List
                        twoLine
                        avatarList
                        singleSelection
                    >
                        <Item>
                            {c[item["AbsenceType"]]} - {item["IsExcused"] ? "OPRAVIČENO" : "ŠE NI OPRAVIČENO"}
                            <Meta>
                                <IconButton class="material-icons" style="color: {item['IsExcused'] ? 'green' : 'red'};" on:click={async () => {
                                    if (!(localStorage.getItem("role") === "teacher" || localStorage.getItem("role") === "admin")) {
                                        return;
                                    }
                                    await fetch(`${baseurl}/user/get/absences/${studentId}/excuse/${item["ID"]}`, {credentials: "include", method: "PATCH"});
                                    await getAbsences();
                                }}>task_alt</IconButton>
                            </Meta>
                        </Item>
                    </List>
                </Content>
            </Panel>
        {/each}
    </Accordion>
{:else}
    Sistemski administrator je izključil vpogled v izostanke otroka za vse starše.
{/if}
<h1>Domača naloga</h1>
{#if viewHomework}
    {#each homework as item, i}
        <h2>{item.Date}</h2>
        {#each item.Homework as homework, n}
            <h3>{homework.SubjectName} - {homework.Name}</h3>
            Datum vpisa naloge: {homework.FromDate}
            <br>
            Rok oddaje: {homework.ToDate}
            <br>
            Status: {translatedSegments[homework.Status] === undefined ? "ŠE NE UREJENO" : translatedSegments[homework.Status]}
            <br>
            {homework.Description}

        {/each}
        <p/>
    {/each}
{:else}
    Sistemski administrator je izključil vpogled v domače naloge otroka za vse starše.
{/if}

<h1>Ocenjevanja in preverjanja znanj</h1>
{#if viewGradings}
    {#each gradings as item}
        <h2>{item.Date}</h2>
        {#each item.Gradings as grading, n}
            <h3>{grading.MeetingName}</h3>
            {#if grading.IsTest}
                Preverjanje znanja
            {:else}
                {#if grading.IsWrittenAssessment}
                    Pisno ocenjevanje
                {:else}
                    Ocenjevanje
                {/if}
            {/if}
            <br>
            <a on:click={() => navigate(`/meeting/${grading.ID}`)}>Pojdi na srečanje</a>
        {/each}
        <p/>
    {/each}
{:else}
    Sistemski administrator je izključil vpogled v ocenjevanja otroka za vse starše.
{/if}

<h1>Izboljšave in pohvale - vpisi</h1>
{#each improvements as improvement}
    <h2>{improvement.MeetingName}</h2>
    Vpisal {improvement.TeacherName}
    {@html insane(marked.marked(improvement.Message))}
{/each}
<p/>
