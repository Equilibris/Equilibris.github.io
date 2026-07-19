<script lang="ts">
	import { showTopText } from "$lib/state/showTopText";
	import classNames from "classnames";
	import { BoxRenderer } from "../TopBar/BoxRenderer";
	import type { Snippet } from "svelte";

    const {children} : {children : Snippet} = $props()

    let prnt : HTMLDivElement
    let measue : HTMLDivElement
    let canvas : HTMLCanvasElement

    $effect(()=> {
        const boxRender = BoxRenderer.getForCanvas(canvas, prnt, measue, $showTopText)
        boxRender.start()
        return
    })
</script>

<div class={classNames("w-full relative z-[-1]", { ["h-[80vh]"] : $showTopText, ["h-0"]: !$showTopText })} bind:this={prnt}>
    <canvas class="absolute" style="image-rendering: crisp-edges;" bind:this={canvas}> </canvas>
</div>
<div bind:this={measue}>
    {@render children()}
</div>

