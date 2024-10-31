<script lang="ts">
    import GradesTable from "./Widgets/GradesTable.svelte";
    import {baseurl} from "./constants";
    import Card, { Content } from '@smui/card';
    import {formatDate} from "date-fns";
    import IconButton from "@smui/icon-button";
    import Radio from "@smui/radio";
    import Switch from "@smui/switch";
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Textfield from "@smui/textfield";
    import Dialog, {Actions, Title} from "@smui/dialog";
    import FormField from "@smui/form-field";
    import Button, {Icon, Label} from "@smui/button";
    import Chip, { Set, Text } from '@smui/chips';
    import HelperText from "@smui/textfield/helper-text";
    import type {
        Grading,
        GradingResponseTeacher,
        GradingTerm,
        GradingTermIntermediate
    } from "./typescript-definitions/grading";
    import Select, {Option} from "@smui/select";

    export let meetingId: string;

    let gradings: GradingResponseTeacher[] = [];
    let openNewGrading = false;
    let gradingName: string = "";
    let gradingDescription: string = "";
    let gradingType: number = -1;
    let gradingPeriod: number = -1;
    let gradingEdit: Grading | null = null;
    let openNewGradingTerm = false;
    let gradingTermName: string = "";
    let gradingTermDescription: string = "";
    let gradingTermDate: string = "";
    let gradingTermHour: string = "0";
    let gradingTermTerm: number = 0;
    let gradingTermSelection: number = -1;
    let gradingTermEdit: GradingTermIntermediate | null = null;

    const hours = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
    ];

    async function getGradings() {
        let response = await fetch(`${baseurl}/meeting/get/${meetingId}/gradings`, {credentials: "include"});
        let r = await response.json();
        gradings = r.data;
        for (let i = 0; i < gradings.length; i++) {
            for (let k = 0; k < gradings[i].GradingTerms.length; k++) {
                gradings[i].GradingTerms[k].Users.sort((a, b) => `${a.Surname} ${a.Name}`.localeCompare(`${b.Surname} ${b.Name}`))
            }
        }
    }

    async function insertGrading() {
        let fd = new FormData();
        fd.append("name", gradingName);
        fd.append("description", gradingDescription);
        fd.append("grading_type", gradingType.toString());
        fd.append("period", gradingPeriod.toString());
        await fetch(`${baseurl}/meeting/get/${meetingId}/gradings`, {credentials: "include", method: "POST", body: fd});
        await getGradings();
    }

    async function insertGradingTerm() {
        let fd = new FormData();
        fd.append("name", gradingTermName);
        fd.append("description", gradingTermDescription);
        fd.append("date", gradingTermDate);
        fd.append("hour", gradingTermHour);
        fd.append("grade_autoselect_type", gradingTermSelection.toString());
        fd.append("term", gradingTermTerm.toString());
        await fetch(`${baseurl}/grading/${gradingEdit?.ID}/terms`, {credentials: "include", method: "POST", body: fd});
        gradingEdit = null;
        await getGradings();
    }

    async function updateGrading() {
        let fd = new FormData();
        fd.append("name", gradingName);
        fd.append("description", gradingDescription);
        fd.append("grading_type", gradingType.toString());
        fd.append("period", gradingPeriod.toString());
        await fetch(`${baseurl}/grading/${gradingEdit?.ID}`, {credentials: "include", method: "PATCH", body: fd});
        gradingEdit = null;
        await getGradings();
    }

    async function updateGradingTerm() {
        let fd = new FormData();
        fd.append("name", gradingTermName);
        fd.append("description", gradingTermDescription);
        fd.append("date", gradingTermDate);
        fd.append("hour", gradingTermHour);
        fd.append("grade_autoselect_type", gradingTermSelection.toString());
        fd.append("term", gradingTermTerm.toString());
        for (let i = 0; i < gradingTermEdit!!.Users.length; i++) {
            const user = gradingTermEdit!!.Users[i];
            const grade = user.Grade.Grade;
            fd.append(`${user.ID}.grade`, grade);
        }
        await fetch(`${baseurl}/grading_term/${gradingTermEdit?.GradingTerm.ID}`, {credentials: "include", method: "PATCH", body: fd});
        gradingEdit = null;
        gradingTermEdit = null;
        await getGradings();
    }

    async function deleteGrading(gradingId: string) {
        await fetch(`${baseurl}/grading/${gradingId}`, {credentials: "include", method: "DELETE"});
        await getGradings();
    }

    async function deleteGradingTerm(gradingTermId: string) {
        await fetch(`${baseurl}/grading_term/${gradingTermId}`, {credentials: "include", method: "DELETE"});
        await getGradings();
    }

    async function newGradingPopup() {
        gradingName = "";
        gradingDescription = "";
        openNewGrading = true;
    }

    async function newGradingEditPopup(grading: Grading) {
        gradingName = grading.Name;
        gradingDescription = grading.Description;
        gradingPeriod = grading.Period;
        gradingType = grading.GradingType;
        gradingEdit = grading;
        openNewGrading = true;
    }

    async function newGradingTermPopup(grading: Grading) {
        gradingEdit = grading;
        gradingTermName = grading.Name;
        gradingTermDescription = grading.Description;
        gradingTermEdit = null;
        openNewGradingTerm = true;
    }

    async function newGradingTermEditPopup(gradingTerm: GradingTermIntermediate, grading: Grading) {
        gradingEdit = grading;
        gradingTermName = gradingTerm.GradingTerm.Name;
        gradingTermDescription = gradingTerm.GradingTerm.Description;
        gradingTermDate = gradingTerm.GradingTerm.Date;
        gradingTermHour = gradingTerm.GradingTerm.Hour.toString();
        gradingTermTerm = gradingTerm.GradingTerm.Term;
        gradingTermSelection = gradingTerm.GradingTerm.GradeAutoselectType;
        gradingTermEdit = gradingTerm;
        openNewGradingTerm = true;
    }

    getGradings();
