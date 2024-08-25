<script lang="ts">
    import {navigate} from "svelte-routing";
    import {baseurl} from "./constants";
    import Select, {Option} from "@smui/select";

    import List, {
        Item,
        Text,
        PrimaryText,
    } from '@smui/list';

    import Avatar from "svelte-avatar";
    import Cookies from "js-cookie";

    let classes = [];
    let classId;

    let className;

    let classDetails;

    function getClasses() {
        fetch(`${baseurl}/user/get/classes`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((r) => r.json())
            .then((r) => classes = r["data"]);
    }

    function getClass(cid) {
        fetch(`${baseurl}/class/get/${cid}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((r) => r.json())
            .then((r) => classDetails = r["data"]);
    }

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    getClasses();
</script>

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
