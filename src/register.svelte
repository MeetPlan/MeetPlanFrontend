<script lang="ts">
    import Paper from "@smui/paper";
    import "@smui/paper/bare.css";

    import Textfield from "@smui/textfield";
    import "@smui/textfield/bare.css";

    import {baseurl} from "./constants";

    import Icon from '@smui/textfield/icon';
    import Button, {Label} from "@smui/button";
    import IconButton from "@smui/button";

    import { navigate, Link } from "svelte-routing";

    import Snackbar, {Actions, SnackbarComponentDev} from "@smui/snackbar";

    async function login() {
        let fd = new FormData();
        fd.append("email", email);
        fd.append("pass", password);
        fd.append("name", name);
        try {
            let r = await fetch(`${baseurl}/user/new`, {body: fd, method: "POST", headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            let response = await r.json();
            if (response["success"] === true) {
                navigate("/login")
            } else {
                snackbarWithClose.open();
            }
        } catch (e) {
            snackbarWithClose.open();
        }
    }

    let email = "";
    let password = "";
    let name = "";

    let snackbarWithClose: SnackbarComponentDev;
</script>


<main>
    <Snackbar bind:this={snackbarWithClose}>
        <Label>Registration failed.</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
    </Snackbar>
    <div class="center">
        <Paper>
            <h1>Login</h1>
            <Textfield type="text" bind:value={name} label="Ime in priimek">
                <Icon class="material-icons" slot="leadingIcon">person</Icon>
            </Textfield>
            <p />
            <Textfield type="email" bind:value={email} label="Elektronska pošta">
                <Icon class="material-icons" slot="leadingIcon">alternate_email</Icon>
            </Textfield>
            <p />
            <Textfield on:submit={async () => await login()} type="password" bind:value={password} label="Geslo">
                <Icon class="material-icons" slot="leadingIcon">password</Icon>
            </Textfield>
            <p />
            <Button on:click={async () => await login()} variant="raised">
                <Label>REGISTER</Label>
            </Button>
            <p />
            <Link to="/login">LOGIN</Link>
        </Paper>
    </div>
</main>

<style>
    .center {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 35%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        text-align: center;
    }
</style>