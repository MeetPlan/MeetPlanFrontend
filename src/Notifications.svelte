<script lang="ts">
    import { Icon } from '@smui/common';
    import Button, {Label} from "@smui/button";
    import Textfield from "@smui/textfield";
    import {baseurl} from "./constants";
    import * as marked from 'marked';
    import insane from "insane";

    let newBody = "";

    let systemNotifications = [];



    async function getSystemNotifications() {
        let response = await fetch(`${baseurl}/system/notifications`, {credentials: "include"});
        let r = await response.json();
        systemNotifications = r.data;
    }

    async function deleteNotification(nid: string) {
        await fetch(`${baseurl}/notification/${nid}`, {credentials: "include", method: "DELETE"});
        await getSystemNotifications();
    }

    async function newNotification() {
        let fd = new FormData();
        fd.append("body", newBody);
        await fetch(`${baseurl}/system/notifications/new`, {credentials: "include", method: "POST", body: fd});
        await getSystemNotifications();
    }

    getSystemNotifications();
</script>

<h1>Novo obvestilo:</h1>
<Textfield
        textarea
        bind:value={newBody}
        style="width: 100%;"
/>
{#if newBody !== ""}
    <div
            tabindex="0"
            style="background-color: #f57c00; padding: 10px;"
    >
        {@html insane(marked.marked(newBody))}
    </div>
    <Button on:click={() => newNotification()}>
        <Icon class="material-icons">add</Icon>
        <Label>Dodaj</Label>
    </Button>
{/if}
<h1>Obvestila:</h1>
{#each systemNotifications as notification}
    <div
            tabindex="0"
            style="background-color: #f57c00; padding: 10px;"
    >
        {@html insane(marked.marked(notification.Notification))}
    </div>
    <Button on:click={() => deleteNotification(notification.ID)}>
        <Icon class="material-icons">delete</Icon>
        <Label>Izbriši</Label>
    </Button>
    <hr>
{/each}
