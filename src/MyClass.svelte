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

    let classes = [];
    let classId: string | undefined;

    let className;

    let classDetails;

    async function getClasses() {
        let response = await fetch(`${baseurl}/user/get/classes`, {credentials: "include"});
        let r = await response.json();
        classes = r["data"];
    }

    async function getClass(cid: string) {
        let response = await fetch(`${baseurl}/class/get/${cid}`, {credentials: "include"});
        let r = await response.json();
        classDetails = r["data"];
    }

    getClasses();
</script>

<Select bind:value={classId} label="Izberite razred">
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
