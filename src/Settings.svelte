<script lang="ts">
    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import {baseurl} from "./constants";

    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import List, {Item, Text} from "@smui/list";
    import {Icon} from "@smui/button";

    let schoolName = "";
    let postNumber = 1000;
    let city = "Ljubljana";
    let country = "Slovenija";
    let address = "";

    let parentViewGrades = false;
    let parentViewAbsences = false;
    let parentViewHomework = false;
    let parentViewGradings = false;

    let blockRegistrations = false;

    let blockMeals = false;
    let dates = [];
    let date = "";

    function getConfiguration() {
        fetch(`${baseurl}/admin/config/get`, {credentials: "include"})
            .then((response) => response.json())
            .then((json) => {
                    let config = json["data"];
                    schoolName = config["school_name"];
                    postNumber = config["school_post_code"];
                    city = config["school_city"];
                    address = config["school_address"];
                    country = config["school_country"];
                    parentViewGrades = config["parent_view_grades"];
                    parentViewHomework = config["parent_view_homework"];
                    parentViewAbsences = config["parent_view_absences"];
                    parentViewGradings = config["parent_view_gradings"];
                    blockRegistrations = config["block_registrations"];
                    blockMeals = config["block_meals"];
                    dates = config["school_free_days"];
                },
            );
    }

    function updateConfig() {
        let fd = new FormData()
        fd.append("school_name", schoolName);
        fd.append("school_post_code", postNumber.toString());
        fd.append("school_address", address);
        fd.append("school_country", country);
        fd.append("school_city", city);
        fd.append("parent_view_grades", parentViewGrades.toString());
        fd.append("parent_view_homework", parentViewHomework.toString());
        fd.append("parent_view_absences", parentViewAbsences.toString());
        fd.append("parent_view_gradings", parentViewGradings.toString());
        fd.append("block_registrations", blockRegistrations.toString());
        fd.append("block_meals", blockMeals.toString());
        fd.append("school_free_days", JSON.stringify(dates));
        fetch(`${baseurl}/admin/config/get`,
            {credentials: "include"})
            .then((r) => r.json())
            .then((r) => getConfiguration())
    }

    getConfiguration();
</script>

<h1>Sistem</h1>
<Textfield bind:value={schoolName} label="Uradno ime šole" required style="width: 100%;" helperLine$style="width: 100%;" on:change={() => updateConfig()}>
    <HelperText slot="helper">Vpišite uradno ime šole</HelperText>
</Textfield>
<Textfield bind:value={address} label="Naslov" required style="width: 100%;" helperLine$style="width: 100%;" on:change={() => updateConfig()}>
    <HelperText slot="helper">Vpišite naslov šole (primer - Zaloška cesta 1)</HelperText>
</Textfield>
<Textfield bind:value={postNumber} label="Poštna številka" required style="width: 100%;" helperLine$style="width: 100%;" on:change={() => updateConfig()} type="number">
    <HelperText slot="helper">Vpišite poštno številko</HelperText>
</Textfield>
<Textfield bind:value={city} label="Mesto" required style="width: 100%;" helperLine$style="width: 100%;" on:change={() => updateConfig()}>
    <HelperText slot="helper">Vpišite mesto</HelperText>
</Textfield>
<Textfield bind:value={country} label="Država" required style="width: 100%;" helperLine$style="width: 100%;" on:change={() => updateConfig()}>
    <HelperText slot="helper">Vpišite državo</HelperText>
</Textfield>
<h1>Starši</h1>
<FormField>
    <Switch bind:checked={parentViewHomework} on:SMUISwitch:change={() => updateConfig()} />
    Dovoli pregled nad učenčevimi domačimi nalogami
</FormField>
<br>
<FormField>
    <Switch bind:checked={parentViewAbsences} on:SMUISwitch:change={() => updateConfig()} />
    Dovoli pregled nad učenčevimi izostanki
</FormField>
<br>
<FormField>
    <Switch bind:checked={parentViewGrades} on:SMUISwitch:change={() => updateConfig()} />
    Dovoli pregled nad učenčevimi ocenami
</FormField>
<br>
<FormField>
    <Switch bind:checked={parentViewGradings} on:SMUISwitch:change={() => updateConfig()} />
    Dovoli pregled nad učenčevimi ocenjevanji znanj
</FormField>
<h1>Uporabniki</h1>
<FormField>
    <Switch bind:checked={blockRegistrations} on:SMUISwitch:change={() => updateConfig()} />
    Blokiraj registracije
</FormField>
<h1>Sistem</h1>
<FormField>
    <Switch bind:checked={blockMeals} on:SMUISwitch:change={() => updateConfig()} />
    Blokiraj prehrano/malice
</FormField>
<h2>Šole prosti dnevi</h2>
<List class="demo-list">
    {#each dates as date, i}
        <Item on:SMUI:action={() => {
            dates.splice(i, 1);
            updateConfig();
        }}><Text>{date}</Text></Item>
    {/each}
</List>
<Textfield type="date" bind:value={date} on:click={() => date = ""} on:change={() => {
    let d = new Date(date);
    if (d.getFullYear() < 2000) {
        return
    }
    dates = [...dates, date];
    updateConfig();
}} label="Datum">
    <Icon class="material-icons" slot="leadingIcon">event</Icon>
    <HelperText slot="helper">Izberite prosimo datum</HelperText>
</Textfield>
