
<script lang="ts">
	import classNames from "classnames";
import type { Snippet } from "svelte";

    const { children, ...rest }: {children : Snippet, class?: string} = $props()
</script>

<p class={classNames("indent-[2ex]", rest.class)}> {@render children()} </p>
