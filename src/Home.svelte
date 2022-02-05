<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import jwt_decode, { JwtPayload } from "jwt-decode";

    import Timetable from "./Widgets/Timetable.svelte";

    import { navigate } from "svelte-routing";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    const decoded = jwt_decode<JwtPayload>(token);
</script>

<Drawer active="pregled" />
<AppContent class="app-content">
    <main class="main-content">
        <h1>Pozdravljeni</h1>
        <h3>To je pregled po MeetPlan sistemu.</h3>
        <h3>MeetPlan je bil popolnoma prenovljen. Funkcije se še dodajajo. Dobrodošli v verzijo 2.0</h3>
        <b>Vaša dovoljenja: {decoded["role"]}</b>
        <hr />
        <Timetable />
    </main>
</AppContent>