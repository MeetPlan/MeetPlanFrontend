<script lang="ts">
	import { Router, Route } from "svelte-routing";
	import Samotestiranje from "./Samotestiranje.svelte";
	import Home from "./Home.svelte";
	import Login from "./Login.svelte";
	import Register from "./register.svelte";
	import Users from "./Admin/Users.svelte";
	import Classes from "./Classes.svelte";
	import User from "./User.svelte";
	import Class from "./Class.svelte";
	import NewMeeting from "./NewMeeting.svelte";
	import Meeting from "./Meeting.svelte";
	import AbsenceManagement from "./AbsenceManagement.svelte";
	import Subjects from "./Subjects.svelte";
	import Subject from "./Subject.svelte";
	import SubjectGrades from "./SubjectGrades.svelte";
	import Homework from "./Homework.svelte";
	import MyGrades from "./MyGrades.svelte";
	import MyClass from "./MyClass.svelte";
	import ClassUser from "./ClassUser.svelte";
	import Communication from "./Communication.svelte";
	import Meals from "./Meals.svelte";
	import Settings from "./Settings.svelte";
	import Notifications from "./Notifications.svelte";
	import UserSettings from "./UserSettings.svelte";
	import ProtonSettings from "./ProtonSettings.svelte";
	import ErrorPage from "./ErrorPage.svelte";

	export let url = "";
</script>

<main>
	<Router url="{url}">
		<div>
			<Route path="/samotestiranje" component="{Samotestiranje}" />
			<Route path="/login" component="{Login}" />
			<Route path="/register" component="{Register}" />
			<Route path="/users" component="{Users}" />
			<Route path="/new/meeting" component="{NewMeeting}" />
			<!--<Route path="/my/grades" component="{MyGrades}" />-->
			<Route path="/my/class" component="{MyClass}" />
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
			<Route path="/subjects" component="{Subjects}" />
			<Route path="/meals" component="{Meals}" />
			<Route path="/classes" component="{Classes}" />
			<Route path="/settings" component="{Settings}" />
			<Route path="/notifications" component="{Notifications}" />
			<Route path="/settings/user" component="{UserSettings}" />
			<Route path="/proton/settings" component="{ProtonSettings}" />
			<Route path="/napaka" component="{ErrorPage}" />
			<Route path="/"><Home /></Route>
		</div>
	</Router>
</main>