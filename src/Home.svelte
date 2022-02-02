<script>
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
</script>

<Drawer active="pregled" />
<AppContent class="app-content">
    <main class="main-content">
        Hello Home
    </main>
</AppContent>