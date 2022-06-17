<script lang="ts">
    export let error: string;

    let open: boolean = false;
</script>

<style>
    div {
        text-align: center;
    }

    .basediv {
        padding: 70px 0;
    }
</style>

<div class="basediv">
    <span style="font: 200px/1.25 Google Sans,Helvetica Neue,sans-serif;">(^-^*)</span>
    <p/>
    <span style="font: 24px/32px Google Sans,Helvetica Neue,sans-serif;">🤯 Prišlo je do napake v sistemu.</span>
    <p/>
    <div on:click={() => open = !open}>
        {#if open}
            <span class="material-icons" style="font-size: 20px;">expand_more</span>
        {:else}
            <span class="material-icons" style="font-size: 20px;">navigate_next</span>
        {/if}
        <span style="font: 16px/24px Google Sans,Helvetica Neue,sans-serif;">Prosimo, pošljite razvijalcem tega sistema naslednjo napako.</span>
    </div>
    {#if open}
        <pre>
            {error}
        </pre>
    {/if}
</div>