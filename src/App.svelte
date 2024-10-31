<script lang="ts">
	import {Router, Route, useLocation, navigate} from "svelte-routing";
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import Drawer from "./Drawer.svelte";
	import {AppContent} from "@smui/drawer";
	import isMobile from "is-mobile";
	import Button, {Icon, Label} from "@smui/button";
	import Samotestiranje from "./Samotestiranje.svelte";
	import Login from "./Login.svelte";
	import Register from "./Register.svelte";
	import Users from "./Admin/Users.svelte";
	import NewMeeting from "./NewMeeting.svelte";
	import MyClass from "./MyClass.svelte";
	import Communication from "./Communication.svelte";
	import User from "./User.svelte";
	import ClassUser from "./ClassUser.svelte";
	import SubjectGrades from "./SubjectGrades.svelte";
	import AbsenceManagement from "./AbsenceManagement.svelte";
	import Homework from "./Homework.svelte";
	import Meeting from "./Meeting.svelte";
	import Class from "./Class.svelte";
	import Subject from "./Subject.svelte";
	import Subjects from "./Subjects.svelte";
	import Meals from "./Meals.svelte";
	import Classes from "./Classes.svelte";
	import Settings from "./Settings.svelte";
	import Notifications from "./Notifications.svelte";
	import Documents from "./Documents.svelte";
	import UserSettings from "./UserSettings.svelte";
	import ProtonSettings from "./ProtonSettings.svelte";
	import ErrorPage from "./ErrorPage.svelte";
	import Home from "./Home.svelte";
	import IconButton from "@smui/icon-button";
	import {baseurl} from "./constants";
	import {drawerOpen, svelteLoc} from "./stores";
	import MeetingGradings from "./MeetingGradings.svelte";

	const mobile = isMobile();
	let open = !mobile;
</script>

<Router>
	<div class="flexy">
		{#if $svelteLoc !== "/login" && $svelteLoc !== "/register"}
			<div class="top-app-bar-container flexor">
				<TopAppBar variant="static" style="background-color: #6082B6;">
					<Row>
						<Section style="display: flex; flex-direction: row; align-items: center;">
							<IconButton style="margin: 0 0 0 0.5em;" class="material-icons" on:click={() => drawerOpen.update((open) => !open)}>{#if $drawerOpen}close{:else}menu{/if}</IconButton>
							<Title>MeetPlan</Title>
						</Section>
						<Section align="end" toolbar>
							<IconButton style="margin: 0;" class="material-icons" aria-hidden="true" on:click={() => navigate("/settings/user")}>settings</IconButton>
							<IconButton style="margin: 0;" class="material-icons" aria-hidden="true" on:click={async () => {
								localStorage.clear();
								// TODO
								await fetch(`${baseurl}/account/logout`, {method: "POST", credentials: "include"});
								navigate("/login");
							}}>
								<div style="margin: 0 0 0 0.1em;">logout</div>
							</IconButton>
						</Section>
					</Row>
				</TopAppBar>
			</div>
		{/if}

		<div class="drawer-container" id="router" style="width: 100vw; flex-grow: 1; height: 100%; overflow: auto !important;">
			<Drawer />
			<AppContent class="app-content">
				<main class="main-content">
					{#if isMobile() && !($svelteLoc === "/login" || $svelteLoc === "/register")}
						<Button on:click={() => open = !open}>
							<Icon class="material-icons">menu_open</Icon>
							{#if open}
								<Label>Zapri navigacijo</Label>
							{:else}
								<Label>Odpri navigacijo</Label>
							{/if}
						</Button>
					{/if}
					<div>
						<Route path="/samotestiranje">
							<Samotestiranje />
						</Route>
						<Route path="/login">
							<Login />
						</Route>
						<Route path="/register">
							<Register />
						</Route>
						<Route path="/users">
							<Users />
						</Route>
						<Route path="/new/meeting">
							<NewMeeting />
						</Route>
						<!--<Route path="/my/grades" component="{MyGrades}" />-->
						<Route path="/my/class">
							<MyClass />
						</Route>
						<Route path="/communication/:id" let:params >
							<Communication id="{params.id}" />
						</Route>
						<Route path="/user/:id" let:params >
							<User id="{params.id}" />
						</Route>
						<Route path="/class/user/:id" let:params >
							<ClassUser studentId="{params.id}" />
						</Route>
						<Route path="/edit/:id" let:params >
							<NewMeeting editId="{params.id}" />
						</Route>
						<Route path="/meeting/:id/gradings" let:params >
							<MeetingGradings meetingId="{params.id}" />
						</Route>
						<Route path="/meeting/:id/grades" let:params >
							<SubjectGrades meetingId="{params.id}" />
						</Route>
						<Route path="/meeting/:id/absence" let:params >
							<AbsenceManagement meetingId="{params.id}" />
						</Route>
						<Route path="/meeting/:id/homework" let:params >
							<Homework meetingId="{params.id}" />
						</Route>
						<Route path="/meeting/:id" let:params >
							<Meeting meetingId="{params.id}" />
						</Route>
						<Route path="/class/:id" let:params >
							<Class id="{params.id}" />
						</Route>
						<Route path="/subject/:id" let:params >
							<Subject id="{params.id}" />
						</Route>
						<Route path="/subjects">
							<Subjects />
						</Route>
						<Route path="/meals">
							<Meals />
						</Route>
						<Route path="/classes">
							<Classes />
						</Route>
						<Route path="/settings">
							<Settings />
						</Route>
						<Route path="/notifications">
							<Notifications />
						</Route>
						<Route path="/documents">
							<Documents />
						</Route>
						<Route path="/settings/user">
							<UserSettings />
						</Route>
						<Route path="/proton/settings">
							<ProtonSettings />
						</Route>
						<Route path="/napaka">
							<ErrorPage />
						</Route>
						<Route path="/">
							<Home />
						</Route>
					</div>
				</main>
			</AppContent>
		</div>
	</div>
</Router>
