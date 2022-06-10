<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import List, {Item, Text as TextList, Meta, Graphic, PrimaryText, SecondaryText} from "@smui/list";
    import IconButton from "@smui/icon-button";

    import Avatar from "svelte-avatar";

    import {baseurl} from "./constants";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import {navigate} from "svelte-routing";
    import jwt_decode, {JwtPayload} from "jwt-decode";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    const decoded = jwt_decode<JwtPayload>(token);

    let myClasses;
    let students;
    let classId = "";
    let classYear = "";
    let sok = 1;
    let eok = 1;
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


    async function getClass() {
        let response = await fetch(`${baseurl}/class/get/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        let r = await response.json();
        students = r["data"];
        classYear = students["ClassYear"];
        sok = students.SOK;
        eok = students.EOK;
        lastDate = fmtDateReverse(new Date(students.LastSchoolDate * 1000));
        console.log(lastDate);
    }

    function assignToClass(cid: string) {
        fetch(`${baseurl}/class/get/${id}/add_user/${cid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    function deleteFromClass(cid: string) {
        fetch(`${baseurl}/class/get/${id}/remove_user/${cid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    function patchClass() {
        let fd = new FormData();
        fd.append("class_year", classYear);
        fd.append("sok", sok.toString());
        fd.append("eok", eok.toString())
        fd.append("last_date", ((new Date(lastDate)).valueOf() / 1000).toString())
        fetch(`${baseurl}/class/get/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH", body: fd})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    getClass()
</script>

<Drawer active="user" />
<AppContent class="app-content">
    <main class="main-content">
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
            <List class="demo-list" twoLine avatarList>
                {#each students.Students as item}
                    <Item on:click={() => navigate(`/class/user/${item.ID}`)}>
                        <Avatar name={item.Name}/><div style="width: 15px;"/>
                        <TextList>
                            <PrimaryText>{item.Name}</PrimaryText>
                        </TextList>
                        {#if decoded.role === "admin" || decoded.role === "principal" || decoded.role === "principal assistant"}
                            <Meta><IconButton class="material-icons" on:click={(e) => {
                                e.stopPropagation()
                                deleteFromClass(item.ID)
                            }} title="Remove from class">delete</IconButton></Meta>
                        {/if}
                    </Item>
                {/each}
            </List>
        {/if}
    </main>
</AppContent>
