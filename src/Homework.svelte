<script lang="ts">
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import IconButton, { Icon } from '@smui/icon-button';
    import {baseurl} from "./constants.ts";

    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import { Label } from '@smui/common';

    import Button from "@smui/button";
    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';

    import Avatar from "svelte-avatar";

    import List, {
        Item,
        Graphic,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list';
    import Cookies from "js-cookie";

    let homework = [];
    
    function getHomework() {
        fetch(`${baseurl}/meeting/get/${meetingId}/homework`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((r) => r.json())
            .then((r) => {
                homework = r.data;
                for (let i in homework) {
                    panels.push(false);
                }
            })
    }

    function newHomework() {
        let fd = new FormData();
        fd.append("name", name);
        fd.append("description", description);
        fd.append("to_date", date);
        fetch(`${baseurl}/meeting/get/${meetingId}/homework`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "POST", body: fd})
            .then((r) => r.json())
            .then((r) => {
                getHomework()
            })
    }

    let description = "";
    let name = "";
    let date = "";

    let panels = [];

    const choices = ["ABSENT", "INCOMPLETE", "DONE"];
    const translatedSegments = {
        "DONE": "NAREJENO",
        "ABSENT": "MANJKA",
        "INCOMPLETE": "NEPOPOLNO",
        "NOT MANAGED": "NI VPISANO"
    }

    export let meetingId;

    getHomework();
</script>

<div class="accordion-container">
    <Textfield bind:value={name} label="Ime naloge" required style="width: 100%;" helperLine$style="width: 100%;">
        <HelperText slot="helper">Ime naloge</HelperText>
    </Textfield>
    <Textfield bind:value={description} label="Opis naloge" textarea style="width: 100%;" helperLine$style="width: 100%;" input$rows={8} />
    <Textfield bind:value={date} label="Rok oddaje naloge" type="date" required on:click={() => date = ""}>
        <Icon class="material-icons" slot="leadingIcon">event</Icon>
        <HelperText slot="helper">Izberite prosim rok oddaje naloge</HelperText>
    </Textfield>
    <Button on:click={() => newHomework()}>
        <Icon class="material-icons">add</Icon>
        <Label>Dodaj</Label>
    </Button>
    <h1>Naloge:</h1>
    <Accordion>
        {#each homework as p, i}
            <Panel bind:open={panels[i]}>
                <Header>
                    {p.Name}
                    <IconButton slot="icon" toggle pressed={panels[i]}>
                        <Icon class="material-icons" on>expand_less</Icon>
                        <Icon class="material-icons">expand_more</Icon>
                    </IconButton>
                </Header>
                <Content>
                    {p.Description}
                    {#if p.Description !== ""}
                        <hr/>
                    {/if}
                    Naloga vpisana dne: {p.FromDate}
                    <br>
                    Rok oddaje: {p.ToDate}
                    <List
                            twoLine
                            avatarList
                            singleSelection
                    >
                        {#each p.Students as student}
                            <Item>
                                <Avatar name={student.Name}/><div style="width: 15px;"/>
                                <Text>
                                    <PrimaryText>{student.Name}</PrimaryText>
                                </Text>
                                <Meta>
                                    <SegmentedButton segments={choices} let:segment singleSelect bind:selected={student.Status}>
                                        <!-- Note: the `segment` property is required! -->
                                        <Segment {segment} on:click={() => {
                                            let formData = new FormData();
                                            formData.append("status", segment)

                                            fetch(`${baseurl}/meeting/get/${meetingId}/homework/${p.ID}/${student.UserID}`, {method: "PATCH", body: formData, headers: {"Authorization": "Bearer " + Cookies.get("key")}}).then((response) => {
                                                return response.json()
                                            }).then((response) => {
                                                getHomework();
                                            })
                                        }}>
                                            <Label>{translatedSegments[segment]}</Label>
                                        </Segment>
                                    </SegmentedButton>
                                </Meta>
                            </Item>
                        {/each}
                    </List>
                </Content>
            </Panel>
        {/each}
    </Accordion>
</div>
