<script lang="ts">
    import Drawer from "./CommunicationDrawer.svelte";
    import {AppContent} from "@smui/drawer";

    import Textfield from "@smui/textfield";

    import {baseurl} from "./constants";

    import Avatar from "svelte-avatar";

    import List, { Group, Subheader, Item, Meta } from '@smui/list';
    import Checkbox from '@smui/checkbox';

    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import FormField from '@smui/form-field';
    import Select, {Option} from "@smui/select";

    import * as marked from 'marked';

    import Button, {Label} from "@smui/button";
    import Icon from '@smui/textfield/icon';
    import jwt_decode, {JwtPayload} from "jwt-decode";

    export let id: string = "";

    const token = localStorage.getItem("key");
    const decoded = jwt_decode<JwtPayload>(token);

    function getCommunication() {
        fetch(`${baseurl}/communication/get/${id}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                comm = r.data;
            });
    }

    function deleteMessage(messageId) {
        fetch(`${baseurl}/message/get/${messageId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((r) => r.json())
            .then((r) => {
                getCommunication();
            });
    }

    function editMessage() {
        let fd = new FormData();
        fd.append("body", newMessageValue)
        fetch(`${baseurl}/message/get/${messageEditingId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH", body: fd})
            .then((r) => r.json())
            .then((r) => {
                getCommunication();
                messageEditingId = undefined;
                newMessageValue = "";
            });
    }

    let teachers = [];
    let admins = [];
    let principal = [];
    let principalAssistant = [];
    let foodOrganizer = [];
    let schoolPsychologist = [];

    function getUsers() {
        fetch(`${baseurl}/users/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    let users = json.data;
                    for (let i in users) {
                        let user = users[i];
                        if (user["Role"] === "admin") {
                            admins = [...admins, user];
                        } else if (user["Role"] === "teacher") {
                            teachers = [...teachers, user];
                        } else if (user["Role"] === "school psychologist") {
                            schoolPsychologist = [...schoolPsychologist, user];
                        } else if (user["Role"] === "principal") {
                            principal = [...principal, user];
                        } else if (user["Role"] === "principal assistant") {
                            principalAssistant = [...principalAssistant, user];
                        } else if (user["Role"] === "food organizer") {
                            foodOrganizer = [...foodOrganizer, user];
                        }
                    }
                },
            );
    }

    let comm;

    let newMessageValue = "";
    let messageEditingId = undefined;

    let newCommunicationTitle = "";
    let usersAtCommunication = [];
    let open = false;
    let user = "";
    let rerender = true;
    let rerenderDrawer = true;

    let selected = [];

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
        aria-describedby="list-content"
>
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="simple-title">
        <FormField>
            <Textfield
                    bind:value={newCommunicationTitle}
                    style="width: 100%;"
            />
        </FormField>
    </Title>
    <Content id="list-content">
        <Group>
            <Subheader>Administratorji</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each admins as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Ravnatelji</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each principal as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Pomočniki ravnatelja</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each principalAssistant as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Šolski psihologi (svetovalni delavci)</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each schoolPsychologist as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Organizator šolske prehrane</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each foodOrganizer as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Učitelji</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each teachers as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
        </Group>
    </Content>
    <Actions>
        <Button on:click={() => {
            let fd = new FormData();
            fd.append("users", JSON.stringify(selected));
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
                    {#if message.UserID === decoded["user_id"]}
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
                {@html marked.marked(message.Body)}
            {/each}
            <hr>
            <Textfield
                    textarea
                    bind:value={newMessageValue}
                    style="width: 100%;"
            />
            {#if newMessageValue !== ""}
                <h2>Predogled</h2>
                {@html marked.marked(newMessageValue)}
            {/if}
            <p/>
            {#if messageEditingId === undefined}
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
    </main>
</AppContent>