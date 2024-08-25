<script lang="ts">
    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import { Label } from '@smui/common';
    import {baseurl} from "../constants";

    let choices = ['SE NE TESTIRA', 'NEGATIVEN', 'POZITIVEN', 'NEVELJAVEN'];

    export let classId: string;
    export let selected: string;
    export let userId: number;
    export let onSelect; // TODO: to naj bi bil callback ali nekaj podobnega!!!
</script>

<div class="columns margins">
    <SegmentedButton segments={choices} let:segment singleSelect bind:selected>
        <!-- Note: the `segment` property is required! -->
        <Segment {segment} on:click={async () => {
            let formData = new FormData();
            formData.append("result", segment)

            let response = await fetch(`${baseurl}/user/self_testing/patch/${classId}/${userId}`, {method: "PATCH", body: formData, credentials: "include"});
            let r = await response.json();
            console.log(r);
            selected = r["data"]["Result"];
            onSelect();
        }}>
            <Label>{segment}</Label>
        </Segment>
    </SegmentedButton>
</div>