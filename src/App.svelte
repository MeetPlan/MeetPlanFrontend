<script lang="ts">
	import {Router, Route, useLocation} from "svelte-routing";
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

	const mobile = isMobile();
	let open = !mobile;

	let pathname = window.location.pathname;
	const location = useLocation();

	$: () => {
		console.log($location);
		if ($location === undefined) return;
		pathname = $location.pathname;
	}
</script>

<div class="drawer-container">
	<Router>
		<Drawer open={open} statusCallback={(o) => open = o} />
		<AppContent class="app-content">
			<main class="main-content">
				{#if isMobile() && !(pathname === "/login" || pathname === "/register")}
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
					<Route path="/meeting/:id/grading" let:params >
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
	</Router>
</div>
