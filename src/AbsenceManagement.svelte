<script lang="ts">
    import List, {
        Item,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list';
    import Avatar from "svelte-avatar";
    import {baseurl} from "./constants";
    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import { Label } from '@smui/common';

    let absences = [];

    async function getStudents() {
        let response = await fetch(`${baseurl}/meeting/get/${meetingId}/absences`, {credentials: "include"});
        let r = await response.json();
        absences = r["data"];
    }

    export let meetingId: string;

    let choices = ["UNMANAGED", "ABSENT", "LATE", "PRESENT", "PRESENT ONLINE"];
    const c = {
        "UNMANAGED": "Še ne urejeno",
        "ABSENT": "Odsoten",
        "PRESENT": "Prisoten",
        "PRESENT ONLINE": "Prisoten na daljavo",
        "LATE": "Zamudil",
    }

    getStudents();
</script>

<div>
    <List
            twoLine
            avatarList
            singleSelection
    >
        {#each absences as item}
            <Item>
                <Avatar name={item["UserName"]}/><div style="width: 15px;"/>
                <Text>
                    <PrimaryText>{item["UserName"]}</PrimaryText>
                    <SecondaryText>Vpisal {item["TeacherName"]}</SecondaryText>
                </Text>
                <Meta>
                    <SegmentedButton segments={choices} let:segment singleSelect bind:selected={item.AbsenceType}>
                        <!-- Note: the `segment` property is required! -->
                        <Segment {segment} on:click={async () => {
                            let formData = new FormData();
                            formData.append("absence_type", segment)

                            let response = await fetch(`${baseurl}/meeting/absence/${item.ID}`, {method: "PATCH", body: formData, credentials: "include"});
                            let r = await response.json()
                            console.log(r);
                            await getStudents();
                        }}>
                            <Label>{c[segment]}</Label>
                        </Segment>
                    </SegmentedButton>
                </Meta>
            </Item>

        {/each}
    </List>
</div>
