<script lang="ts">
    import Drawer, {
        Content,
        Header,
        Title,
    } from '@smui/drawer';
    import List, { Item, Text, Graphic } from '@smui/list';
    import { navigate } from "svelte-routing";
    import IconButton from "@smui/icon-button";
    import Badge from '@smui-extra/badge';

    import jwt_decode, { JwtPayload } from "jwt-decode";

    import {baseurl} from "./constants";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    const decoded = jwt_decode<JwtPayload>(token);

    let hasClass = false;
    let unreadMessages;

    if (decoded["role"] === "teacher" || decoded["role"] === "admin") {
        fetch(`${baseurl}/user/check/has/class`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    if (json.data === "true" || json.data === true) {
                        hasClass = true;
                    }
                },
            );
    }

    fetch(`${baseurl}/user/get/unread_messages`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        .then((response) => response.json())
        .then((json) => {
                unreadMessages = json.data;
            },
        );

    let open: boolean = true;

    export let active: string;
    export let meetingActive: number = -1;
</script>

    <!-- Don't include fixed={false} if this is a page wide drawer.
          It adds a style for absolute positioning. -->
    <Drawer variant="dismissible" fixed={true} bind:open>
        <Header class="sameline">
            <Title style="display:inline-block;">MeetPlan</Title>
            <div style="display:inline-block; float:right;">
                <IconButton class="material-icons" aria-hidden="true" on:click={() => {
                    localStorage.clear()
                    navigate("/login")
                }}>logout</IconButton>
            </div>
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
                {#if meetingActive === -1}
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate('/samotestiranje')}
                            activated={active === 'samotestiranje'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">coronavirus</Graphic>
                        <Text>Samotestiranje</Text>
                    </Item>
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate('/communication/view')}
                            activated={active === "communication"}
                            style="position: relative;"
                    >
                        <Graphic class="material-icons" aria-hidden="true">chat</Graphic>
                        <Text>
                            Komunikacija
                            {#if unreadMessages && unreadMessages.length !== 0}
                                <Badge inset aria-label="new messages count" style="top: 20px; right: 20px;">{unreadMessages.length}</Badge>
                            {/if}
                        </Text>
                    </Item>
                    {#if decoded["role"] === "student"}
                        <Item
                                href="javascript:void(0)"
                                on:click={() => navigate('/my/grades')}
                                activated={active === 'myGrades'}
                        >
                            <Graphic class="material-icons" aria-hidden="true">grade</Graphic>
                            <Text>Moje ocene</Text>
                        </Item>
                    {/if}
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
                        <Item
                                href="javascript:void(0)"
                                on:click={() => navigate('/my/class')}
                                activated={active === 'myclass'}
                        >
                            <Graphic class="material-icons" aria-hidden="true">school</Graphic>
                            <Text>Moj razred</Text>
                        </Item>
                        <!--<Item
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
                                on:click={() => navigate('/subjects')}
                                activated={active === 'subjects'}
                        >
                            <Graphic class="material-icons" aria-hidden="true">subject</Graphic>
                            <Text>Vsi predmeti</Text>
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
                {/if}
                {#if meetingActive !== -1 && (decoded["role"] === "admin" || decoded["role"] === "teacher")}
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate(`/meeting/${meetingActive}`)}
                            activated={active === 'srecanje'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">meeting_room</Graphic>
                        <Text>Srečanje</Text>
                    </Item>
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate(`/meeting/${meetingActive}/absence`)}
                            activated={active === 'absenceManagement'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">school</Graphic>
                        <Text>Prisotnost</Text>
                    </Item>
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate(`/meeting/${meetingActive}/grading`)}
                            activated={active === 'grading'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">grade</Graphic>
                        <Text>Ocene</Text>
                    </Item>
                    <Item
                            href="javascript:void(0)"
                            on:click={() => navigate(`/meeting/${meetingActive}/homework`)}
                            activated={active === 'homework'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">assignment</Graphic>
                        <Text>Domača naloga</Text>
                    </Item>
                {/if}
            </List>
        </Content>
    </Drawer>

<style>
    .sameline {
        white-space: nowrap;
    }

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