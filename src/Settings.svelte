<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import {baseurl} from "./constants";

    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';

    let schoolName = "";
    let postNumber = 1000;
    let city = "Ljubljana";
    let country = "Slovenija";
    let address = "";

    let parentViewGrades = false;
    let parentViewAbsences = false;
    let parentViewHomework = false;
    let parentViewGradings = false;

    function getConfiguration() {
        fetch(`${baseurl}/admin/config/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
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
        fetch(`${baseurl}/admin/config/get`,
            {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, body: fd, method: "PATCH"})
            .then((r) => r.json())
            .then((r) => getConfiguration())
    }

    getConfiguration();
</script>

<Drawer active="settings" />
<AppContent class="app-content">
    <main class="main-content">
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
    </main>
</AppContent>
