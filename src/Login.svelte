<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>

<svelte:head>
    <!-- Fonts -->
    <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
    />

    <!-- Material Typography -->
    <link
            rel="stylesheet"
            href="https://unpkg.com/@material/typography@13.0.0/dist/mdc.typography.css"
    />

    <!-- SMUI -->
    <link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />
</svelte:head>

<script lang="ts">
    import Paper from "@smui/paper";
    import "@smui/paper/bare.css";

    import Textfield from "@smui/textfield";
    import "@smui/textfield/bare.css";

    import Icon from '@smui/textfield/icon';
    import Button, {Label} from "@smui/button";
    import IconButton from "@smui/button";

    import Snackbar, {Actions, SnackbarComponentDev} from "@smui/snackbar";

    async function login() {
        let fd = new FormData();
        fd.append("email", email);
        fd.append("pass", password);
        try {
            let r = await fetch("http://127.0.0.1:8000/user/login", {body: fd, method: "POST"})
            let response = await r.json();
            if (response["Success"]) {

            } else {
                snackbarWithClose.open();
            }
        } catch (e) {
            snackbarWithClose.open();
        }
    }

    let email = "";
    let password = "";

    let snackbarWithClose: SnackbarComponentDev;
</script>


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
            <Textfield on:submit={async () => await login()} type="password" bind:value={password} label="Geslo">
                <Icon class="material-icons" slot="leadingIcon">password</Icon>
            </Textfield>
            <p />
            <Button on:click={async () => await login()} variant="raised">
                <Label>LOGIN</Label>
            </Button>
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