<script lang="ts">
    import Drawer from "../Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import DataTable, {Head, Row, Cell, Body} from "@smui/data-table";
    import LinearProgress from '@smui/linear-progress';
    import SegmentedButton, {Segment, Label} from "@smui/segmented-button";
    import IconButton from "@smui/icon-button";

    let loaded: boolean = false;
    let items = [];

    loadThings();

    function loadThings() {
        loaded = false;

        fetch('http://127.0.0.1:8000/users/get', {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    items = json["data"];
                    loaded = true;
                },
            );
    }

    let choices = ["student", "teacher", "admin"];

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
                </Row>
            </Head>
            <Body>
            {#each items as item}
                <Row on:click={() => {
                    navigate("/user/" + item["ID"])
                }}>
                    <Cell numeric>{item["ID"]}</Cell>
                    <Cell>{item["Name"]}</Cell>
                    <Cell>{item["Email"]}</Cell>
                    <Cell>
                        {#if decoded["email"] !== item["Email"]}
                            <SegmentedButton segments={choices} let:segment singleSelect on:change={(val) => {
                                val.stopPropagation();
                                console.log(val);

                                let fd = new FormData();
                                fd.append("role", val.detail.segmentId);

                                fetch('http://127.0.0.1:8000/user/role/update/' + item["ID"], {
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
                                <!-- Note: the `segment` property is required! -->
                                <Segment {segment}>
                                    <Label>{segment}</Label>
                                </Segment>
                            </SegmentedButton>
                        {/if}
                    </Cell>
                    <Cell>
                        {#if decoded["email"] !== item["Email"]}
                            <IconButton class="material-icons" on:click={(val) => {
                                val.stopPropagation();
                                fetch('http://127.0.0.1:8000/user/delete/' + item["ID"], {
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