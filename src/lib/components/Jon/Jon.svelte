<script lang="ts">
	import classNames from "classnames";
    import type { Snippet } from "svelte";

    const { children, ...rest }: {children : Snippet, class?: string} = $props()
</script>

<span class="jonmark px-2 rounded-sm">Q<sup>Jon</sup>:{@render children()} </span>

<style>
    .jonmark {
        background: linear-gradient(60deg in hsl, #E8B0AF, #F5CFC2, #D1D5D4, #B3CEEB, #9EC9F3); }
</style>
