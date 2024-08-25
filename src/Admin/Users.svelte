<script lang="ts">
    import DataTable, {Head, Row, Cell, Body} from "@smui/data-table";
    import LinearProgress from '@smui/linear-progress';
    import SegmentedButton, {Segment, Label} from "@smui/segmented-button";
    import IconButton from "@smui/icon-button";
    import {baseurl, saveBlob} from "../constants";

    import Icon from '@smui/textfield/icon';
    import Button from "@smui/button";

    let loaded: boolean = false;
    let items = [];

    let principalId = undefined;

    async function loadThings() {
        loaded = false;
        let response = await fetch(`${baseurl}/users/get`, {credentials: "include"})
        let json = await response.json();
        items = json["data"];
        loaded = true;
        for (let i in items) {
            let item = items[i]
            if (item.Role === "principal") {
                principalId = item.ID;
                break
            }
        }
    }

    const choices = ["unverified", "student", "parent", "teacher", "food organizer", "school psychologist", "principal assistant", "principal"];

    import { navigate } from "svelte-routing";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";
    import {onMount} from "svelte";

    onMount(loadThings);
</script>

<DataTable table$aria-label="User list" style="width: 100%;">
    <Head>
        <Row>
            <Cell numeric>ID</Cell>
            <Cell style="width: 100%;">Name</Cell>
            <Cell>Email</Cell>
            <Cell>Change role</Cell>
            <Cell>Lock user</Cell>
            <Cell>Reset password</Cell>
            <Cell>Delete user</Cell>
            <Cell>View</Cell>
        </Row>
    </Head>
    <Body>
    {#each items as item}
        <Row>
            <Cell numeric>{item["ID"]}</Cell>
            <Cell>{item["Name"]}</Cell>
            <Cell>{item["Email"]}</Cell>
            <Cell>
                {#if localStorage.getItem("userId") !== item["ID"]}
                    <SegmentedButton segments={choices} let:segment singleSelect on:change={async (e) => {
                        e.stopPropagation();
                        let fd = new FormData();
                        fd.append("role", e.detail.segmentId);
                        principalId = undefined;

                        await fetch(`${baseurl}/user/role/update/${item["ID"]}`, {
                            credentials: "include",
                            body: fd,
                            method: "PATCH"
                        })
                        await loadThings()
                    }} bind:selected="{item['Role']}">
                        {#if
                            (localStorage.getItem("role") === "principal assistant" && !(segment === "principal" || segment === "principal assistant")) ||
                            (localStorage.getItem("role") === "principal" && !(segment === "principal")) ||
                            (localStorage.getItem("role") === "admin")
                        }
                            {#if !(segment === "principal" && principalId !== undefined && principalId !== item.ID)}
                                <Segment {segment}>
                                    <Label>{segment}</Label>
                                </Segment>
                            {/if}
                        {/if}
                    </SegmentedButton>
                {/if}
            </Cell>
            <Cell>
                {#if localStorage.getItem("email") !== item["Email"]}
                    <FormField>
                        <Switch bind:checked={item["IsLocked"]} on:click={async (e) => {
                            e.stopPropagation();
                            await fetch(`${baseurl}/user/lock_unlock/${item["ID"]}`, {credentials: "include", method: "PATCH"});
                            await loadThings();
                        }} />
                    </FormField>
                {/if}
            </Cell>
            <Cell>
                {#if localStorage.getItem("email") !== item["Email"]}
                    <IconButton class="material-icons" on:click={async (e) => {
                        e.stopPropagation();
                        let response = await fetch(`${baseurl}/user/get/password_reset/${item["ID"]}`, {credentials: "include"})
                        let blob = await response.blob()
                        await saveBlob(blob)
                    }}>download</IconButton>
                {/if}
            </Cell>
            <Cell>
                {#if localStorage.getItem("email") !== item["Email"]}
                    <IconButton class="material-icons" on:click={async (e) => {
                        e.stopPropagation();
                        await fetch(`${baseurl}/user/delete/${item["ID"]}`, {
                            credentials: "include",
                            method: "DELETE"
                        })
                        await loadThings()
                    }}>delete</IconButton>
                {/if}
            </Cell>
            <Cell>
                <IconButton class="material-icons" on:click={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${item["ID"]}`)
                }}>info</IconButton>
            </Cell>
        </Row>
    {/each}
    </Body>

    <LinearProgress
            indeterminate
            bind:closed={loaded}
            aria-label="Data is being loaded..."
            slot="progress"
    />
</DataTable>
<p/>
<Button on:click={() => navigate("/register")}>
    <Icon class="material-icons">group_add</Icon>
    <Label>Registriraj novega uporabnika brez izpisa</Label>
</Button>
