<style>
    .sameline {
        white-space: nowrap;
    }
</style>

<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import {Meta} from "@smui/list";
    import {baseurl} from "../constants";
    import Tooltip, {Wrapper} from "@smui/tooltip";

    let grades = null;

    function getGrades() {
        fetch(`${baseurl}/my/grades`, {credentials: "include"})
            .then((r) => r.json())
            .then((r) => {
                grades = r["data"];
            });
    }

    const gradeColors = [
        "#F44336",
        "#FF9800",
        "#FFC107",
        "#8BC34A",
        "#64DD17"
    ];

    let selectedGrade = "";

    getGrades();
</script>

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
    {#if grades !== null}
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
                                <Wrapper>
                                    <span style="color: {gradeColors[grade.Grade - 1]}; display:inline-block; font-size: 20px;">{grade.Grade}</span>
                                    <Tooltip>
                                        {#if grade.Description !== ''}
                                            Opis ocene: {grade.Description}
                                        {/if}
                                        <br>
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
            </Row>
        {/each}
    {/if}
    </Body>
</DataTable>