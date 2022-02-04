<script>
	import { Router, Route } from "svelte-routing";
	import Samotestiranje from "./Samotestiranje.svelte";
	import Home from "./Home.svelte";
	import Login from "./Login.svelte";

	export let url = "";
</script>

<main>
	<Router url="{url}">
		<div>
			<Route path="/samotestiranje" component="{Samotestiranje}" />
			<Route path="/login" component="{Login}" />
			<Route path="/"><Home /></Route>
		</div>
	</Router>
</main>