</script>

<style>
    :global(.mdc-dialog__surface) {
        max-width: none !important;
        width: 80vw !important;
    }

    :global(.mdc-layout-grid__inner) {
        grid-gap: 0 !important;
    }
</style>

<Dialog
        bind:open={openNewGrading}
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
>
    <Title id="simple-title">
        {#if gradingEdit === null}Vpišite novo ocenjevanje{:else}Spreminjate ocenjevanje {gradingEdit.Name}{/if}</Title>
    <Content id="simple-content">
        <Textfield bind:value={gradingName} label="Naziv ocenjevanja" required style="width: 100%;" helperLine$style="width: 100%;"/>
        <p/>
        <Textfield bind:value={gradingDescription} label="Neobvezen opis ocenjevanja" textarea style="width: 100%;" helperLine$style="width: 100%;" input$rows={8} />

        <p/>
        Tip ocenjevanja:
        <FormField style="margin-right: 1em;">
            <Radio bind:group={gradingType} value={0} />
            <span slot="label">Ustno</span>
        </FormField>
        <FormField style="margin-right: 1em;">
            <Radio bind:group={gradingType} value={1} />
            <span slot="label">Pisno</span>
        </FormField>
        <FormField style="margin-right: 1em;">
            <Radio bind:group={gradingType} value={2} />
            <span slot="label">Drugo/kombinirano</span>
        </FormField>

        <p/>

        Ocenjevalno obdobje:
        <br>
        <FormField style="margin-right: 1em;">
            <Radio bind:group={gradingPeriod} value={0} />
            <span slot="label">Celoletno ocenjevanje</span>
        </FormField>
        <br>
        <FormField style="margin-right: 1em;">
            <Radio bind:group={gradingPeriod} value={1} />
            <span slot="label">1. ocenjevalno obdobje</span>
        </FormField>
        <br>
        <FormField style="margin-right: 1em;">
            <Radio bind:group={gradingPeriod} value={2} />
            <span slot="label">2. ocenjevalno obdobje</span>
        </FormField>
    </Content>
    <Actions>
        <Button>
            <Label>PREKLIČI</Label>
        </Button>
        <Button on:click={async () => {
            if (gradingEdit === null) {
                await insertGrading();
            } else {
                await updateGrading();
            }
        }}>
            <Label>
                {#if gradingEdit === null}
                    VPIŠI
                {:else}
                    SHRANI
                {/if}
            </Label>
        </Button>
    </Actions>
</Dialog>

<Dialog
        bind:open={openNewGradingTerm}
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
>
    <Title id="simple-title">
        {#if gradingTermEdit !== null}
            Urejate rok za ocenjevanje {gradingEdit?.Name}
        {:else}
            Vpisujete nov rok za ocenjevanje {gradingEdit?.Name}
        {/if}
    </Title>
    <Content id="simple-content">
        <Textfield bind:value={gradingTermName} label="Naziv roka (najbolje enak imenu ocenjevanja)" required style="width: 100%;" helperLine$style="width: 100%;" />
        <p/>

        <Textfield bind:value={gradingTermDescription} label="Neobvezen opis roka" textarea style="width: 100%;" helperLine$style="width: 100%;" input$rows={8} />

        <p/>

        <Textfield bind:value={gradingTermDate} label="Datum roka" type="date" required>
            <Icon class="material-icons" slot="leadingIcon">event</Icon>
        </Textfield>

        <Select bind:value={gradingTermHour} label="Izberite učno uro roka" variant="outlined">
            {#each hours as hour}
                <Option value={hour}>{#if hour === "0"}Predura{:else}{hour}. ura{/if}</Option>
            {/each}
        </Select>

        <p/>

        Rok:
        <FormField style="margin-right: 1em;">
            <Radio bind:group={gradingTermTerm} value={1} />
            <span slot="label">1. rok</span>
        </FormField>
        <FormField style="margin-right: 1em;">
            <Radio bind:group={gradingTermTerm} value={2} />
            <span slot="label">2. (in nadaljnji) rok</span>
        </FormField>

        <p/>

        {#if gradingTermTerm === 2}
            Avtomatični izbor ocene glede na 1. rok:
            <br>
            <FormField style="margin-right: 1em;">
                <Radio bind:group={gradingTermSelection} value={0} />
                <span slot="label">Upoštevaj obe oceni</span>
            </FormField>
            <br>
            <FormField style="margin-right: 1em;">
                <Radio bind:group={gradingTermSelection} value={1} />
                <span slot="label">Upoštevaj boljšo oceno</span>
            </FormField>
            <br>
            <FormField style="margin-right: 1em;">
                <Radio bind:group={gradingTermSelection} value={2} />
                <span slot="label">Upoštevaj zadnjo oceno</span>
            </FormField>
        {/if}

        {#if gradingTermEdit !== null}
            {@const ceil = Math.ceil(gradingTermEdit.Users.length / 2)}
            <p/>
            <LayoutGrid>
                {#each gradingTermEdit.Users as user, i}
                    <Cell span={6} order={i < ceil ? (i * 2) : ((i - ceil) * 2 + 1)}>
                        <div style="display: flex; flex-direction: row;">
                            <span style="align-content: center;">{user.Name} {user.Surname}</span>
                            <div style="width: 5px;"/>
                            <Set chips={[1, 2, 3, 4, 5]} let:chip choice bind:selected={user.Grade.Grade}>
                                <Chip {chip}>
                                    <Text>{chip}</Text>
                                </Chip>
                            </Set>
                        </div>
                    </Cell>
                {/each}
            </LayoutGrid>
        {/if}
    </Content>
    <Actions>
        <Button>
            <Label>PREKLIČI</Label>
        </Button>
        <Button on:click={async () => {
            if (gradingTermEdit === null) {
                await insertGradingTerm();
            } else {
                await updateGradingTerm();
            }
        }}>
            <Label>
                {#if gradingTermEdit !== null}
                    SHRANI
                {:else}
                    VPIŠI
                {/if}
            </Label>
        </Button>
    </Actions>
</Dialog>

<Button on:click={newGradingPopup}>
    <Icon class="material-icons">add</Icon>
    Dodaj novo ocenjevanje
</Button>

<p/>

<div style="width: 100%;">
    {#each gradings as grading}
        <Card variant="outlined" padded>
            <span class="sameline">
                <span class="inline"><b>{grading.Grading.Name}</b> ({#if grading.Grading.GradingType === 0}Ustno ocenjevanje{:else if grading.Grading.GradingType === 1}Pisno ocenjevanje{:else}Drugo/kombinirano ocenjevanje{/if}, {#if grading.Grading.Period === 0}Celoletno ocenjevanje{:else if grading.Grading.Period === 1}Prvo ocenjevalno obdobje{:else}Drugo ocenjevalno obdobje{/if})</span>
                <!--{#if grading.Grade !== -1}<span class="inline" style="float: right; color: {gradeColors[grading.Grade]}; font-size: 25px; font-weight: bold;">{grading.Grade}</span>{/if}-->
            </span>
            <br>
            {grading.Grading.Description}

            <div style="height: 15px;"></div>

            <div class="sameline">
                <Button on:click={() => newGradingTermPopup(grading.Grading)} variant="raised">
                    <Icon class="material-icons">add</Icon>
                    Dodaj nov rok
                </Button>
                <Button on:click={() => newGradingEditPopup(grading.Grading)} variant="outlined">
                    <Icon class="material-icons">edit</Icon>
                    Uredi ocenjevanje
                </Button>
                <Button on:click={() => deleteGrading(grading.Grading.ID)} variant="outlined">
                    <Icon class="material-icons">delete</Icon>
                    Izbriši ocenjevanje
                </Button>
            </div>
        </Card>
        {#each grading.GradingTerms as term}
            <div style="width: 100%;">
                <div style="display: flex; flex-direction: row;">
                    <div style="width: 5vw;"></div>
                    <div style="width: 100%;">
                        <Card variant="outlined" padded>
                            <span class="sameline">
                                <span class="inline"><b>{term.GradingTerm.Term}. rok</b> – {formatDate(Date.parse(term.GradingTerm.Date), "EEE, d. M. yyyy")}</span>
                                <!--{#if grading.Grade !== -1}<span class="inline" style="float: right; color: {gradeColors[grading.Grade]}; font-size: 25px; font-weight: bold;">1. rok</span>{/if}-->
                            </span>
                            <br>
                            {term.GradingTerm.Name}; {term.GradingTerm.Description}
                            {#if term.GradingTerm.Term === 2}
                                <p/>
                                <span class="inline">Ta rok primerja oceno s 1. rokom in <b>{#if term.GradingTerm.GradeAutoselectType === 0}vpiše obe oceni{:else if term.GradingTerm.GradeAutoselectType === 1}izbere boljšo oceno{:else}izbere zadnjo oceno{/if}</b>.</span>
                            {/if}
                            <p/>
                            <div class="sameline">
                                <Button on:click={() => newGradingTermEditPopup(term, grading.Grading)} variant="raised">
                                    <Icon class="material-icons">edit</Icon>
                                    Uredi rok in vpiši ocene
                                </Button>
                                <Button on:click={() => deleteGradingTerm(term.GradingTerm.ID)} variant="outlined">
                                    <Icon class="material-icons">delete</Icon>
                                    Izbriši rok
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        {/each}
    {/each}
</div>

    <!--<GradesTable meetingId={meetingId} />-->