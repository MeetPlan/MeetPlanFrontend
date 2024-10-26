<script lang="ts">
    import Paper from "@smui/paper";
    import Textfield from "@smui/textfield";

    import Icon from '@smui/textfield/icon';
    import Button, {Label} from "@smui/button";
    import IconButton from "@smui/button";

    import { navigate, Link } from "svelte-routing";

    import Snackbar, {Actions} from "@smui/snackbar";
    import * as constants from "./constants";

    async function login() {
        let fd = new FormData();
        fd.append("email", email);
        fd.append("pass", password);
        try {
            let r = await fetch(`${constants.baseurl}/user/login`, {body: fd, method: "POST", credentials: "include"})
            let response = await r.json();
            if (response["success"] === true) {
                localStorage.setItem("role", response["data"]["role"]);
                localStorage.setItem("userId", response["data"]["user_id"]);
                localStorage.setItem("email", response["data"]["email"]);
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

    let snackbarWithClose: Snackbar;
</script>

<main>
    <Snackbar bind:this={snackbarWithClose}>
        <Label>Prijava ni uspela.</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss">zapri</IconButton>
        </Actions>
    </Snackbar>
    <div class="center">
        <Paper>
            <h1>Prijava v MeetPlan</h1>
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
                <Label>PRIJAVA</Label>
            </Button>
            <p />
            <Link to="/src/Register">REGISTRACIJA</Link>
            <p/>
            {#if localStorage.getItem("role") !== "" && localStorage.getItem("role") !== null}
                <Link to="/">POJDITE NEPOSREDNO V SISTEM</Link>
            {/if}
        </Paper>
    </div>
</main>
