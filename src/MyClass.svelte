<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import {navigate} from "svelte-routing";
    import jwt_decode from "jwt-decode";
    import Button, {Label} from "@smui/button";
    import Icon from '@smui/textfield/icon';
    import {baseurl} from "./constants";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import Select, {Option} from "@smui/select";

    import List, {
        Item,
        Graphic,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list';

    import Avatar from "svelte-avatar";

    let classes = [];
    let classId;

    let className;

    let classDetails;

    function getClasses() {
        fetch(`${baseurl}/user/get/classes`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => classes = r["data"]);
    }

    function getClass(cid) {
        fetch(`${baseurl}/class/get/${cid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => classDetails = r["data"]);
    }

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    getClasses();
</script>

<Drawer active="myclass" />
<AppContent class="app-content">
    <main class="main-content">
        <Select bind:classId label="Izberite razred">
            <Option value="" on:click={() => {
                classId = undefined
                className = undefined;
                classDetails = undefined;
            }}/>
            {#each classes as c}
                <Option on:click={() => {
                    classId = c["ID"];
                    className = c["Name"];
                    getClass(classId);
                }} value={c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
        {#if classDetails}
            <h1>{className}</h1>
            <List
                    twoLine
                    avatarList
                    singleSelection
            >
                {#each classDetails.Students as item}
                    <Item on:click={() => {
                        navigate(`/class/user/${item.ID}`)
                    }}>
                        <Avatar name={item["Name"]}/><div style="width: 15px;"/>
                        <Text>
                            <PrimaryText>{item["Name"]}</PrimaryText>
                        </Text>
                    </Item>

                {/each}
            </List>
        {/if}
    </main>
</AppContent>