<script lang="ts">
    import Drawer, {
        Content,
        Header,
        Title,
        Scrim,
    } from '@smui/drawer';
    import List, {Item, Text, Graphic, Subheader, Group, Meta, Separator} from '@smui/list';
    import { navigate } from "svelte-routing";
    import IconButton from "@smui/icon-button";
    import Badge from '@smui-extra/badge';



    import {baseurl} from "./constants";
    import Dialog, {Actions, Content as DialogContent, Title as DialogTitle} from "@smui/dialog";
    import Textfield from "@smui/textfield";
    import Button, {Icon, Label} from "@smui/button";
    import FormField from '@smui/form-field';
    import Select, {Option} from "@smui/select";

    import * as marked from 'marked';
    import isMobile from "is-mobile";
    import insane from "insane";

    import {useLocation} from "svelte-routing";
    import Checkbox from "@smui/checkbox";
    import Cookies from "js-cookie";
    import * as child_process from "child_process";


    const location = useLocation();

    let active = "";
    let meetingActive: string = undefined;
    let communicationActive: string = undefined;
    let communications = [];
    let communicationUnread = {};
    let unreadMessages;

    let allPaths = {};

    let lastUrl = "";
    let showDrawer = false;
    let hasRequested = false;

    $: (async () => {
        statusCallback(open);
        if (!($location.pathname === "/login" || $location.pathname === "/register")) {
            showDrawer = true;

            const token = Cookies.get("key");
            if (token === null || token === undefined) {
                navigate("/login");
            }

            let path = $location.pathname;

            if (path === lastUrl) {
                return
            }

            lastUrl = path;

            allPaths = {
                "/": "pregled",
                "/samotestiranje": "samotestiranje",
                "/meals": "meals",
                "/new/meeting": "novosrecanje",
                "/my/class": "myclass",
                "/users": "users",
                "/subjects": "subjects",
                "/classes": "classes",
                "/class/user/me": "studentme",
                "/proton/settings": "proton_settings",
                "/settings": "settings",
                "/documents": "documents",
                "/notifications": "notifications"
            }

            active = allPaths[path]
            console.log(active)
            if (active === undefined) {
                let pathSplit = path.split("/")
                if (pathSplit.length >= 3 && pathSplit[1] === "meeting") {
                    meetingActive = pathSplit[2];
                } else if (pathSplit.length === 3 && pathSplit[1] === "communication") {
                    communicationActive = pathSplit[2];
                }
            } else {
                console.log("resetting", $location.pathname)
                meetingActive = undefined
                communicationActive = undefined
            }

            if (meetingActive !== undefined) {
                allPaths[`/meeting/${meetingActive}`] = "srecanje"
                allPaths[`/meeting/${meetingActive}/absence`] = "absenceManagement"
                allPaths[`/meeting/${meetingActive}/grading`] = "grading"
                allPaths[`/meeting/${meetingActive}/homework`] = "homework"
            }
            if (communicationActive !== undefined) {
                allPaths[`/communication/${communicationActive}`] = `communication${communicationActive}`
            }
            for (let i in children) {
                const child = children[i];
                allPaths[`/class/user/${child.ID}`] = `student${child.ID}`
            }

            active = allPaths[path]

            console.log(allPaths)

            await fetchData();

            return
        }

        showDrawer = false;
        hasRequested = false;

        // Set a fake timeout to get the highest timeout id
        let highestTimeoutId = setTimeout(";");
        for (let i = 0 ; i <= highestTimeoutId ; i++) {
            clearTimeout(i);
        }
    })()

    async function getCommunications() {
        let response = await fetch(`${baseurl}/communications/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let json = await response.json()
        communications = json.data;
    }

    async function getUnread() {
        const token = Cookies.get("key");
        if (token === null || token === undefined) {
            return;
        }
        let response = await fetch(`${baseurl}/user/get/unread_messages`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let json = await response.json()
        unreadMessages = json.data;
        communicationUnread = {};
        for (let i in unreadMessages) {
            let message = unreadMessages[i];
            if (communicationUnread[message.CommunicationID]) {
                communicationUnread[message.CommunicationID] = communicationUnread[message.CommunicationID] + 1;
            } else {
                communicationUnread[message.CommunicationID] = 1;
            }
        }
    }

    let hasClass = false;
    let mealsBlocked = true;

    let improvementBody = "";
    let improvementDialog = false;
    let communicationDialogOpen = false;
    let studentId = 0;

    let selected = [];

    let teachers = [];
    let admins = [];
    let principal = [];
    let principalAssistant = [];
    let foodOrganizer = [];
    let schoolPsychologist = [];

    let newCommunicationTitle = "";

    let children = [];
    let users = [];
    let user = 0;

    const mobile = isMobile();
    export let open: boolean = !mobile;
    export let statusCallback;

    async function fetchData() {
        if (hasRequested) {
            return;
        }

        if (localStorage.getItem("role") === "teacher" || localStorage.getItem("role") === "admin") {
            let response = await fetch(`${baseurl}/user/check/has/class`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            let json = await response.json()
            if (json.data === "true" || json.data === true) {
                hasClass = true;
            }
        } else if (localStorage.getItem("role") === "parent") {
            let response = await fetch(`${baseurl}/parents/get/students`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            let json = await response.json()
            children = json.data;
        }

        let response = await fetch(`${baseurl}/meals/blocked`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let json = await response.json()
        mealsBlocked = json.data;

        if ((localStorage.getItem("role") === "teacher" || localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant") && meetingActive !== undefined) {
            let response = await fetch(`${baseurl}/meeting/get/${meetingActive}/users`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
            let json = await response.json()
            users = json.data;
        }

        await getCommunications();

        teachers = [];
        admins = [];
        schoolPsychologist = [];
        principal = [];
        principalAssistant = [];
        foodOrganizer = [];

        let response2 = await fetch(`${baseurl}/users/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let json2 = await response2.json()
        let us = json2.data;
        for (let i in us) {
            let user = us[i];
            if (user["Role"] === "admin" && !admins.includes(user)) {
                admins = [...admins, user];
            } else if (user["Role"] === "teacher" && !teachers.includes(user)) {
                teachers = [...teachers, user];
            } else if (user["Role"] === "school psychologist" && !schoolPsychologist.includes(user)) {
                schoolPsychologist = [...schoolPsychologist, user];
            } else if (user["Role"] === "principal" && !principal.includes(user)) {
                principal = [...principal, user];
            } else if (user["Role"] === "principal assistant" && !principalAssistant.includes(user)) {
                principalAssistant = [...principalAssistant, user];
            } else if (user["Role"] === "food organizer" && !foodOrganizer.includes(user)) {
                foodOrganizer = [...foodOrganizer, user];
            }
        }

        await getUnread();

        hasRequested = true;
    }

    setInterval(getUnread, 120000);
</script>

<Dialog
        bind:open={improvementDialog}
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
>
    <DialogTitle id="simple-title">
        Vpis učenca
    </DialogTitle>
    <DialogContent id="simple-content">
        <p/>
        <Select bind:value={user} variant="outlined" style="width: 100%;" label="Izberite učenca">
            <Option value="" on:click={() => user = -1}/>
            {#each users as c}
                <Option on:click={async () => {
                    user = c.ID;
                }} value={c.ID}>{c["Name"]}</Option>
            {/each}
        </Select>
        <p/>
        <FormField>
            <Textfield
                bind:value={improvementBody}
                style="width: 100%;"
                textarea
                label="Vpišite obvestilo. Podpira Markdown."
                input$rows={5}
                input$cols={48}
            />
        </FormField>
        {#if improvementBody !== ""}
            <p/>
            Predogled:
            {@html insane(marked.marked(improvementBody))}
        {/if}
    </DialogContent>
    <Actions>
        <Button on:click={() => {
            let fd = new FormData();
            fd.append("message", improvementBody);
            fetch(`${baseurl}/meeting/get/${meetingActive}/improvement/new/${user}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "POST", body: fd})
                .then((r) => r.json())
                .then((r) => {
                    improvementBody = "";
                });
        }}>
            <Label>
                POŠLJI
            </Label>
        </Button>
    </Actions>
</Dialog>

<Dialog
        bind:open={communicationDialogOpen}
        aria-labelledby="simple-title"
        aria-describedby="list-content"
>
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="simple-title">
        <FormField>
            <Textfield
                    bind:value={newCommunicationTitle}
                    style="width: 100%;"
            />
        </FormField>
    </Title>
    <Content id="list-content">
        <Group>
            <Subheader>Administratorji</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each admins as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Ravnatelji</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each principal as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Pomočniki ravnatelja</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each principalAssistant as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Šolski psihologi (svetovalni delavci)</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each schoolPsychologist as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Organizator šolske prehrane</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each foodOrganizer as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
            <Subheader>Učitelji</Subheader>
            <List checkList style="max-width: 600px; border-left: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));">
                {#each teachers as h}
                    <Item required>
                        <Label>{h.Name}</Label>
                        <Meta>
                            <Checkbox bind:group={selected} value={h.ID} />
                        </Meta>
                    </Item>
                {/each}
            </List>
        </Group>
    </Content>
    <Actions>
        <Button on:click={() => {
            let fd = new FormData();
            fd.append("users", JSON.stringify(selected));
            fd.append("title", newCommunicationTitle);
            fetch(`${baseurl}/communication/new`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "POST", body: fd}).then(getCommunications)
        }}>
            <Label>
                USTVARI
            </Label>
        </Button>
    </Actions>
</Dialog>

{#if showDrawer}
    <Drawer variant={mobile ? "modal" : "dismissible"} fixed={false} style="position: absolute; top: 0;" bind:open>
        <Header class="sameline">
            <Title style="display:inline-block;">MeetPlan</Title>
            <div style="display:inline-block; float:right;">
                <IconButton class="material-icons" aria-hidden="true" on:click={() => navigate("/settings/user")}>settings</IconButton>
                <IconButton class="material-icons" aria-hidden="true" on:click={() => {
                    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
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
                {#if meetingActive === undefined && communicationActive === undefined}
                    {#if localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant" || localStorage.getItem("role") === "teacher" || localStorage.getItem("role") === "student" || localStorage.getItem("role") === "school psychologist" || localStorage.getItem("role") === "food organizer"}
                        {#if localStorage.getItem("role") !== "food organizer"}
                            <Item
                                    href="javascript:void(0)"
                                    on:click={() => navigate('/samotestiranje')}
                                    activated={active === 'samotestiranje'}
                            >
                                <Graphic class="material-icons" aria-hidden="true">coronavirus</Graphic>
                                <Text>Samotestiranje</Text>
                            </Item>
                        {/if}
                        {#if !mealsBlocked}
                            <Item
                                    href="javascript:void(0)"
                                    on:click={() => navigate('/meals')}
                                    activated={active === 'meals'}
                            >
                                <Graphic class="material-icons" aria-hidden="true">lunch_dining</Graphic>
                                <Text>Prehrana</Text>
                            </Item>
                        {/if}
                    {/if}
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
                    {#if localStorage.getItem("role") === "student"}
                        <Item
                                href="javascript:void(0)"
                                on:click={() => navigate('/class/user/me')}
                                activated={active === 'studentme'}
                        >
                            <Graphic class="material-icons" aria-hidden="true">grade</Graphic>
                            <Text>Moj pregled</Text>
                        </Item>
                    {/if}
                    {#if localStorage.getItem("role") === "parent"}
                        {#each children as child}
                            <Item
                                    href="javascript:void(0)"
                                    on:click={() => navigate(`/class/user/${child.ID}`)}
                                    activated={active === `student${child.ID}`}
                            >
                                <Graphic class="material-icons" aria-hidden="true">account_circle</Graphic>
                                <Text>{child.Name}</Text>
                            </Item>
                        {/each}
                    {/if}
                    {#if localStorage.getItem("role") === "teacher" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant" || localStorage.getItem("role") === "admin"}
                        <Item
                                href="javascript:void(0)"
                                on:click={() => navigate('/new/meeting')}
                                activated={active === 'novosrecanje'}
                        >
                            <Graphic class="material-icons" aria-hidden="true">add</Graphic>
                            <Text>Dodaj srečanje</Text>
                        </Item>
                    {/if}
                    {#if localStorage.getItem("role") === "teacher"}
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
                    {#if localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant" || localStorage.getItem("role") === "school psychologist"}
                        {#if localStorage.getItem("role") !== "school psychologist"}
                            <Item
                                    href="javascript:void(0)"
                                    on:click={() => navigate('/users')}
                                    activated={active === 'users'}
                            >
                                <Graphic class="material-icons" aria-hidden="true">people</Graphic>
                                <Text>Vsi uporabniki</Text>
                            </Item>
                        {/if}
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
                        {#if localStorage.getItem("role") !== "school psychologist"}
                            <Item
                                    href="javascript:void(0)"
                                    on:click={() => navigate('/settings')}
                                    activated={active === 'settings'}
                            >
                                <Graphic class="material-icons" aria-hidden="true">settings</Graphic>
                                <Text>Nastavitve sistema</Text>
                            </Item>
                            <Item
                                    href="javascript:void(0)"
                                    on:click={() => navigate('/proton/settings')}
                                    activated={active === 'proton_settings'}
                            >
                                <Graphic class="material-icons" aria-hidden="true">hub</Graphic>
                                <Text>Nastavitve Proton modula</Text>
                            </Item>
                            <Item
                                    href="javascript:void(0)"
                                    on:click={() => navigate('/documents')}
                                    activated={active === 'documents'}
                            >
                                <Graphic class="material-icons" aria-hidden="true">description</Graphic>
                                <Text>Dokumenti</Text>
                            </Item>
                            <Item
                                    href="javascript:void(0)"
                                    on:click={() => navigate('/notifications')}
                                    activated={active === 'notifications'}
                            >
                                <Graphic class="material-icons" aria-hidden="true">info</Graphic>
                                <Text>Obvestila</Text>
                            </Item>
                        {/if}
                    {/if}
                {/if}
                {#if meetingActive !== undefined && (localStorage.getItem("role") === "admin" || localStorage.getItem("role") === "teacher" || localStorage.getItem("role") === "principal" || localStorage.getItem("role") === "principal assistant" || localStorage.getItem("role") === "school psychologist")}
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
                    <Item
                            href="javascript:void(0)"
                            on:click={() => improvementDialog = true}
                            activated={active === 'improvements'}
                    >
                        <Graphic class="material-icons" aria-hidden="true">feedback</Graphic>
                        <Text>Izboljšave (vpisi)</Text>
                    </Item>
                {/if}
                {#if communicationActive !== undefined}
                    <Item
                            href="javascript:void(0)"
                            on:click={() => window.location.href ='/communication/view'}
                            activated={active === "communicationview"}
                    >
                        <Graphic class="material-icons" aria-hidden="true">chat</Graphic>
                        <Text>
                            Komunikacija
                            {#if unreadMessages && unreadMessages.length !== 0}
                                <Badge inset aria-label="new messages count" style="top: 20px; right: 20px;">{unreadMessages.length}</Badge>
                            {/if}
                        </Text>
                    </Item>
                    <Separator />
                    <Item
                            href="javascript:void(0)"
                            on:click={() => communicationDialogOpen = true}
                    >
                        <Graphic class="material-icons" aria-hidden="true">add</Graphic>
                        <Text>Nov pogovor</Text>
                    </Item>
                    {#each communications as communication}
                        <Item
                                href="javascript:void(0)"
                                on:click={() => window.location.href = `/communication/${communication.ID}`}
                                activated={active === 'communication' + communication.ID}
                        >
                            <Graphic class="material-icons" aria-hidden="true">chat</Graphic>
                            <Text>
                                {communication.Title}
                                {#if communicationUnread[communication.ID]}
                                    <Badge inset aria-label="new messages count" style="top: 20px; right: 20px;">{communicationUnread[communication.ID]}</Badge>
                                {/if}
                            </Text>
                        </Item>
                    {/each}
                {/if}
            </List>
        </Content>
    </Drawer>
    {#if mobile}
        <Scrim fixed={false} />
    {/if}
{/if}
