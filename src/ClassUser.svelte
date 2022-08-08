<script lang="ts">
    import {navigate} from "svelte-navigator";

    import Button from "@smui/button";

    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {baseurl, saveBlob} from "./constants";

    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';

    import IconButton, { Icon } from '@smui/icon-button';

    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import jwt_decode from "jwt-decode";

    import * as marked from 'marked';

    import List, {
        Item,
        Meta,
    } from '@smui/list';
    import insane from "insane";

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

    function getUserData() {
        fetch(`${baseurl}/user/get/data/${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                userData = r["data"];
                isPassing = userData.IsPassing;
            });
    }

    function getImprovements() {
        fetch(`${baseurl}/user/get/improvements?studentId=${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                improvements = r.data;
            });
    }

    function getAbsences() {
        fetch(`${baseurl}/user/get/absences/${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                absences = r["data"];
                let al = [];
                for (let absence in absences) {
                    al = [...al, !(absences[absence].IsExcused)]
                }
                console.log(al);
                absenceList = al;
            });
    }

    function getUserGradings() {
        fetch(`${baseurl}/my/gradings?studentId=${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                gradings = r["data"];
            });
    }

    function getHomework() {
        fetch(`${baseurl}/user/get/homework/${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                homework = r["data"];
            });
    }

    function getGrades() {
        fetch(`${baseurl}/my/grades?studentId=${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                if (r.data !== "Forbidden") {
                    grades = r.data;
                }
            });
    }

    function getParentConfig() {
        if (decoded["role"] === "parent") {
            fetch(`${baseurl}/parents/get/config`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
                .then((r) => r.json())
                .then((r) => {
                    let data = r["data"];
                    viewAbsences = data["parent_view_absences"];
                    viewHomework = data["parent_view_homework"];
                    viewGrades = data["parent_view_grades"];
                    viewGradings = data["parent_view_gradings"];
                    if (viewGrades) {
                        getGrades();
                    }
                    if (viewHomework) {
                        getHomework();
                    }
                    if (viewAbsences) {
                        getAbsences();
                    }
                    if (viewGradings) {
                        getUserGradings();
                    }
                });
        } else {
            getGrades();
            getUserData();
            getAbsences();
            getHomework();
            getUserGradings();
        }
        getImprovements();
    }

    const gradeColors = [
        "#F44336",
        "#FF9800",
        "#FFC107",
        "#8BC34A",
        "#64DD17"
    ];

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    const decoded = jwt_decode(token);

    const translatedSegments = {
        "DONE": "NAREJENO",
        "ABSENT": "MANJKAL",
        "INCOMPLETE": "NEPOPOLNO",
        "NOT MANAGED": "NI VPISANO"
    }

    getParentConfig();
</script>

{#if userData}
    <h1>{userData.Name}</h1>
{/if}
{#if decoded.role === "admin" || decoded.role === "principal" || decoded.role === "principal assistant" || decoded.role === "school psychologist"}
    <Button on:click={() => {
        fetch(`${baseurl}/user/get/certificate_of_schooling/${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.blob())
            .then((blob) => saveBlob(blob))
        .catch((err) => {
            console.log(err);
          });
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
                    {#each subject.Periods as period, i}
                        <Cell>
                            <div class="sameline">
                                <div style="display:inline-block; width: 5px;"/>
                                {#each period.Grades as grade}
                                    <div style="color: {gradeColors[grade.Grade - 1]}; display:inline-block; font-size: 20px;">
                                        <span title="{grade.Description !== '' ? `Opis ocene: ${grade.Description}` : ''}
{grade.CanPatch ? 'Se lahko popravlja' : 'Se ne more popravljati'}">{grade.Grade}
                                        </span>
                                    </div>
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
                </Row>
            {/each}
        {/if}
        </Body>
    </DataTable>
{:else}
    Sistemski administrator je izključil vpogled v ocene otroka za vse starše.
{/if}
{#if decoded.role === "teacher" || decoded.role === "admin" || decoded.role === "principal" || decoded.role === "principal assistant"}
    <p/>
    <FormField>
        <Switch bind:checked={isPassing} on:click={() => {
            setTimeout(() => {
                let fd = new FormData();
                fd.append("is_passing", isPassing.toString());
                fetch(`${baseurl}/user/get/data/${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH", body: fd})
                    .then((response) => response.json())
                    .then((r) => getUserData());
            }, 200);
        }}/>
        Bo opravil razred?
    </FormField>
    <p/>
    <FormField>
        <Switch bind:checked={printTemplate} />
        Natisni predlogo
    </FormField>
    <p/>
    <Button on:click={() => {
        fetch(`${baseurl}/user/get/ending_certificate/${studentId}?useDocument=${printTemplate.toString()}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.blob())
            .then((blob) => saveBlob(blob))
            .catch((err) => {
            console.log(err);
          });
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
                                <IconButton class="material-icons" style="color: {item['IsExcused'] ? 'green' : 'red'};" on:click={() => {
                                    if (decoded["role"] === "teacher" || decoded["role"] === "admin") {
                                        fetch(`${baseurl}/user/get/absences/${studentId}/excuse/${item["ID"]}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH"})
                                            .then((r) => r.json())
                                            .then((r) => {
                                                getAbsences();
                                            });
                                    }
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
