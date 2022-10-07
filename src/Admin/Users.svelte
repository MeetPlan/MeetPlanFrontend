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

    loadThings();

    function loadThings() {
        loaded = false;

        fetch(`${baseurl}/users/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((json) => {
                    items = json["data"];
                    loaded = true;
                    for (let i in items) {
                        let item = items[i]
                        if (item.Role === "principal") {
                            principalId = item.ID;
                            break
                        }
                    }
                },
            );
    }

    let choices = ["unverified", "student", "parent", "teacher", "food organizer", "school psychologist", "principal assistant", "principal"];


    import { navigate } from "svelte-navigator";
    import Cookies from "js-cookie";
    import FormField from "@smui/form-field";
    import Switch from "@smui/switch";

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }
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
                    <SegmentedButton segments={choices} let:segment singleSelect on:change={(e) => {
                        e.stopPropagation();
                        console.log(e);

                        let fd = new FormData();
                        fd.append("role", e.detail.segmentId);

                        principalId = undefined;

                        fetch(`${baseurl}/user/role/update/${item["ID"]}`, {
                            headers: {"Authorization": "Bearer " + Cookies.get("key")},
                            body: fd,
                            method: "PATCH"
                        })
                            .then((response) => response.json())
                            .then((json) => {
                                    loadThings()
                                },
                            );
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
                            await fetch(`${baseurl}/user/lock_unlock/${item["ID"]}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH"});
                            loadThings();
                        }} />
                    </FormField>
                {/if}
            </Cell>
            <Cell>
                {#if localStorage.getItem("email") !== item["Email"]}
                    <IconButton class="material-icons" on:click={(e) => {
                        e.stopPropagation();
                        fetch(`${baseurl}/user/get/password_reset/${item["ID"]}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
                            .then((response) => response.blob())
                            .then((blob) => saveBlob(blob))
                            .catch((err) => {
                            console.log(err);
                          });
                    }}>download</IconButton>
                {/if}
            </Cell>
            <Cell>
                {#if localStorage.getItem("email") !== item["Email"]}
                    <IconButton class="material-icons" on:click={(e) => {
                        e.stopPropagation();
                        fetch(`${baseurl}/user/delete/${item["ID"]}`, {
                            headers: {"Authorization": "Bearer " + Cookies.get("key")},
                            method: "DELETE"
                        })
                            .then((response) => response.json())
                            .then((json) => {
                                    loadThings()
                                },
                            );
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
