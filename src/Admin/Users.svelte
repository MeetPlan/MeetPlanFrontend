<script lang="ts">
    import DataTable, {Head, Row, Cell, Body} from "@smui/data-table";
    import LinearProgress from '@smui/linear-progress';
    import SegmentedButton, {Segment, Label} from "@smui/segmented-button";
    import IconButton from "@smui/icon-button";
    import {baseurl, saveBlob} from "../constants";

    import Icon from '@smui/textfield/icon';
    import Button from "@smui/button";
    import { navigate } from "svelte-routing";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import {onMount} from "svelte";
    import UserSection from "./UserSection.svelte";
    import type {UserJSON} from "../typescript-definitions/tsdef";

    let loaded: boolean = false;
    let items = [];

    let unverified: UserJSON[] = [];
    let students: UserJSON[] = [];
    let parents: UserJSON[] = [];
    let teachers: UserJSON[] = [];
    let foodOrganizers: UserJSON[] = [];
    let psychologists: UserJSON[] = [];
    let assistants: UserJSON[] = [];
    let principal: UserJSON | undefined = undefined;
    let admin: UserJSON | undefined = undefined;

    async function loadThings() {
        loaded = false;
        let response = await fetch(`${baseurl}/users/get`, {credentials: "include"})
        let json = await response.json();
        loaded = true;
        principal = undefined;
        admin = undefined;
        unverified = [];
        students = [];
        parents = [];
        teachers = [];
        foodOrganizers = [];
        psychologists = [];
        assistants = [];
        for (let i of json["data"]) {
            let item = i
            if (item.Role === "unverified") {
                unverified.push(i)
            } else if (item.Role === "student") {
                students.push(i)
            } else if (item.Role === "parent") {
                parents.push(i)
            } else if (item.Role === "teacher") {
                teachers.push(i)
            } else if (item.Role === "food organizer") {
                foodOrganizers.push(i)
            } else if (item.Role === "school psychologist") {
                psychologists.push(i);
            } else if (item.Role === "principal assistant") {
                assistants.push(i);
            } else if (item.Role === "principal") {
                principal = i;
            } else if (item.Role === "admin") {
                admin = i;
            }
        }
        unverified.sort((a, b) => `${a.Surname} ${a.Name}`.localeCompare(`${b.Surname} ${b.Name}`))
        students.sort((a, b) => `${a.Surname} ${a.Name}`.localeCompare(`${b.Surname} ${b.Name}`))
        parents.sort((a, b) => `${a.Surname} ${a.Name}`.localeCompare(`${b.Surname} ${b.Name}`))
        teachers.sort((a, b) => `${a.Surname} ${a.Name}`.localeCompare(`${b.Surname} ${b.Name}`))
        foodOrganizers.sort((a, b) => `${a.Surname} ${a.Name}`.localeCompare(`${b.Surname} ${b.Name}`))
        psychologists.sort((a, b) => `${a.Surname} ${a.Name}`.localeCompare(`${b.Surname} ${b.Name}`))
        assistants.sort((a, b) => `${a.Surname} ${a.Name}`.localeCompare(`${b.Surname} ${b.Name}`))
    }

    const role = localStorage.getItem("role");

    onMount(loadThings);
</script>

<h2>Nepreverjeni uporabniki</h2>
<UserSection users={unverified} callUpdate={loadThings} />

<h2>Učenci</h2>
<UserSection users={students} callUpdate={loadThings} />

<h2>Starši</h2>
<UserSection users={parents} callUpdate={loadThings} />

<h2>Učitelji</h2>
<UserSection users={teachers} callUpdate={loadThings} />

<h2>Organizatorji prehrane</h2>
<UserSection users={foodOrganizers} callUpdate={loadThings} />

<h2>Šolski psihologi</h2>
<UserSection users={psychologists} callUpdate={loadThings} />

<h2>Pomočniki ravnatelja</h2>
<UserSection users={assistants} callUpdate={loadThings} />

<h2>Ravnatelj</h2>
<UserSection users={principal === undefined ? [] : [principal]} callUpdate={loadThings}/>

<h2>Administrator</h2>
<UserSection users={admin === undefined ? [] : [admin]} />

<p/>
<Button on:click={() => navigate("/register")}>
    <Icon class="material-icons">group_add</Icon>
    <Label>Registriraj novega uporabnika brez izpisa</Label>
</Button>
