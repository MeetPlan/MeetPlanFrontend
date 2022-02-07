<script lang="ts">
    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import { Label } from '@smui/common';
    import {baseurl} from "../constants";

    let choices = ['SE NE TESTIRA', 'NEGATIVEN', 'POZITIVEN', 'NEVELJAVEN'];

    export let classId: string;
    export let selected: string;
    export let userId: number;
    export let onSelect;
</script>

<div class="columns margins">
    <SegmentedButton segments={choices} let:segment singleSelect bind:selected>
        <!-- Note: the `segment` property is required! -->
        <Segment {segment} on:click={() => {
            let formData = new FormData();
            formData.append("result", segment)

            fetch(`${baseurl}/user/self_testing/patch/${classId}/${userId}`, {method: "PATCH", body: formData, headers: {"Authorization": "Bearer " + localStorage.getItem("key")}}).then((response) => {
                return response.json()
            }).then((response) => {
                console.log(response);
                selected = response["data"]["Result"];
                onSelect();
            })
        }}>
            <Label>{segment}</Label>
        </Segment>
    </SegmentedButton>
</div>