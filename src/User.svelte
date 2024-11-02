<script lang="ts">
    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import Icon from '@smui/textfield/icon';

    import {baseurl} from "./constants";

    import Select, {
        Option,
    } from '@smui/select';

    import List, {Item, Meta, Text as TextList} from "@smui/list";
    import IconButton from "@smui/icon-button";

    let classes = [];
    let myClasses = [];
    let classId: string = "";
    let birthCertificateNumber: string = "";
    let dateOfBirth: string = "";
    let birthCountry: string = "";
    let birthCity: string = "";
    let name: string = "";
    let surname: string = "";
    let email: string = "";
    let role: string = "";
    let emso: string = "";
    let citizenship: string = "";
    let beforeAchievedEducation: string = "";
    let permanentAddress: string = "";
    let temporaryAddress: string = "";
    let taxNumber: string = "";
    let phoneNumber: string = "";
    let gender: string = "";
    let students = [];
    let myStudents = [];

    export let id: number;

    async function getClasses() {
        let response = await fetch(`${baseurl}/classes/get`, {credentials: "include"});
        let r = await response.json();
        classes = r["data"];
    }

    async function getStudents() {
        let response = await fetch(`${baseurl}/students/get`, {credentials: "include"});
        let r = await response.json();
        students = r["data"];
    }

    async function getMyClasses() {
        let response = await fetch(`${baseurl}/user/get/classes?id=${id}`, {credentials: "include"});
        let r = await response.json();
        myClasses = r.data;
    }

    async function getMyChildren() {
        let response = await fetch(`${baseurl}/parents/get/students?parentId=${id}`, {credentials: "include"});
        let r = await response.json();
        myStudents = r.data;
    }

    async function getUserData() {
        let response = await fetch(`${baseurl}/user/get/data/${id}`, {credentials: "include"});
        let r = await response.json();
        birthCertificateNumber = r.data.BirthCertificateNumber;
        dateOfBirth = r.data.Birthday;
        birthCity = r.data.CityOfBirth;
        birthCountry = r.data.CountryOfBirth;
        name = r.data.Name;
        email = r.data.Email;
        role = r.data.Role;
        surname = r.data.Surname;
        emso = r.data.EMSO;
        citizenship = r.data.Citizenship;
        beforeAchievedEducation = r.data.BeforeAchievedEducation;
        permanentAddress = r.data.PermanentAddress;
        temporaryAddress = r.data.TemporaryAddress;
        taxNumber = r.data.TaxNumber;
        phoneNumber = r.data.PhoneNumber;
        gender = r.data.Gender;
    }

    async function patchUser() {
        let fd = new FormData();
        fd.append("birth_certificate_number", birthCertificateNumber);
        fd.append("birthday", dateOfBirth);
        fd.append("city_of_birth", birthCity);
        fd.append("country_of_birth", birthCountry);
        fd.append("name", name);
        fd.append("email", email);
        fd.append("surname", surname);
        fd.append("emso", emso);
        fd.append("citizenship", citizenship);
        fd.append("before_achieved_education", beforeAchievedEducation);
        fd.append("permanent_address", permanentAddress);
        fd.append("temporary_address", temporaryAddress);
        fd.append("tax_number", taxNumber);
        fd.append("phone_number", phoneNumber);
        fd.append("gender", gender);
        await fetch(`${baseurl}/user/get/data/${id}`, {credentials: "include", method: "PATCH", body: fd});
        await getUserData();
    }

    async function assignToClass(cid: string) {
        await fetch(`${baseurl}/class/get/${cid}/add_user/${id}`, {credentials: "include", method: "PATCH"});
         await getMyClasses();
    }

    async function deleteFromClass(cid: string) {
        await fetch(`${baseurl}/class/get/${cid}/remove_user/${id}`, {credentials: "include", method: "DELETE"});
        await getMyClasses();
    }

    async function removeUserFromParent(sid: string) {
        await fetch(`${baseurl}/parent/${id}/assign/student/${sid}`, {credentials: "include", method: "DELETE"});
        await getMyChildren();
    }

    async function assignToParent(sid: string) {
        await fetch(`${baseurl}/parent/${id}/assign/student/${sid}`, {credentials: "include", method: "PATCH"});
        await getMyChildren();
    }

    getClasses();
    getMyClasses();
    getUserData();
    getStudents();
    getMyChildren();
</script>

<Textfield bind:value={name} label="Ime" style="width: 100%;" required on:change={async () => await patchUser()}>
    <HelperText slot="helper">Vpišite ime - bodite zelo pozorni</HelperText>
</Textfield>
<Textfield bind:value={surname} label="Priimek" style="width: 100%;" required on:change={async () => await patchUser()}>
    <HelperText slot="helper">Vpišite priimek - bodite zelo pozorni</HelperText>
</Textfield>
<Textfield bind:value={email} label="Elektronski naslov" style="width: 100%;" required on:change={async () => await patchUser()}>
    <HelperText slot="helper">Vpišite elektronski naslov - bodite zelo pozorni</HelperText>
