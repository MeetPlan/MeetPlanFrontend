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

	export let url = "";
</script>

<main>
	<Router url="{url}">
		<div>
			<Route path="/samotestiranje" component="{Samotestiranje}" />
			<Route path="/login" component="{Login}" />
			<Route path="/register" component="{Register}" />
			<Route path="/users" component="{Users}" />
			<Route path="/user/:id" let:params >
				<User id="{params.id}" />
			</Route>
			<Route path="/class/:id" let:params >
				<Class id="{params.id}" />
			</Route>
			<Route path="/classes" component="{Classes}" />
			<Route path="/"><Home /></Route>
		</div>
	</Router>
</main>