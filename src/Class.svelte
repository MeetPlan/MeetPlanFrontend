<script lang="ts">
    import List, {Item, Text as TextList, Meta, PrimaryText} from "@smui/list";
    import IconButton from "@smui/icon-button";

    import Avatar from "svelte-avatar";

    import {baseurl} from "./constants";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import {navigate} from "svelte-navigator";
    import Cookies from "js-cookie";
    import Autocomplete from "@smui-extra/autocomplete";
    import {onMount} from "svelte";

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    let studentPick;
    let myClasses;
    let students;
    let classId = "";
    let classYear = "";
    let sok = 1;
    let eok = 1;
    let allStudents = [];
    let lastDate = fmtDateReverse(new Date());

    export let id: number;

    function fmtDateReverse(date: Date): string {
        let dd = date.getDate().toString()
        if (dd < 10) {
            dd = `0${dd}`
        }
        let mm = date.getMonth().toString();
        if (mm < 10) {
            mm = `0${(date.getMonth() + 1).toString()}`
        }
        return `${date.getFullYear()}-${mm}-${dd}`
    }

    async function getStudents() {
        let response = await fetch(`${baseurl}/students/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let r = await response.json()
        allStudents = r.data;
    }

    async function getClass() {
        let response = await fetch(`${baseurl}/class/get/${id}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let r = await response.json();
        students = r["data"];
        classYear = students["ClassYear"];
        sok = students.SOK;
        eok = students.EOK;
        lastDate = fmtDateReverse(new Date(students.LastSchoolDate * 1000));
        console.log(lastDate);
    }

    function assignToClass() {
        fetch(`${baseurl}/class/get/${id}/add_user/${studentPick["ID"]}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    function deleteFromClass(cid: string) {
        fetch(`${baseurl}/class/get/${id}/remove_user/${cid}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    function patchClass() {
        let fd = new FormData();
        fd.append("class_year", classYear);
        fd.append("sok", sok.toString());
        fd.append("eok", eok.toString())
        fd.append("last_date", ((new Date(lastDate)).valueOf() / 1000).toString())
        fetch(`${baseurl}/class/get/${id}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH", body: fd})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    onMount(async () => {
        await getClass();
        await getStudents();
    })
</script>

{#if students !== undefined}
    <Textfield label="Šolsko leto" bind:value={classYear} style="width: 100%;" on:change={() => patchClass()}>
        <HelperText slot="helper">Vpišite prosimo šolsko leto - to ime se bo prikazalo na spričevalu, zato bodite še posebej previdni (primer - 2021/2022)</HelperText>
    </Textfield>
    <Textfield label="SOK" bind:value={sok} style="width: 100%;" on:change={() => patchClass()} type="number">
        <HelperText slot="helper">Vpišite prosimo stopnjo kvalifikacije (SOK) - to se bo prikazalo na spričevalu, zato bodite še posebej previdni (primer za OŠ - 1)</HelperText>
    </Textfield>
    <Textfield label="EOK" bind:value={eok} style="width: 100%;" on:change={() => patchClass()} type="number">
        <HelperText slot="helper">Vpišite prosimo stopnjo kvalifikacije (EOK) - to se bo prikazalo na spričevalu, zato bodite še posebej previdni (primer za OŠ - 1)</HelperText>
    </Textfield>
    <Textfield label="Zadnji šolski dan" bind:value={lastDate} style="width: 100%;" on:change={() => patchClass()} type="date">
        <HelperText slot="helper">Vpišite prosimo zadnji šolski dan - to se bo prikazalo na spričevalu, zato bodite še posebej previdni (primer za OŠ - 25.6.2022)</HelperText>
    </Textfield>
    <h2>Učitelj:</h2>
    <List class="demo-list" twoLine avatarList>
        <Item>
            <Avatar name={students["TeacherName"]}/><div style="width: 15px;"/>
            <TextList>
                <PrimaryText>{students.TeacherName}</PrimaryText>
            </TextList>
        </Item>
    </List>
    <h2>Učenci:</h2>
    <Autocomplete
        options={allStudents}
        getOptionLabel={(option) => option ? option["Name"] : ""}
        bind:value={studentPick}
        label="Dodajte učenca"
        textfield$style="width: 100%;" style="width: 100%;"
        on:change={() => setTimeout(assignToClass, 200)}
    />
    <List class="demo-list" twoLine avatarList>
        {#each students.Students as item}
            <Item on:click={() => navigate(`/class/user/${item.ID}`)}>
                <Avatar name={item.Name}/><div style="width: 15px;"/>
                <TextList>
                    <PrimaryText>{item.Name}</PrimaryText>
                </TextList>
                {#if localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant"}
                    <Meta><IconButton class="material-icons" on:click={(e) => {
                        e.stopPropagation()
                        deleteFromClass(item.ID)
                    }} title="Remove from class">delete</IconButton></Meta>
                {/if}
            </Item>
        {/each}
    </List>
{/if}
