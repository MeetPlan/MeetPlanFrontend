<script lang="ts">
    import List, {
        Item,
        Graphic,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list';

    import {baseurl, saveBlob} from "./constants";
    import IconButton from "@smui/icon-button";
    import Select, {Option} from "@smui/select";
    import Avatar from "svelte-avatar";
    import SamotestiranjeUcenec from "./Samotestiranje/PogledUcenec.svelte";
    import Tipi from "./Samotestiranje/Tipi.svelte";
    import {onMount} from "svelte";
    import { Icon } from '@smui/common';

    let options;
    let classes = [];
    let classId = "";

    async function getClasses() {
        let response = await fetch(`${baseurl}/classes/get`, {credentials: "include"})
        const r = await response.json();
        classes = r["data"];
    }

    async function makeRequest(c: number) {
        let response = await fetch(`${baseurl}/class/get/${c}/self_testing`, {credentials: "include"})
        const r = await response.json();
        options = r["data"];
    }

    onMount(async () => {
        if (classId !== "") {
            await makeRequest(classId)
        } else if (!(localStorage.getItem("role") === "student" || localStorage.getItem("role") === "parent" || localStorage.getItem("role") === "food organizer")) {
            await getClasses()
        }
    });
</script>

{#if localStorage.getItem("role") === "teacher" || localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant" || localStorage.getItem("role") === "school psychologist"}
    <div
            tabindex="0"
            style="background-color: #ffc107; color: black; padding: 10px;"
    >
        <Icon class="material-icons">error</Icon>
        Te funkcije morda ni možno uporabljati v vaši državi zaradi zakonov o varstvu osebnih podatkov.<br>
        Države v katerih te funkcije zagotovo ni možno uporabljati:<br>
        - Slovenija<br>
        (možno je, da obstajajo tudi druge države, katerih nismo omenili tukaj)<br>
    </div>
    <br>
    <div>
        <Select bind:value={classId} label="Izberite razred">
            <Option value="" on:click={() => options = undefined}/>
            {#each classes as c}
                <Option on:click={async () => {
                    await makeRequest(c["ID"]);
                    classId = c["ID"];
                }} value={c["ID"]}>{c["Name"]}</Option>
            {/each}
        </Select>
        {#if options !== undefined}
            <List
                    twoLine
                    avatarList
                    singleSelection
            >
                {#each options as item}
                    <Item>
                        <Avatar name={item["UserName"]}/><div style="width: 15px;"/>
                        <Text>
                            <PrimaryText>{item["UserName"]}</PrimaryText>
                            <SecondaryText>{item["IsDone"] ? "Je opravil testiranje" : "Ni opravil testiranja"}</SecondaryText>
                        </Text>
                        <Meta>
                            <Tipi selected={item["Result"]} userId={item["UserID"]} onSelect={async () => {await makeRequest(item["ClassID"])}} classId="{classId}" />
                        </Meta>
                        <Meta>
                            {#if item["IsDone"] && item["Result"] !== "SE NE TESTIRA"}
                                <IconButton class="material-icons" on:click={async () => {
                                    let response = await fetch(`${baseurl}/user/self_testing/get_results/pdf/${item["ID"]}`, {credentials: "include"});
                                    let blob = await response.blob();
                                    await saveBlob(blob);
                                }}>download</IconButton>
                            {:else}
                                <div></div>
                            {/if}
                        </Meta>
                    </Item>

                {/each}
            </List>
        {/if}
    </div>
{:else}
    <SamotestiranjeUcenec />
{/if}