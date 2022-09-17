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

    import { navigate } from "svelte-navigator";
    import {baseurl} from "./constants";
    import Cookies from "js-cookie";
    import DataTable, {Body, Cell, Head, Row, Label as TableLabel} from "@smui/data-table";

    let items = [];
    let teachers = [];
    let subjects = [];

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    function loadThings() {
        fetch(`${baseurl}/classes/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((json) => {
                    items = json["data"];
                },
            );
    }

    function getSubjects() {
        fetch(`${baseurl}/subjects/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((json) => {
                    subjects = json["data"];
                },
            );
    }

    function getTeachers() {
        fetch(`${baseurl}/teachers/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((json) => {
                    teachers = json["data"];
                },
            );
    }

    loadThings();
    getTeachers();
    getSubjects();

    let nclass = "";
    let teacherId = "";
    let classId = "";
    let longName = "";
    let realization: number = 60.0;

    function newSubject() {
        let fd = new FormData();
        fd.append("teacher_id", teacherId);
        fd.append("name", nclass);
        fd.append("class_id", classId);
        fd.append("long_name", longName)
        fd.append("realization", realization.toString());
        fetch(`${baseurl}/subjects/new`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "POST", body: fd})
            .then((response) => response.json())
            .then((json) => {
                    getSubjects();
                },
            );
    }

    function deleteSubject(cid: number) {
        fetch(`${baseurl}/subject/get/${cid}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((json) => {
                    getSubjects();
                },
            );
    }
</script>

{#if sessionStorage.getItem("role") === "admin" || sessionStorage.getItem("role") === "principal" || sessionStorage.getItem("role") === "principal assistant"}
    <Textfield label="Nov predmet" bind:value={nclass}>
        <HelperText slot="helper">Vpišite prosimo kratko ime novega predmeta (primer - SLJ9a, ŠPOf)</HelperText>
    </Textfield>
    <Autocomplete combobox options={subjectsList} style="width: 100%;" bind:value={longName} label="Izberite ali vpišite dolgo ime predmeta, če ga ni vpisanega" />
    <p/>
    <Select bind:classId label="Izberite razred" variant="outlined" style="width: 100%;">
        <Option value="" on:click={() => classId = ""}>Bom ročno dodal uporabnike (ne uporabi razreda)</Option>
        {#each items as c}
            <Option value={c["ID"]} on:click={() => classId = c["ID"]}>{c["Name"]}</Option>
        {/each}
    </Select>
    <p/>
    <Select bind:teacherId label="Izberite učitelja tega predmeta" variant="outlined" style="width: 100%;">
        <Option value="" />
        {#each teachers as c}
            <Option value={c["ID"]} on:click={() => teacherId = c["ID"]}>{c["Name"]}</Option>
        {/each}
    </Select>
    <p/>
    <Textfield type="number" label="Realizacija" bind:value={realization} input$step="0.5">
        <HelperText slot="helper">Vpišite prosimo realizacijo</HelperText>
    </Textfield>
    <p/>
    <Button on:click={() => newSubject()} variant="raised">
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
                <Button on:click={async () => {
                    let fd = new FormData();
                    fd.append("long_name", item.LongName)
                    fd.append("realization", item.Realization.toString());
                    fd.append("selected_hours", item.SelectedHours.toString());
                    fd.append("location", item.Location);
                    await fetch(`${baseurl}/subject/get/${item.ID}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH", body: fd})
                    await getSubjects();
                }}>
                    <Icon class="material-icons">done</Icon>
                    Shrani spremembe
                </Button>
            </Cell>
            <Cell>
                <IconButton class="material-icons" on:click={(e) => {
                    e.stopPropagation();
                    deleteSubject(item["ID"])
                }}>delete</IconButton>
            </Cell>
        </Row>
    {/each}
    </Body>
</DataTable>
