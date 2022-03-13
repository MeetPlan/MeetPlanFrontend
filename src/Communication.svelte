<script lang="ts">
    import Drawer from "./CommunicationDrawer.svelte";
    import {AppContent} from "@smui/drawer";

    import Textfield from "@smui/textfield";

    import {baseurl} from "./constants";

    import Avatar from "svelte-avatar";

    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import FormField from '@smui/form-field';
    import Select, {Option} from "@smui/select";

    import Button, {Label} from "@smui/button";
    import Icon from '@smui/textfield/icon';

    export let id: string = "";

    function getCommunication() {
        fetch(`${baseurl}/communication/get/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                comm = r.data;
            });
    }

    let users = [];

    function getUsers() {
        fetch(`${baseurl}/users/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    users = json.data;
                },
            );
    }

    let comm;

    let newMessageValue = "";

    let newCommunicationTitle = "";
    let usersAtCommunication = [];
    let open = false;
    let user = "";
    let rerender = true;
    let rerenderDrawer = true;

    function openDialog() {
        usersAtCommunication = [];
        newCommunicationTitle = "";
        user = "";
        open = true;
    }

    getUsers();

    if (id !== "view" && id !== "") {
        getCommunication();
        setInterval(getCommunication, 10000);
    }
</script>

<Dialog
        bind:open
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
>
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="simple-title">
        Nov pogovor
    </Title>
    <Content id="simple-content">
        <FormField>
            <Textfield
                    bind:value={newCommunicationTitle}
                    style="width: 100%;"
            />
        </FormField>
        <br>
        <FormField>
            <Select bind:user label="Oseba" required>
                {#each users as h}
                    <Option value={h} on:click={() => {
                        rerender = false;
                        usersAtCommunication.push(h.ID)
                        setTimeout(() => rerender = true, 100);
                    }}>{h.Name}</Option>
                {/each}
            </Select>
        </FormField>
        <p/>
        {#if rerender}
            {#each users as user}
                {#if usersAtCommunication.includes(user.ID)}
                    {user.Name}
                    <br>
                {/if}
            {/each}
        {/if}
    </Content>
    <Actions>
        <Button on:click={() => {
            let fd = new FormData();
            fd.append("users", JSON.stringify(usersAtCommunication));
            fd.append("title", newCommunicationTitle);
            fetch(`${baseurl}/communication/new`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "POST", body: fd})
                .then((r) => r.json())
                .then((r) => {
                    rerenderDrawer = false;
                    setTimeout(() => rerenderDrawer = true, 100);
                });
        }}>
            <Label>
                USTVARI
            </Label>
        </Button>
    </Actions>
</Dialog>

{#if rerenderDrawer}
    <Drawer active={"communication" + id} communicationActive={id} openDialog={openDialog} />
{/if}
<AppContent class="app-content">
    <main class="main-content">
        {#if comm}
            <h1>{comm.Title}</h1>
            {#each comm.Messages as message}
                <div style="white-space: nowrap;">
                    <Avatar name={message.UserName} style="display: inline-block;"/>
                    <h2 style="display: inline-block; text-align: center;">{message.UserName}</h2>
                </div>
                {message.Body}
            {/each}
            <hr>
            <Textfield
                    textarea
                    bind:value={newMessageValue}
                    style="width: 100%;"
            />
            <p/>
            <Button on:click={() => {
                let fd = new FormData();
                fd.append("body", newMessageValue)
                fetch(`${baseurl}/communication/get/${id}/message/new`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, body: fd, method: "POST"})
                    .then((r) => {
                        newMessageValue = "";
                        getCommunication();
                    });
            }}>
                <Icon class="material-icons">send</Icon>
                <Label>Pošlji</Label>
            </Button>
        {/if}
    </main>
</AppContent>