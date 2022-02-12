<script>
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
			<Route path="/user/:id" let:params >
				<User id="{params.id}" />
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
			<Route path="/classes" component="{Classes}" />
			<Route path="/"><Home /></Route>
		</div>
	</Router>
</main>