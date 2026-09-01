<script lang="ts">
	import type { Snippet } from "svelte";

    const {
        children, left, right
    } : { children : Snippet; left?: Snippet; right?: Snippet} = $props()
</script>


{#if left} {@render left()} {:else} <div></div> {/if}
<div class="max-w-800 w-full h-full flex justify-between items-stretch flex-col gap-2">
    {@render children()}
</div>
{#if right} {@render right()} {:else} <div></div> {/if}
