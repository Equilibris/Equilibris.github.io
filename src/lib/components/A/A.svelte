
<script lang="ts">
	import type { Snippet } from "svelte";

    interface Props {
        href?: string
        children : Snippet
        hintOnly?: boolean
    }

    const { href, hintOnly, children } : Props  = $props()
</script>

{#if hintOnly}
    <span class="underline hover:no-underline hover:text-white hover:bg-black">{@render children()}</span>
{:else}
    <a class="underline hover:no-underline hover:text-white hover:bg-black" href={href}>{@render children()}</a>
{/if}

