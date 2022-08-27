<script lang="ts">
    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import {baseurl} from "./constants";

    import Button, {Icon} from "@smui/button";
    import {navigate} from "svelte-navigator";
    import Cookies from "js-cookie";

    let newPassword = "";
    let oldPassword = "";

    function updatePassword() {
        let fd = new FormData()
        fd.append("password", newPassword);
        fd.append("oldPassword", oldPassword);
        fetch(`${baseurl}/user/get/password_change`,
            {headers: {"Authorization": "Bearer " + Cookies.get("key")}, body: fd, method: "PATCH"})
            .then((r) => {
                if (r.status === 200) {
                    navigate("/")
                }
            })
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
<Button on:click={() => updatePassword()}>
    <Icon class="material-icons">password</Icon>
    Spremeni geslo
</Button>
