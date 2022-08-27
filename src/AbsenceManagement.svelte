<script lang="ts">
    import List, {
        Item,
        Graphic,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list';

    import Avatar from "svelte-avatar";

    import {baseurl} from "./constants";

    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import { Label } from '@smui/common';
    import Cookies from "js-cookie";

    let absences = [];

    function getStudents() {
        fetch(`${baseurl}/meeting/get/${meetingId}/absences`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            .then((response) => response.json())
            .then((r) => absences = r["data"])
    }

    export let meetingId;

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
                        <Segment {segment} on:click={() => {
                            let formData = new FormData();
                            formData.append("absence_type", segment)

                            fetch(`${baseurl}/meeting/absence/${item.ID}`, {method: "PATCH", body: formData, headers: {"Authorization": "Bearer " + Cookies.get("key")}}).then((response) => {
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
