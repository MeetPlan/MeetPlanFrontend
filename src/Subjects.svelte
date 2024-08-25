<script lang="ts">
    import Slider from "@smui/slider";
    import FormField from '@smui/form-field';

    import IconButton from "@smui/icon-button";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import Button, {Icon, Label} from "@smui/button";

    import Autocomplete from '@smui-extra/autocomplete';
    import {subjects as subjectsList} from "./Constants/consts";

    import Select, {Option} from "@smui/select";

    import { navigate } from "svelte-routing";
    import {baseurl} from "./constants";
    import Cookies from "js-cookie";
    import DataTable, {Body, Cell, Head, Row} from "@smui/data-table";
    import Switch from "@smui/switch";
    import {onMount} from "svelte";

    let items = [];
    let teachers = [];
    let subjects = [];

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    async function loadThings() {
        let response = await fetch(`${baseurl}/classes/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let json = await response.json()
        items = json["data"];
    }

    async function getSubjects() {
        let response = await fetch(`${baseurl}/subjects/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let json = await response.json();
        subjects = json["data"];
    }

    async function getTeachers() {
        let response = await fetch(`${baseurl}/teachers/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let json = await response.json()
        teachers = json["data"];
    }

    let nclass = "";
    let teacherId = "";
    let classId = "";
    let longName = "";
    let realization: number = 60.0;
    let isGraded: boolean = true;

    async function newSubject() {
        let fd = new FormData();
        fd.append("teacher_id", teacherId["ID"]);
        fd.append("name", nclass);
        if (!(classId === "" || classId === undefined)) fd.append("class_id", classId["ID"]);
        fd.append("long_name", longName)
        fd.append("realization", realization.toString());
        fd.append("is_graded", isGraded.toString());
        await fetch(`${baseurl}/subjects/new`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "POST", body: fd});
        await getSubjects();
    }

    async function deleteSubject(cid: number) {
        await fetch(`${baseurl}/subject/get/${cid}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
        await getSubjects();
    }

    onMount(async () => {
        await loadThings();
        await getTeachers();
        await getSubjects();
    })
</script>

{#if localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant"}
    <Textfield helperLine$style="width: 100%;" style="width: 100%;" label="Nov predmet" bind:value={nclass}>
        <HelperText slot="helper">Vpišite prosimo kratko ime novega predmeta (primer - SLJ9a, ŠPOf)</HelperText>
    </Textfield>
    <Autocomplete combobox options={subjectsList} textfield$style="width: 100%;" style="width: 100%;" bind:value={longName} label="Izberite ali vpišite dolgo ime predmeta, če ga ni vpisanega" />
    <p/>
    <Autocomplete options={items} textfield$style="width: 100%;" style="width: 100%;" getOptionLabel={(option) => option ? option["Name"] : ""} bind:value={classId} label="Izberite razred (če ne vpišete razreda, se učence doda ročno preko spodnjega seznama)"/>
    <p/>
    <Autocomplete options={teachers} textfield$style="width: 100%;" style="width: 100%;" getOptionLabel={(option) => option ? option["Name"] : ""} bind:value={teacherId} label="Izberite učitelja tega predmeta"/>
    <p/>
    <Textfield type="number" label="Realizacija" bind:value={realization} input$step="0.5">
        <HelperText slot="helper">Vpišite prosimo realizacijo</HelperText>
    </Textfield>
    <p/>
    <FormField>
        <Switch bind:checked={isGraded} />
        <span slot="label">Se ocenjuje</span>
    </FormField>
    <p/>
    <Button on:click={newSubject} variant="raised">
        <Label>OK</Label>
    </Button>
{/if}

<DataTable
        style="width: 100%;"
>
    <Head>
        <Row>
            <Cell>Enolični identifikator predmeta</Cell>
            <Cell>Ime predmeta</Cell>
            <Cell>Dolgo ime predmeta</Cell>
            <Cell>Lokacija</Cell>
            <Cell>Ur na teden</Cell>
            <Cell>Se ocenjuje</Cell>
            <Cell>Shrani spremembe</Cell>
            <Cell>Izbriši</Cell>
        </Row>
    </Head>
    <Body>
    {#each subjects as item}
        <Row on:click={() => navigate("/subject/" + item["ID"])} style="height: 100px;">
            <Cell>{item.ID}</Cell>
            <Cell>{item.Name}</Cell>
            <Cell>{item.LongName}</Cell>
            <Cell on:click={(e) => e.stopPropagation()}><Textfield bind:value={item.Location}/></Cell>
            <Cell on:click={(e) => e.stopPropagation()}>
                <FormField align="end" style="display: flex; width: 400px;">
                    <Slider discrete style="flex-grow: 1;" bind:value={item.SelectedHours} min={1} max={10} step={0.5} />
                </FormField>
            </Cell>
            <Cell on:click={(e) => e.stopPropagation()}>
                <FormField>
                    <Switch bind:checked={item.IsGraded} />
                </FormField>
            </Cell>
            <Cell on:click={(e) => e.stopPropagation()}>
                <Button on:click={async () => {
                    let fd = new FormData();
                    fd.append("long_name", item.LongName)
                    fd.append("realization", item.Realization.toString());
                    fd.append("selected_hours", item.SelectedHours.toString());
                    fd.append("location", item.Location);
                    fd.append("is_graded", item.IsGraded.toString());
                    await fetch(`${baseurl}/subject/get/${item.ID}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH", body: fd})
                    await getSubjects();
                }}>
                    <Icon class="material-icons">done</Icon>
                    Shrani spremembe
                </Button>
            </Cell>
            <Cell>
                <IconButton class="material-icons" on:click={async (e) => {
                    e.stopPropagation();
                    await deleteSubject(item["ID"])
                }}>delete</IconButton>
            </Cell>
        </Row>
    {/each}
    </Body>
</DataTable>
