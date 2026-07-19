
<script lang="ts">
	import type { Snippet } from "svelte";

    interface Props {
        href : string
        children : Snippet
    }

    const { href, children } : Props  = $props()

</script>

<a class="underline hover:no-underline hover:text-white hover:bg-black" href={href}>{@render children()}</a>

