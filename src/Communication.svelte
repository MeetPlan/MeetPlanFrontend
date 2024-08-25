<script lang="ts">
    import Textfield from "@smui/textfield";

    import {baseurl} from "./constants";

    import Avatar from "svelte-avatar";

    import { Meta } from '@smui/list';

    import * as marked from 'marked';

    import Button, {Label} from "@smui/button";
    import Icon from '@smui/textfield/icon';

    import insane from "insane";

    export let id: string = "";

    async function getCommunication() {
        let response = await fetch(`${baseurl}/communication/get/${id}`, {credentials: "include"});
        let r = await response.json();
        comm = r.data;
    }

    async function deleteMessage(messageId: string) {
        await fetch(`${baseurl}/message/get/${messageId}`, {credentials: "include", method: "DELETE"});
        await getCommunication();
    }

    async function editMessage() {
        let fd = new FormData();
        fd.append("body", newMessageValue)
        await fetch(`${baseurl}/message/get/${messageEditingId}`, {credentials: "include", method: "PATCH", body: fd});
        await getCommunication();
        messageEditingId = undefined;
        newMessageValue = "";
    }

    let comm;

    let newMessageValue = "";
    let messageEditingId: string | undefined = undefined;

    let newCommunicationTitle = "";
    let usersAtCommunication = [];
    let open = false;
    let user = "";

    function openDialog() {
        usersAtCommunication = [];
        newCommunicationTitle = "";
        user = "";
        open = true;
    }

    if (id !== "view" && id !== "") {
        getCommunication();
        setInterval(getCommunication, 10000);
    }
</script>

{#if comm}
    <h1>{comm.Title}</h1>
    {#each comm.Messages as message}
        <div style="white-space: nowrap;">
            <Avatar name={message.UserName} style="display: inline-block;"/>
            <h2 style="display: inline-block; text-align: center;">{message.UserName}</h2>
            {#if message.UserID.toString() === localStorage.getItem("userId")}
                <Meta style="display: inline-block;">
                    <Button on:click={() => deleteMessage(message.ID)}>
                        <Icon class="material-icons">delete</Icon>
                        <Label>Izbriši</Label>
                    </Button>
                </Meta>
                <Meta style="display: inline-block;">
                    <Button on:click={() => {
                        messageEditingId = message.ID;
                        newMessageValue = message.Body;
                    }}>
                        <Icon class="material-icons">edit</Icon>
                        <Label>Uredi</Label>
                    </Button>
                </Meta>
            {/if}
        </div>
        {@html insane(marked.marked(message.Body))}
    {/each}
    <hr>
    <Textfield
            textarea
            bind:value={newMessageValue}
            style="width: 100%;"
    />
    {#if newMessageValue !== ""}
        <h2>Predogled</h2>
        {@html insane(marked.marked(newMessageValue))}
    {/if}
    <p/>
    {#if messageEditingId === undefined}
    <Button on:click={async () => {
        let fd = new FormData();
        fd.append("body", newMessageValue)
        await fetch(`${baseurl}/communication/get/${id}/message/new`, {credentials: "include", body: fd, method: "POST"});
        newMessageValue = "";
        await getCommunication();
    }}>
        <Icon class="material-icons">send</Icon>
        <Label>Pošlji</Label>
    </Button>
    {:else}
        <Button on:click={() => editMessage()}>
            <Icon class="material-icons">done</Icon>
            <Label>Končaj z urejanjem</Label>
        </Button>
        <Button on:click={() => {
            messageEditingId = undefined;
            newMessageValue = "";
        }}>
            <Icon class="material-icons">close</Icon>
            <Label>Končaj z urejanjem brez shranjevanja sprememb</Label>
        </Button>
    {/if}
{/if}
