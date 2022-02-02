<script>
	import { Router, Link, Route } from "svelte-routing";
	import Samotestiranje from "./Samotestiranje.svelte";
	import Home from "./Home.svelte";

	export let url = "";
</script>

<main>
	<Router url="{url}">
		<div>
			<Route path="/samotestiranje" component="{Samotestiranje}" />
			<Route path="/"><Home /></Route>
		</div>
	</Router>
</main>