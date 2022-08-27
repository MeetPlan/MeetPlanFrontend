<style>
    .sameline {
        white-space: nowrap;
    }
</style>

<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {Meta} from "@smui/list";
    import {baseurl} from "../constants";

    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Radio from '@smui/radio';
    import FormField from '@smui/form-field';
    import Button, { Label } from '@smui/button';
    import Switch from '@smui/switch';
    import Cookies from "js-cookie";

    let open = false;

    let grades = null;
    let toPatch;
    let selectedPeriod;
    let userId;
    let finalize = false;
    let canPatch = true;

    function getGrades() {
        fetch(`${baseurl}/meeting/get/${meetingId}/grades`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
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
        fd.append("is_final", finalize.toString());
        fd.append("can_patch", canPatch.toString())
        fetch(`${baseurl}/grades/new/${meetingId}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "POST", body: fd})
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
        fetch(`${baseurl}/grade/get/${toPatch}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH", body: fd})
            .then((r) => r.json())
            .then((r) => {
                getGrades();
            });
    }

    function deleteGrade() {
        fetch(`${baseurl}/grade/get/${toPatch}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
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
        {#if finalize === false}
            Za {selectedPeriod}. ocenjevalno obdobje
        {:else}
            Zaključi oceno.
            Ko enkrat zaključite oceno, je ne morete popraviti.
            Prav tako ne morete popravljati ocen v nazaj.
            Razmislite, preden vpišete oceno.
            Kasneje vam lahko pomaga samo še strežniški administrator, ki ima dostop do podatkovne baze.
        {/if}
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
        {#if finalize === false}
            <FormField>
                <Switch bind:checked={isWritten} />
                <span slot="label">Pisna ocena</span>
            </FormField>
            {#if toPatch === undefined}
                <br>
                <FormField>
                    <Switch bind:checked={canPatch} />
                    <span slot="label">Se lahko popravlja</span>
                </FormField>
            {/if}
        {/if}
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
                    <Cell class="sameline">
                        <div style="display:inline-block;">{user.Name}</div>
                        <div style="display:inline-block; font-size: 20px; float:right; color: gray;">{user.Average.toFixed(2)}</div>
                    </Cell>
                    {#each user.Periods as period, i}
                        <Cell on:click={() => {
                            if (user.Final === 0) {
                                selectedPeriod = i + 1;
                                userId = user.ID;
                                toPatch = undefined;
                                finalize = false;
                                open = true;
                            }
                        }}>
                            <div class="sameline">
                                <div style="display:inline-block; width: 5px;"/>
                                {#each period.Grades as grade}
                                    <div style="color: {gradeColors[grade.Grade - 1]}; display:inline-block; font-size: 20px;" on:click={(e) => {
                                        e.stopPropagation();
                                        if (user.Final === 0 && grade.CanPatch === true) {
                                            toPatch = grade.ID;
                                            selectedGrade = grade.Grade;
                                            selectedPeriod = i + 1;
                                            isWritten = grade.IsWritten;
                                            open = true;
                                        }
                                    }}>
                                        <span title="{grade.Description !== '' ? `Opis ocene: ${grade.Description}` : ''}
{grade.CanPatch ? 'Se lahko popravlja' : 'Se ne more popravljati'}">
                                            {grade.Grade}
                                        </span>
                                    </div>
                                    <div style="display:inline-block; width: 5px;"/>
                                {/each}
                                <Meta style="display:inline-block; font-size: 20px; float:right;">{period.Average.toFixed(2)}</Meta>
                            </div>
                        </Cell>
                    {/each}
                    <Cell on:click={() => {
                        if (user.Final === 0) {
                            selectedPeriod = -1;
                            userId = user.ID;
                            toPatch = undefined;
                            finalize = true;
                            open = true;
                        }
                    }}>
                        {#if user.Final !== 0}
                            <div style="color: {gradeColors[user.Final - 1]}; display:inline-block; font-size: 20px;">
                                {user.Final}
                            </div>
                        {/if}
                    </Cell>
                </Row>
            {/each}
        {/if}
    </Body>
</DataTable>