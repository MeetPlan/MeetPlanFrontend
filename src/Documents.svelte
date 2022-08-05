<script lang="ts">
    import Button, {Label} from "@smui/button";
    import {baseurl} from "./constants";
    import Error from "./Widgets/Error.svelte";
    import Accordion, {Panel, Header, Content} from "@smui-extra/accordion";
    import {AppContent} from "@smui/drawer";
    import IconButton, {Icon} from "@smui/button";
    import Drawer from "./Drawer.svelte";

    let documents = [];
    let open = {};

    const documentTypes = {
        0: "Spričevalo",
        1: "Potrdilo o šolanju",
        2: "Pristopna izjava (resetiranje gesla)",
    };

    async function getDocuments() {
        let response = await fetch(`${baseurl}/documents/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        let json = await response.json();
        documents = json.data;
        for (let i in documents) {
            open[documents[i].ID] = false;
        }
    }

    async function deleteDocument(documentId: string) {
        let fd = new FormData()
        fd.append("documentId", documentId)
        await fetch(`${baseurl}/documents/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, body: fd, method: "DELETE"})
        await getDocuments();
    }
</script>

{#await getDocuments()}
{:then _}
    <Drawer active="documents" />
    <AppContent class="app-content">
        <main class="main-content">
            <Accordion>
                {#each documents as document}
                    <Panel bind:open={open[document.ID]}>
                        <Header>
                            {documentTypes[document.DocumentType]}
                            {#if document.IsSigned}
                                <Icon class="material-icons" on>check</Icon>
                            {/if}
                            <IconButton slot="icon" toggle pressed={open[document.ID]}>
                                <Icon class="material-icons" on>expand_less</Icon>
                                <Icon class="material-icons">expand_more</Icon>
                            </IconButton>
                        </Header>
                        <Content>
                            Enolični identifikator dokumenta: {document.ID}
                            <p/>
                            Izvozila oseba: {document.ExporterName}
                            <p/>
                            Izvožen dne: {(new Date(document.Timestamp)).toDateString()}
                            <p/>
                            {#if document.IsSigned}
                                Dokument je digitalno podpisan.
                                <p/>
                            {/if}
                            <Button on:click={async () => await deleteDocument(document.ID)}>
                                <Icon class="material-icons">remove</Icon>
                                <Label>Popolnoma izbriši dokument</Label>
                            </Button>
                        </Content>
                    </Panel>
                {/each}
            </Accordion>
        </main>
    </AppContent>
{:catch err}
    <Error error={err} />
{/await}