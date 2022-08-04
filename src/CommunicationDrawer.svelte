<script lang="ts">
    import Drawer, {
        Content,
        Header,
        Title,
        Scrim,
    } from '@smui/drawer';
    import List, { Item, Text, Graphic, Separator } from '@smui/list';
    import { navigate } from "svelte-routing";
    import IconButton from "@smui/icon-button";
    import Badge from '@smui-extra/badge';

    import jwt_decode from "jwt-decode";

    import {baseurl} from "./constants";
    import isMobile from "is-mobile";
    import Button, {Icon, Label} from "@smui/button";
    import {onMount} from "svelte";

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

    let communicationUnread = {};
    let unreadMessages;

    function getUnread() {
        fetch(`${baseurl}/user/get/unread_messages`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    unreadMessages = json.data;
                    communicationUnread = {};
                    for (let i in unreadMessages) {
                        let message = unreadMessages[i];
                        if (communicationUnread[message.CommunicationID]) {
                            communicationUnread[message.CommunicationID] = communicationUnread[message.CommunicationID] + 1;
                        } else {
                            communicationUnread[message.CommunicationID] = 1;
                        }
                    }
                },
            );
    }

    const decoded = jwt_decode(token);

    let communications = [];

    const mobile = isMobile();
    let open: boolean = !mobile;

    let newActive = false;

    export let active: string;
    export let communicationActive: string;
    export let openDialog;

    getCommunications();
    getUnread();

    setInterval(getUnread, 10000);

    onMount(() => {
        open = active === "communicationview" ? true : open
    })
</script>

<Drawer variant={mobile ? "modal" : "dismissible"} fixed={false} bind:open>
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
                <Text>
                    Komunikacija
                    {#if unreadMessages && unreadMessages.length !== 0}
                        <Badge inset aria-label="new messages count" style="top: 20px; right: 20px;">{unreadMessages.length}</Badge>
                    {/if}
                </Text>
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
                    <Text>
                        {communication.Title}
                        {#if communicationUnread[communication.ID]}
                            <Badge inset aria-label="new messages count" style="top: 20px; right: 20px;">{communicationUnread[communication.ID]}</Badge>
                        {/if}
                    </Text>
                </Item>
            {/each}
        </List>
    </Content>
</Drawer>
{#if mobile}
    <Scrim fixed={false} />
    <Button on:click={() => open = !open}>
        <Icon class="material-icons">menu_open</Icon>
        {#if open}
            <Label>Zapri navigacijo</Label>
        {:else}
            <Label>Odpri navigacijo</Label>
        {/if}
    </Button>
{/if}

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