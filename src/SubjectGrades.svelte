<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import GradesTable from "./Widgets/GradesTable.svelte";

    export let meetingId;
</script>

<Drawer active="grading" meetingActive={meetingId} />
<AppContent class="app-content">
    <main class="main-content">
        <GradesTable meetingId={meetingId} />
    </main>
</AppContent>