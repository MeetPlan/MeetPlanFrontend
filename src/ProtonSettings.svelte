<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import {baseurl} from "./constants";

    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import List, {Item, Meta, Separator, Text} from "@smui/list";
    import Button, {Icon, Label} from "@smui/button";
    import Autocomplete from "@smui-extra/autocomplete";
    import Checkbox from "@smui/checkbox";
    import Select, {Option} from "@smui/select";

    import {onMount} from "svelte";
    import Error from "./Widgets/Error.svelte";
    import {navigate} from "svelte-routing";

    let config = [];

    const moduleNames = [
        "Polni dnevi učitelja na šoli",
        "Ure učitelja na šoli",
        "Skupina predmetov",
        "Predmeti pred ali po pouku",
        "Predmeti z blok urami"
    ];

    const days = [
        {ID: 0, Name: "Ponedeljek"},
        {ID: 1, Name: "Torek"},
        {ID: 2, Name: "Sreda"},
        {ID: 3, Name: "Četrtek"},
        {ID: 4, Name: "Petek"},
    ];
    const hours = [
        {ID: 0, Name: "0."},
        {ID: 1, Name: "1."},
        {ID: 2, Name: "2."},
        {ID: 3, Name: "3."},
        {ID: 4, Name: "4."},
        {ID: 5, Name: "5."},
        {ID: 6, Name: "6."},
        {ID: 7, Name: "7."},
        {ID: 8, Name: "8."},
        {ID: 9, Name: "9."},
    ];

    let selectedDays = [];
    let selectedHours = [];
    let selectedSubjects = [];

    let teachers = [];
    let subjects = [];

    let teacherId: number = undefined;

    let settingName: string = undefined;

    async function getConfiguration() {
        let response = await fetch(`${baseurl}/proton/rules/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        let json = await response.json();
        config = json["data"]["rules"];
    }

    function newRule() {
        let fd = new FormData()
        let moduleId = -1;
        for (let i: number in moduleNames) {
            if (settingName === moduleNames[i]) {
                moduleId = i;
            }
        }
        if (moduleId === -1) {
            return
        }
        try {
            fd.append("teacherId", teacherId.toString());
        } catch (e) {}
        fd.append("days", JSON.stringify(selectedDays));
        fd.append("hours", JSON.stringify(selectedHours));
        fd.append("subjects", JSON.stringify(selectedSubjects));
        fd.append("protonRuleId", moduleId.toString());
        fetch(`${baseurl}/proton/rule/new`,
            {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, body: fd, method: "POST"})
            .then((r) => r.json())
            .then((r) => getConfiguration())
    }

    function deleteConfig(configId: number) {
        fetch(`${baseurl}/proton/rule/get/${configId}`,
            {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((r) => r.json())
            .then((r) => getConfiguration())
    }

    async function getTeachers() {
        let response = await fetch(`${baseurl}/teachers/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        let json = await response.json()
        teachers = json["data"];
    }

    async function getSubjects() {
        let response = await fetch(`${baseurl}/subjects/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        let json = await response.json()
        subjects = json["data"];
    }

    async function load() {
        await getTeachers();
        await getSubjects();
        await getConfiguration();
    }

    onMount(() => {
        window.onunhandledrejection = (e) => {
            window.location = `/napaka?error=${e.reason}`
        }
    })
</script>

<Drawer active="proton_settings" />
<AppContent class="app-content">
    {#await load()}
    {:then _}
        <main class="main-content">
            <h1>Nastavitve Proton modula</h1>
            <h2>Nastavitve modula za nadomeščanja in zaposlitve</h2>

            <h2>Nastavitve modula za ustvarjanje urnikov</h2>

            <h3>Novo pravilo</h3>
            Namig 💡: Istih pravil je lahko več.
            <Autocomplete options={moduleNames} style="width: 100%;" bind:value={settingName} label="Izberite ali vpišite ime pravila (modula)" />
            <p/>
            {#if settingName === moduleNames[0]}
                To pravilo se uporabi, kadar je učitelj cel dan na šoli.
                Če učitelj ni cel dan na šoli, se uporabi pravilo "Ure učitelja na šoli" za te dni, ko učitelj ni na šoli cel dan.
                Če je učitelj polno zaposlen samo in izključno na tej šoli (tj. na nobeni drugi šoli), se ne uporablja te funkcije, saj bo sistem to avtomatično predvidel.
                <h4>Dnevi</h4>
                <List checkList style="border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                    {#each days as h}
                        <Item required>
                            <Label>{h.Name}</Label>
                            <Meta>
                                <Checkbox bind:group={selectedDays} value={h.ID} />
                            </Meta>
                        </Item>
                    {/each}
                </List>
                <h4>Učitelj</h4>
                <Select bind:selected={teacherId} label="Izberite učitelja" variant="outlined" style="width: 100%;">
                    <Option value="" on:click={() => teacherId = undefined}/>
                    {#each teachers as c}
                        <Option on:click={() => teacherId = c.ID} value={c.ID}>{c["Name"]}</Option>
                    {/each}
                </Select>
            {/if}
            {#if settingName === moduleNames[1]}
                To pravilo se uporabi na dnevih, ko je učitelj le deloma na tej šoli.
                Če je učitelj polno zaposlen samo in izključno na tej šoli (tj. na nobeni drugi šoli), se ne uporablja te funkcije, saj bo sistem to avtomatično predvidel.
                <h4>Dnevi</h4>
                <List checkList style="border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                    {#each days as h}
                        <Item required>
                            <Label>{h.Name}</Label>
                            <Meta>
                                <Checkbox bind:group={selectedDays} value={h.ID} />
                            </Meta>
                        </Item>
                    {/each}
                </List>
                <h4>Ure na te dni</h4>
                <List checkList style="border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                    {#each hours as h}
                        <Item required>
                            <Label>{h.Name}</Label>
                            <Meta>
                                <Checkbox bind:group={selectedHours} value={h.ID} />
                            </Meta>
                        </Item>
                    {/each}
                </List>
                <h4>Učitelj</h4>
                <Select bind:selected={teacherId} variant="outlined" style="width: 100%;">
                    <Option value="" on:click={() => teacherId = undefined}/>
                    {#each teachers as c}
                        <Option on:click={() => teacherId = c.ID} value={c.ID}>{c["Name"]}</Option>
                    {/each}
                </Select>
            {/if}
            {#if settingName === moduleNames[2] || settingName === moduleNames[3] || settingName === moduleNames[4]}
                {#if settingName === moduleNames[2]}
                    To pravilo se uporabi, kadar so to heterogene, homogene oz. kakorkoli deljene skupine z različnimi učitelji, kjer pouk poteka isto uro.
                    Za vsako skupino se ustvari svoj predmet in se jih tako združi.
                {/if}
                {#if settingName === moduleNames[3]}
                    To pravilo se uporabi, kadar so to razni izbirni predmeti in pa dopolnilni/dodatni pouk, ki ne more biti sredi pouka.
                {/if}
                {#if settingName === moduleNames[4]}
                    To pravilo se uporabi, kadar so predmeti taki, da zahtevajo blok uro (primer - izbirni predmet sodobna priprava hrane naj bi bil blok ura zaradi priprav na kuhanje).
                {/if}
                <h4>Predmeti</h4>
                <List checkList style="border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                    {#each subjects as h}
                        <Item required>
                            <Label>{h.Name}</Label>
                            <Meta>
                                <Checkbox bind:group={selectedSubjects} value={h.ID} />
                            </Meta>
                        </Item>
                    {/each}
                </List>
            {/if}
            <p/>
            <Button on:click={() => newRule()} variant="raised">
                <Label>OK</Label>
            </Button>
            <p/>
            <hr>
            <p/>
            <h3>Pravila</h3>
            {#each config as c}
                <h4>{c.rule_name} - {moduleNames[c.rule_type]}</h4>
                <b>Definicije:</b>
                <br>
                {#each c.objects as o}
                    {#if o.type === "day"}
                        Dan: {days[o.object_id].Name}
                    {/if}
                    {#if o.type === "hour"}
                        Ura: {hours[o.object_id].Name}
                    {/if}
                    {#if o.type === "subject"}
                        {#each subjects as s}
                            {#if s.ID === o.object_id}
                                Predmet: {s.Name}
                            {/if}
                        {/each}
                    {/if}
                    {#if o.type === "teacher"}
                        {#each teachers as s}
                            {#if s.ID === o.object_id}
                                Učitelj: {s.Name}
                            {/if}
                        {/each}
                    {/if}
                    <br>
                {/each}
            {/each}
            <p/>
        </main>
    {:catch error}
            <Error error={error} />
    {/await}
</AppContent>