<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import Error from "./Widgets/Error.svelte";

    let url = new URL(window.location.toString());
</script>

<Drawer />
<AppContent class="app-content">
    <main>
        <Error error={url.searchParams.get("error")}/>
    </main>
</AppContent>