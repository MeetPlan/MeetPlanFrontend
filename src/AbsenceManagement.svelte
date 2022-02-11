<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import List, {
        Item,
        Graphic,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list';

    import {baseurl} from "./constants";

    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import { Label } from '@smui/common';

    let absences = [];

    function getStudents() {
        fetch(`${baseurl}/meeting/get/${meetingId}/absences`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((r) => absences = r["data"])
    }

    export let meetingId;

    let choices = ["UNMANAGED", "ABSENT", "PRESENT", "PRESENT ONLINE"];
    let c = {
        "UNMANAGED": "Še ne urejeno",
        "ABSENT": "Odsoten",
        "PRESENT": "Prisoten",
        "PRESENT ONLINE": "Prisoten na daljavo"
    }

    getStudents();
</script>

<Drawer active="absenceManagement" meetingActive={meetingId} />
<AppContent class="app-content">
    <main class="main-content">
        <div>
            <List
                    twoLine
                    avatarList
                    singleSelection
            >
                {#each absences as item}
                    <Item>
                        <Graphic
                                style="background-image: url(https://place-hold.it/40x40?text={item['UserName'].split(' ').map((val) => val.substring(0, 1)).join('')}&fontsize=16);"
                        />
                        <Text>
                            <PrimaryText>{item["UserName"]}</PrimaryText>
                            <SecondaryText>Vpisal {item["TeacherName"]}</SecondaryText>
                        </Text>
                        <Meta>
                            <SegmentedButton segments={choices} let:segment singleSelect bind:selected={item.AbsenceType}>
                                <!-- Note: the `segment` property is required! -->
                                <Segment {segment} on:click={() => {
                                    let formData = new FormData();
                                    formData.append("absence_type", segment)

                                    fetch(`${baseurl}/meeting/absence/${item.ID}`, {method: "PATCH", body: formData, headers: {"Authorization": "Bearer " + localStorage.getItem("key")}}).then((response) => {
                                        return response.json()
                                    }).then((response) => {
                                        console.log(response);
                                        getStudents()
                                    })
                                }}>
                                    <Label>{c[segment]}</Label>
                                </Segment>
                            </SegmentedButton>
                        </Meta>
                    </Item>

                {/each}
            </List>
        </div>
    </main>
</AppContent>