<script lang="ts">
    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import {baseurl} from "./constants";

    import Button, {Icon} from "@smui/button";
    import {navigate} from "svelte-routing";

    let newPassword = "";
    let oldPassword = "";

    async function updatePassword() {
        let fd = new FormData()
        fd.append("password", newPassword);
        fd.append("oldPassword", oldPassword);
        let response = await fetch(`${baseurl}/user/get/password_change`, {credentials: "include", body: fd, method: "PATCH"});
        if (response.status === 200) {
            navigate("/");
        }
    }
</script>

<h1>Geslo</h1>
<Textfield type="password" bind:value={oldPassword} label="Staro geslo">
    <Icon class="material-icons" slot="leadingIcon">password</Icon>
    <HelperText slot="helper">Vpišite staro geslo</HelperText>
</Textfield>
<Textfield type="password" bind:value={newPassword} label="Novo geslo">
    <Icon class="material-icons" slot="leadingIcon">password</Icon>
    <HelperText slot="helper">Vpišite novo geslo</HelperText>
</Textfield>
<Button on:click={async () => await updatePassword()}>
    <Icon class="material-icons">password</Icon>
    Spremeni geslo
</Button>
