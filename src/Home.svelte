<script>
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
</script>

<Drawer active="pregled" />
<AppContent class="app-content">
    <main class="main-content">
        <h1>Pozdravljeni</h1>
        <h3>To je pregled po MeetPlan sistemu.</h3>
        <h3>MeetPlan je bil popolnoma prenovljen. Funkcije se še dodajajo. Dobrodošli v verzijo 2.0</h3>
    </main>
</AppContent>