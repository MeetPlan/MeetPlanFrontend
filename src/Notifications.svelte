<script lang="ts">
    import { Icon } from '@smui/common';

    import Button, {Label} from "@smui/button";
    import Textfield from "@smui/textfield";


    import {baseurl} from "./constants";
    import * as marked from 'marked';
    import insane from "insane";
    import Cookies from "js-cookie";

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        document.cookie = "";
        window.location.href = "/login";
    }

    let items = [];
    let classId = "";

    let newBody = "";

    let systemNotifications = [];



    function getSystemNotifications() {
        fetch(`${baseurl}/system/notifications`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((json) => systemNotifications = json.data);
    }

    function deleteNotification(nid) {
        fetch(`${baseurl}/notification/${nid}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((json) => getSystemNotifications());
    }

    function newNotification() {
        let fd = new FormData();
        fd.append("body", newBody)
        fetch(`${baseurl}/system/notifications/new`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "POST", body: fd})
            .then((response) => response.json())
            .then((json) => getSystemNotifications());
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
