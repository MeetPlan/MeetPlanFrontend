<script lang="ts">
    import Error from "./Widgets/Error.svelte";

    let url = new URL(window.location.toString());
</script>

<Error error={url.searchParams.get("error")}/>
