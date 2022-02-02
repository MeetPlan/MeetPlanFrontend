<script lang="ts">
    import SegmentedButton, {Segment} from "@smui/segmented-button";
    import { Label } from '@smui/common';

    import "@smui/segmented-button/bare.css";

    let choices = ['SE NE TESTIRA', 'NEGATIVEN', 'POZITIVEN', 'NEVELJAVEN'];

    let selected = '';
</script>

<div class="columns margins">
    <SegmentedButton segments={choices} let:segment singleSelect bind:selected>
        <!-- Note: the `segment` property is required! -->
        <Segment {segment}>
            <Label>{segment}</Label>
        </Segment>
    </SegmentedButton>
</div>