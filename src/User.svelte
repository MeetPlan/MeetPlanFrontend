<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import Icon from '@smui/textfield/icon';

    import {baseurl} from "./constants";

    import Select, {
        Option,
    } from '@smui/select';

    import List, {Item, Text as TextList, Meta} from "@smui/list";
    import IconButton from "@smui/icon-button";

    import jwt_decode, { JwtPayload } from "jwt-decode";

    let classes = [];
    let myClasses = [];
    let classId = "";
    let birthCertificateNumber = "";
    let dateOfBirth = "";
    let birthCountry = "";
    let birthCity = "";
    let name = "";
    let email = "";
    let role = "";
    let students = [];
    let myStudents = [];

    export let id: number;

    function getClasses() {
        fetch(`${baseurl}/classes/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => classes = r["data"]);
    }

    function getStudents() {
        fetch(`${baseurl}/students/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => students = r["data"]);
    }

    function getMyClasses() {
        fetch(`${baseurl}/user/get/classes?id=${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => myClasses = r.data);
    }

    function getMyChildren() {
        fetch(`${baseurl}/parents/get/students?parentId=${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => myStudents = r.data);
    }

    function getData() {
        fetch(`${baseurl}/user/get/data/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => {
                birthCertificateNumber = r.data.BirthCertificateNumber;
                dateOfBirth = r.data.Birthday;
                birthCity = r.data.CityOfBirth;
                birthCountry = r.data.CountryOfBirth;
                name = r.data.Name;
                email = r.data.Email;
                role = r.data.Role;
            });
    }

    function patchUser() {
        let fd = new FormData();
        fd.append("birth_certificate_number", birthCertificateNumber !== undefined ? birthCertificateNumber : "");
        fd.append("birthday", dateOfBirth !== undefined ? dateOfBirth : "");
        fd.append("city_of_birth", birthCity !== undefined ? birthCity : "");
        fd.append("country_of_birth", birthCountry !== undefined ? birthCountry : "");
        fd.append("name", name !== undefined ? name : "");
        fd.append("email", email !== undefined ? email : "");
        fetch(`${baseurl}/user/get/data/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH", body: fd})
            .then((response) => response.json())
            .then((r) => getData());
    }

    function assignToClass(cid: string) {
        fetch(`${baseurl}/class/get/${cid}/add_user/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => getMyClasses());
    }

    function deleteFromClass(cid: string) {
        fetch(`${baseurl}/class/get/${cid}/remove_user/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((r) => getMyClasses());
    }

    function removeUserFromParent(sid: string) {
        fetch(`${baseurl}/parent/${id}/assign/student/${sid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((r) => getMyChildren());
    }

    function assignToParent(sid: string) {
        fetch(`${baseurl}/parent/${id}/assign/student/${sid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => getMyChildren());
    }

    getClasses();
    getMyClasses();
    getData();
    getStudents();
    getMyChildren();
</script>

<Drawer active="user" />
<AppContent class="app-content">
    <main class="main-content">
        <Textfield bind:value={birthCertificateNumber} label="Številka matičnega lista" style="width: 100%;" required on:change={() => patchUser()}>
            <HelperText slot="helper">Vpišite številko matičnega lista - bodite zelo pozorni</HelperText>
        </Textfield>
        <Textfield bind:value={dateOfBirth} type="date" required on:change={() => patchUser()}>
            <Icon class="material-icons" slot="leadingIcon">event</Icon>
            <HelperText slot="helper">Vpišite datum rojstva - bodite zelo pozorni</HelperText>
        </Textfield>
        <Textfield bind:value={birthCity} label="Kraj rojstva" style="width: 100%;" required on:change={() => patchUser()}>
            <HelperText slot="helper">Vpišite kraj rojstva - bodite zelo pozorni</HelperText>
        </Textfield>
        <Textfield bind:value={birthCountry} label="Država rojstva" style="width: 100%;" required on:change={() => patchUser()}>
            <HelperText slot="helper">Vpišite državo rojstva - bodite zelo pozorni</HelperText>
        </Textfield>
        <Textfield bind:value={name} label="Ime in priimek" style="width: 100%;" required on:change={() => patchUser()}>
            <HelperText slot="helper">Vpišite ime in priimek - bodite zelo pozorni</HelperText>
        </Textfield>
        <Textfield bind:value={email} label="Elektronski naslov" style="width: 100%;" required on:change={() => patchUser()}>
            <HelperText slot="helper">Vpišite elektronski naslov - bodite zelo pozorni</HelperText>
        </Textfield>
        {#if role === "student"}
            <h2>Dodaj učenca v razred:</h2>
            <Select bind:classId label="Izberite razred" variant="outlined">
                <Option value=""/>
                {#each classes as c}
                    <Option on:click={() => {assignToClass(c["ID"])}} value={c["ID"]}>{c["Name"]}</Option>
                {/each}
            </Select>
            <h2>Razredi, v katere je učenec dodan:</h2>
            <List class="demo-list">
                {#each myClasses as item}
                    <Item>
                        <TextList>{item["Name"]}</TextList>
                        <Meta><IconButton class="material-icons" on:click={() => deleteFromClass(item["ID"])} title="Remove from class">delete</IconButton></Meta>
                    </Item>
                {/each}
            </List>
        {/if}
        {#if role === "parent"}
            <h2>Dodeli učenca staršu (poveži uporabniška računa):</h2>
            <Select bind:classId label="Izberite razred" variant="outlined">
                <Option value=""/>
                {#each students as c}
                    <Option on:click={() => {assignToParent(c["ID"])}} value={c["ID"]}>{c["Name"]}</Option>
                {/each}
            </Select>
            <h2>Učenci:</h2>
            <List class="demo-list">
                {#each myStudents as item}
                    <Item>
                        <TextList>{item["Name"]}</TextList>
                        <Meta><IconButton class="material-icons" on:click={() => removeUserFromParent(item["ID"])} title="Remove from class">delete</IconButton></Meta>
                    </Item>
                {/each}
            </List>
        {/if}
    </main>
</AppContent>