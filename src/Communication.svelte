<script lang="ts">
    import Drawer from "./CommunicationDrawer.svelte";
    import {AppContent} from "@smui/drawer";

    import Textfield from "@smui/textfield";

    import {baseurl} from "./constants";

    import Avatar from "svelte-avatar";

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

    let comm;

    let newMessageValue = "";

    if (id !== "view" && id !== "") {
        getCommunication();
    }
</script>

<Drawer active={"communication" + id} communicationActive={id} />
<AppContent class="app-content">
    <main class="main-content">
        {#if comm}
            <h1>{comm.Title}</h1>
            {#each comm.Messages as message}
                <Avatar name={message.UserName}/>{message.UserName}
                <br>
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

            }}>
                <Icon class="material-icons">send</Icon>
                <Label>Pošlji</Label>
            </Button>
        {/if}
    </main>
</AppContent>