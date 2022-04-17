<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import {navigate} from "svelte-routing";

    import Button from "@smui/button";

    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {baseurl} from "./constants";

    import IconButton, { Icon } from '@smui/icon-button';

    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import jwt_decode, { JwtPayload } from "jwt-decode";

    import List, {
        Item,
        Meta,
    } from '@smui/list';

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

    let viewGrades = true;
    let viewAbsences = true;
    let viewHomework = true;

    function getUserData() {
        fetch(`${baseurl}/user/get/data/${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                userData = r["data"];
            });
    }

    function getAbsences() {
        fetch(`${baseurl}/user/get/absences/${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                absences = r["data"];
                let al = [];
                for (let absence in absences) {
                    let a = absences[absence];
                    al.push(!a["IsExcused"])
                }
                console.log(al);
                absenceList = al;
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
                if (grades.data !== "Forbidden") {
                    grades = r["data"];
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
                    if (viewGrades) {
                        getGrades();
                    }
                    if (viewHomework) {
                        getHomework();
                    }
                    if (viewAbsences) {
                        getAbsences();
                    }
                });
        } else {
            if (decoded["role"] !== "admin") {
                getGrades();
            }
            getUserData();
            getAbsences();
            getHomework();
        }
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

    const decoded = jwt_decode<JwtPayload>(token);

    const translatedSegments = {
        "DONE": "NAREJENO",
        "ABSENT": "MANJKAL",
        "INCOMPLETE": "NEPOPOLNO",
        "NOT MANAGED": "NI VPISANO"
    }

    getParentConfig();
</script>

<Drawer active={`student${studentId}`} />
<AppContent class="app-content">
    <main class="main-content">
        {#if userData}
            <h1>{userData.Name}</h1>
        {/if}
        {#if decoded.role === "admin" || decoded.role === "principal" || decoded.role === "principal assistant" || decoded.role === "school psychologist"}
            <Button on:click={() => {
                fetch(`${baseurl}/user/get/certificate_of_schooling/${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
                    .then((response) => response.blob())
                    .then((blob) => {
                      var _url = window.URL.createObjectURL(blob);
                      window.open(_url, "_blank").focus();
                  }).catch((err) => {
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
                                            <div style="color: {gradeColors[grade.Grade - 1]}; display:inline-block; font-size: 20px;">{grade.Grade}</div>
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
            <Button on:click={() => {
                fetch(`${baseurl}/user/get/ending_certificate/${studentId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
                    .then((response) => response.blob())
                    .then((blob) => {
                      var _url = window.URL.createObjectURL(blob);
                      window.open(_url, "_blank").focus();
                  }).catch((err) => {
                    console.log(err);
                  });
            }}>
                <Icon class="material-icons">download</Icon>
                Prenesi končno spričevalo
            </Button>
        {/if}
        <h1>Odsotnost</h1>
        {#if viewAbsences}
            <Accordion>
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
                    Status: {translatedSegments[homework.Status]}
                    <br>
                    {homework.Description}

                {/each}
                <p/>
            {/each}
        {:else}
            Sistemski administrator je izključil vpogled v domače naloge otroka za vse starše.
        {/if}
    </main>
</AppContent>