</Textfield>
<Textfield bind:value={phoneNumber} label="Telefonska številka" style="width: 100%;" required on:change={async () => await patchUser()}>
    <HelperText slot="helper">Vpišite telefonsko številko - bodite zelo pozorni</HelperText>
</Textfield>
<Select bind:value={gender} label="Izberite spol" variant="outlined" on:MDCSelect:change={async () => await patchUser()}>
    <Option value=""/>
    <Option value="male">Moški</Option>
    <Option value="female">Ženski</Option>
</Select>
<p/>
{#if role === "student" || role === "parent"}
    <Textfield bind:value={permanentAddress} label="Stalni naslov" style="width: 100%;" required on:change={async () => await patchUser()}>
        <HelperText slot="helper">Vpišite stalni naslov - bodite zelo pozorni</HelperText>
    </Textfield>
    <Textfield bind:value={temporaryAddress} label="Začasni naslov" style="width: 100%;" on:change={async () => await patchUser()}>
        <HelperText slot="helper">Vpišite začasni naslov - bodite zelo pozorni</HelperText>
    </Textfield>
    <Textfield bind:value={taxNumber} label="Davčna številka" style="width: 100%;" on:change={async () => await patchUser()}>
        <HelperText slot="helper">Vpišite davčno številko - bodite zelo pozorni</HelperText>
    </Textfield>
{/if}
{#if role === "student"}
    <Textfield bind:value={birthCertificateNumber} label="Številka matičnega lista" style="width: 100%;" required on:change={async () => await patchUser()}>
        <HelperText slot="helper">Vpišite številko matičnega lista - bodite zelo pozorni</HelperText>
    </Textfield>
    <Textfield bind:value={birthCity} label="Kraj rojstva" style="width: 100%;" required on:change={async () => await patchUser()}>
        <HelperText slot="helper">Vpišite kraj rojstva - bodite zelo pozorni</HelperText>
    </Textfield>
    <Textfield bind:value={birthCountry} label="Država rojstva" style="width: 100%;" required on:change={async () => await patchUser()}>
        <HelperText slot="helper">Vpišite državo rojstva - bodite zelo pozorni</HelperText>
    </Textfield>
    <Textfield bind:value={dateOfBirth} type="date" required on:change={async () => await patchUser()}>
        <Icon class="material-icons" slot="leadingIcon">event</Icon>
        <HelperText slot="helper">Vpišite datum rojstva - bodite zelo pozorni</HelperText>
    </Textfield>
    <Textfield bind:value={emso} label="EMŠO" style="width: 100%;" required on:change={async () => await patchUser()}>
        <HelperText slot="helper">Vpišite EMŠO (avtomatično preverja veljavnost glede na spol)</HelperText>
    </Textfield>
    <Textfield bind:value={citizenship} label="Državljanstvo" style="width: 100%;" required on:change={async () => await patchUser()}>
        <HelperText slot="helper">Vpišite državljanstvo (npr. slovensko) - bodite zelo pozorni</HelperText>
    </Textfield>
    <Textfield bind:value={beforeAchievedEducation} label="Predhodno pridobljena izobrazba" style="width: 100%;" on:change={async () => await patchUser()}>
        <HelperText slot="helper">Vpišite predhodno pridobljeno izobrazbo (npr. OŠ Primer, 2013-2022)</HelperText>
    </Textfield>
{/if}

{#if role === "student"}
    <h2>Dodaj učenca v razred:</h2>
    <Select bind:value={classId} label="Izberite razred" variant="outlined">
        <Option value=""/>
        {#each classes as c}
            <Option on:click={async () => {await assignToClass(c["ID"])}} value={c["ID"]}>{c["Name"]}</Option>
        {/each}
    </Select>
    <h2>Razredi, v katere je učenec dodan:</h2>
    <List class="demo-list">
        {#each myClasses as item}
            <Item>
                <TextList>{item["Name"]}</TextList>
                <Meta><IconButton class="material-icons" on:click={async () => await deleteFromClass(item["ID"])} title="Remove from class">delete</IconButton></Meta>
            </Item>
        {/each}
    </List>
{/if}
{#if role === "parent"}
    <h2>Dodeli učenca staršu (poveži uporabniška računa):</h2>
    <Select bind:classId label="Izberite razred" variant="outlined">
        <Option value=""/>
        {#each students as c}
            <Option on:click={async () => {await assignToParent(c["ID"])}} value={c["ID"]}>{c["Name"]}</Option>
        {/each}
    </Select>
    <h2>Učenci:</h2>
    <List class="demo-list">
        {#each myStudents as item}
            <Item>
                <TextList>{item["Name"]}</TextList>
                <Meta><IconButton class="material-icons" on:click={async () => await removeUserFromParent(item["ID"])} title="Remove user from parent">delete</IconButton></Meta>
            </Item>
        {/each}
    </List>
{/if}
