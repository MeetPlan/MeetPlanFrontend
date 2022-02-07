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
    import Drawer, {
        Content,
        Header,
        Title,
    } from '@smui/drawer';
    import List, { Item, Text, Graphic } from '@smui/list';
    import { navigate } from "svelte-routing";

    import jwt_decode, { JwtPayload } from "jwt-decode";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    const decoded = jwt_decode<JwtPayload>(token);

    let open: boolean = true;

    export let active: string;
</script>

    <!-- Don't include fixed={false} if this is a page wide drawer.
          It adds a style for absolute positioning. -->
    <Drawer variant="dismissible" fixed={true} bind:open>
        <Header>
            <Title>MeetPlan</Title>
        </Header>
        <Content>
            <List>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/')}
                        activated={active === 'pregled'}
                >
                    <Graphic class="material-icons" aria-hidden="true">home</Graphic>
                    <Text>Pregled</Text>
                </Item>
                <Item
                        href="javascript:void(0)"
                        on:click={() => navigate('/samotestiranje')}
                        activated={active === 'samotestiranje'}
                >
                    <Graphic class="material-icons" aria-hidden="true">coronavirus</Graphic>
                    <Text>Samotestiranje</Text>
                </Item>
                {#if decoded["role"] === "teacher" || decoded["role"] === "admin"}
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate('/new/meeting')}
                            activated={active === 'novosrecanje'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">add</Graphic>
                        <Text>Dodaj srečanje</Text>
                    </Item>
                {/if}
                {#if decoded["role"] === "teacher"}
                    <!--<Item
                            href="javascript:void(0)"
                            on:click={() => navigate('/mojrazred')}
                            activated={active === 'mojrazred'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">school</Graphic>
                        <Text>Moj razred</Text>
                    </Item>
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate('/mojipredmeti')}
                            activated={active === 'mojipredmeti'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">library_books</Graphic>
                        <Text>Moji predmeti</Text>
                    </Item>
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate('/redovalnica')}
                            activated={active === 'redovalnica'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">grading</Graphic>
                        <Text>Redovalnica</Text>
                    </Item>-->
                {/if}
                {#if decoded["role"] === "admin"}
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate('/users')}
                            activated={active === 'users'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">people</Graphic>
                        <Text>Vsi uporabniki</Text>
                    </Item>
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate('/classes')}
                            activated={active === 'classes'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">school</Graphic>
                        <Text>Vsi razredi</Text>
                    </Item>
                {/if}
            </List>
        </Content>
    </Drawer>

<style>
    /* These classes are only needed because the
      drawer is in a container on the page. */
    .drawer-container {
        position: relative;
        display: flex;
        overflow: hidden;
        z-index: 0;
    }

    * :global(.app-content) {
        flex: auto;
        overflow: auto;
        position: relative;
        flex-grow: 1;
    }

    .main-content {
        overflow: auto;
        padding: 16px;
        height: 100%;
        box-sizing: border-box;
    }
</style>