<script lang="ts">
    import Drawer from "../Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import DataTable, {Head, Row, Cell, Body} from "@smui/data-table";
    import LinearProgress from '@smui/linear-progress';
    import SegmentedButton, {Segment, Label} from "@smui/segmented-button";
    import IconButton from "@smui/icon-button";
    import {baseurl} from "../constants";

    let loaded: boolean = false;
    let items = [];

    let principalId = undefined;

    loadThings();

    function loadThings() {
        loaded = false;

        fetch(`${baseurl}/users/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
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

    let choices = ["student", "parent", "teacher", "principal assistant", "principal"];

    import jwt_decode, { JwtPayload } from "jwt-decode";
    import { navigate } from "svelte-routing";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    const decoded = jwt_decode<JwtPayload>(token);
</script>

<Drawer active="users" />
<AppContent class="app-content">
    <main class="main-content">
        <DataTable table$aria-label="User list" style="width: 100%;">
            <Head>
                <Row>
                    <Cell numeric>ID</Cell>
                    <Cell style="width: 100%;">Name</Cell>
                    <Cell>Email</Cell>
                    <Cell>Change role</Cell>
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
                        {#if decoded["user_id"] !== item["ID"]}
                            <SegmentedButton segments={choices} let:segment singleSelect on:change={(e) => {
                                e.stopPropagation();
                                console.log(e);

                                let fd = new FormData();
                                fd.append("role", e.detail.segmentId);

                                principalId = undefined;

                                fetch(`${baseurl}/user/role/update/${item["ID"]}`, {
                                    headers: {"Authorization": "Bearer " + localStorage.getItem("key")},
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
                                    (decoded["role"] !== "principal assistant" && segment !== "principal") ||
                                    (decoded["role"] !== "principal assistant" && segment !== "principal assistant")}
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
                        {#if decoded["email"] !== item["Email"]}
                            <IconButton class="material-icons" on:click={(e) => {
                                e.stopPropagation();
                                fetch(`${baseurl}/user/delete/${item["ID"]}`, {
                                    headers: {"Authorization": "Bearer " + localStorage.getItem("key")},
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
    </main>
</AppContent>