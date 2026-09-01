<script lang="ts">
	import classNames from "classnames";
	import type { Snippet } from "svelte";
	import { container } from "./css";

    let { children, el = $bindable(), ...rest } : {
        children : Snippet
        class? : string
        ["no-pad"]?: boolean
        ["el"]?: HTMLDivElement | null
    } = $props()
</script>
<div class={classNames(
        container,
        rest["no-pad"] ? "" : "p-4",
        rest.class
    )}
    bind:this={el}
>
    {@render children()}
</div>
