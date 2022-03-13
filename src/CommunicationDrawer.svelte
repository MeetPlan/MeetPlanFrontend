<script lang="ts">
    import Drawer, {
        Content,
        Header,
        Title,
    } from '@smui/drawer';
    import List, { Item, Text, Graphic, Separator } from '@smui/list';
    import { navigate } from "svelte-routing";
    import IconButton from "@smui/icon-button";

    import jwt_decode, { JwtPayload } from "jwt-decode";

    import {baseurl} from "./constants";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    function getCommunications() {
        fetch(`${baseurl}/communications/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                communications = r.data;
            });
    }

    const decoded = jwt_decode<JwtPayload>(token);

    let communications = [];

    let open: boolean = true;

    let newActive = false;

    export let active: string;
    export let communicationActive: string;
    export let openDialog;

    getCommunications();
</script>

<!-- Don't include fixed={false} if this is a page wide drawer.
      It adds a style for absolute positioning. -->
<Drawer variant="dismissible" fixed={true} bind:open>
    <Header class="sameline">
        <Title style="display:inline-block;">MeetPlan</Title>
        <div style="display:inline-block; float:right;">
            <IconButton class="material-icons" aria-hidden="true" on:click={() => {
                    localStorage.clear()
                    navigate("/login")
                }}>logout</IconButton>
        </div>
    </Header>
    <Content>
        <List>
            <Item
                    href="javascript:void(0)"
                    on:click={() => navigate('/')}
            >
                <Graphic class="material-icons" aria-hidden="true">home</Graphic>
                <Text>Pregled</Text>
            </Item>
            <Item
                    href="javascript:void(0)"
                    on:click={() => window.location.href ='/communication/view'}
                    activated={active === "communicationview"}
            >
                <Graphic class="material-icons" aria-hidden="true">chat</Graphic>
                <Text>Komunikacija</Text>
            </Item>
            <Separator />
            <Item
                    href="javascript:void(0)"
                    on:click={() => {
                        openDialog();
                    }}
            >
                <Graphic class="material-icons" aria-hidden="true">add</Graphic>
                <Text>Nov pogovor</Text>
            </Item>
            {#each communications as communication}
                <Item
                        href="javascript:void(0)"
                        on:click={() => window.location.href = `/communication/${communication.ID}`}
                        activated={active === 'communication' + communication.ID}
                >
                    <Graphic class="material-icons" aria-hidden="true">chat</Graphic>
                    <Text>{communication.Title}</Text>
                </Item>
            {/each}
        </List>
    </Content>
</Drawer>

<style>
    .sameline {
        white-space: nowrap;
    }

    /* These classes are only needed because the
      drawer is in a container on the page. */
    .drawer-container {
        position: relative;
        display: flex;
        overflow: hidden;
        z-index: 0;
    }

    * :global(.app-content) {
        flex: auto;
        overflow: auto;
        position: relative;
        flex-grow: 1;
    }

    .main-content {
        overflow: auto;
        padding: 16px;
        height: 100%;
        box-sizing: border-box;
    }
</style>