<script lang="ts">
    import Paper from "@smui/paper";
    import Textfield from "@smui/textfield";

    import Icon from '@smui/textfield/icon';
    import Button, {Label} from "@smui/button";
    import IconButton from "@smui/button";

    import { navigate, Link } from "svelte-navigator";

    import Snackbar, {Actions} from "@smui/snackbar";
    import type { SnackbarComponentDev } from '@smui/snackbar';
    import * as constants from "./constants";
    import Cookies from "js-cookie";

    async function login() {
        let fd = new FormData();
        fd.append("email", email);
        fd.append("pass", password);
        try {
            let r = await fetch(`${constants.baseurl}/user/login`, {body: fd, method: "POST"})
            let response = await r.json();
            if (response["success"] === true) {
                localStorage.setItem("role", response["data"]["role"]);
                localStorage.setItem("userId", response["data"]["user_id"]);
                localStorage.setItem("email", response["data"]["email"]);
                Cookies.set("key", response["data"]["token"], {sameSite: "strict"});
                navigate("/")
            } else {
                snackbarWithClose.open();
            }
        } catch (e) {
            console.log(e)
            snackbarWithClose.open();
        }
    }

    let url = localStorage.getItem("baseurl")

    let email = "";
    let password = "";

    let snackbarWithClose: SnackbarComponentDev;
</script>

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
    @media only screen and (max-width: 600px) {
        .center {
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            width: 80%;
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            text-align: center;
        }
    }
</style>

<main>
    <Snackbar bind:this={snackbarWithClose}>
        <Label>Login failed.</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
    </Snackbar>
    <div class="center">
        <Paper>
            <h1>Login</h1>
            <Textfield type="email" bind:value={email} label="Elektronska pošta">
                <Icon class="material-icons" slot="leadingIcon">alternate_email</Icon>
            </Textfield>
            <p />
            <Textfield on:keypress={(key) => {
                if (key.key === "Enter") {
                    login();
                }
            }} type="password" bind:value={password} label="Geslo">
                <Icon class="material-icons" slot="leadingIcon">password</Icon>
            </Textfield>
            <p />
            <Button on:click={async () => await login()} variant="raised">
                <Label>LOGIN</Label>
            </Button>
            <p />
            <Link to="/register">REGISTER</Link>
            <p/>
            {#if constants.isTauri}
                <Textfield on:change={() => {
                    setTimeout(() => {
                        localStorage.setItem("baseurl", url);
                        constants.baseurl = url;
                    }, 200)
                }} type="url" bind:value={url} label="Povezava do strežnika">
                    <Icon class="material-icons" slot="leadingIcon">link</Icon>
                </Textfield>
            {/if}
            {#if Cookies.get("key") !== "" && Cookies.get("key") !== undefined && Cookies.get("key") !== null}
                <Link to="/">POJDITE NEPOSREDNO V SISTEM</Link>
            {/if}
        </Paper>
    </div>
</main>
