<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import jwt_decode, { JwtPayload } from "jwt-decode";

    import { Icon } from '@smui/common';

    import Button, {Label} from "@smui/button";
    import Textfield from "@smui/textfield";


    import {baseurl} from "./constants";
    import * as marked from 'marked';

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        localStorage.clear();
        window.location.href = "/login";
    }

    let items = [];
    let classId = "";

    let newBody = "";

    let systemNotifications = [];

    const decoded = jwt_decode<JwtPayload>(token);

    function getSystemNotifications() {
        fetch(`${baseurl}/system/notifications`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => systemNotifications = json.data);
    }

    function deleteNotification(nid) {
        fetch(`${baseurl}/notification/${nid}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((json) => getSystemNotifications());
    }

    function newNotification() {
        let fd = new FormData();
        fd.append("body", newBody)
        fetch(`${baseurl}/system/notifications/new`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "POST", body: fd})
            .then((response) => response.json())
            .then((json) => getSystemNotifications());
    }

    getSystemNotifications();
</script>

<Drawer active="notifications" />
<AppContent class="app-content">
    <main class="main-content">
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
                {@html marked.marked(newBody)}
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
                {@html marked.marked(notification.Notification)}
            </div>
            <Button on:click={() => deleteNotification(notification.ID)}>
                <Icon class="material-icons">delete</Icon>
                <Label>Izbriši</Label>
            </Button>
            <hr>
        {/each}
    </main>
</AppContent>
