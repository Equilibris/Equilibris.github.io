<script lang="ts">
	import classNames from "classnames";
    import type { Snippet } from "svelte";

    const { children, ...rest }: {children : Snippet, class?: string} = $props()
</script>

<raw class={classNames("bg-black text-white px-1 rounded-sm", rest.class)}> {@render children()} </raw>
