<style>
    .sameline {
        white-space: nowrap;
    }
</style>

<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {baseurl} from "../constants";

    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Radio from '@smui/radio';
    import FormField from '@smui/form-field';
    import Button, { Label } from '@smui/button';
    import Switch from '@smui/switch';

    let open = false;

    let grades = null;
    let toPatch;
    let selectedPeriod;
    let userId;

    function getGrades() {
        fetch(`${baseurl}/meeting/get/${meetingId}/grades`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                grades = r["data"];
            });
    }

    function insertGrade() {
        let fd = new FormData();
        fd.append("is_written", isWritten.toString());
        fd.append("grade", selectedGrade);
        fd.append("user_id", userId);
        fd.append("period", selectedPeriod);
        fetch(`${baseurl}/grades/new/${meetingId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "POST", body: fd})
            .then((r) => r.json())
            .then((r) => {
                getGrades();
            });
    }

    function patchGrade() {
        let fd = new FormData();
        fd.append("is_written", isWritten.toString());
        fd.append("grade", selectedGrade);
        fd.append("period", selectedPeriod);
        fetch(`${baseurl}/grade/get/${toPatch}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH", body: fd})
            .then((r) => r.json())
            .then((r) => {
                getGrades();
            });
    }

    function deleteGrade() {
        fetch(`${baseurl}/grade/get/${toPatch}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((r) => r.json())
            .then((r) => {
                getGrades();
                toPatch = undefined;
            });
    }

    let isWritten = false;

    export let meetingId;

    const gradeColors = [
        "#F44336",
        "#FF9800",
        "#FFC107",
        "#8BC34A",
        "#64DD17"
    ];

    const gradesNumbers = [
        1,
        2,
        3,
        4,
        5
    ]

    let selectedGrade = "";

    getGrades();
</script>

<Dialog
        bind:open
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
>
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="simple-title">
        {#if toPatch !== undefined}
            Popravite oceno
        {:else}
            Vpišite oceno
        {/if}
    </Title>
    <Content id="simple-content">
        Za {selectedPeriod}. ocenjevalno obdobje
        <p/>
        {#each gradesNumbers as option}
            <FormField>
                <Radio
                        bind:group={selectedGrade}
                        value={option}
                />
                {option}
            </FormField>
            <br>
        {/each}
        <FormField>
            <Switch bind:checked={isWritten} />
            <span slot="label">Pisna ocena</span>
        </FormField>
    </Content>
    <Actions>
        <Button on:click={() => {
            if (toPatch !== undefined) {
                patchGrade();
            } else {
                insertGrade();
            }
        }}>
            <Label>
                {#if toPatch !== undefined}
                    POPRAVI
                {:else}
                    VPIŠI
                {/if}
            </Label>
        </Button>
        {#if toPatch !== undefined}
            <Button on:click={() => {
                deleteGrade();
            }}>
                <Label>
                    IZBRIŠI
                </Label>
            </Button>
        {/if}
    </Actions>
</Dialog>

<DataTable table$aria-label="People list" style="width: 100%;">
    <Head>
        <Row>
            <Cell>Učenec</Cell>
            <Cell>1. ocenjevalno obdobje</Cell>
            <Cell>2. ocenjevalno obdobje</Cell>
            <Cell>Zaključeno</Cell>
        </Row>
    </Head>
    <Body>
        {#if grades !== null}
            {#each grades["Users"] as user}
                <Row>
                    <Cell>{user.Name}</Cell>
                    {#each user.Periods as period, i}
                        <Cell on:click={() => {
                            selectedPeriod = i + 1;
                            userId = user.ID;
                            open = true;
                        }}>
                            <div class="sameline">
                                <div style="display:inline-block; width: 5px;"/>
                                {#each period.Grades as grade}
                                    <div style="color: {gradeColors[grade.Grade - 1]}; display:inline-block; font-size: 20px;" on:click={(e) => {
                                        e.stopPropagation();
                                        toPatch = grade.ID;
                                        selectedGrade = grade.Grade;
                                        selectedPeriod = i + 1;
                                        isWritten = grade.IsWritten;
                                        open = true;
                                    }}>{grade.Grade}</div>
                                    <div style="display:inline-block; width: 5px;"/>
                                {/each}
                            </div>
                        </Cell>
                    {/each}
                    <Cell>TODO</Cell>
                </Row>
            {/each}
        {/if}
    </Body>
</DataTable>