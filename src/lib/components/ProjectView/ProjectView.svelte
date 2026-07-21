<script lang="ts">
	import type { BaseProject, } from "$lib/content/projects";
	import { showTopText } from "$lib/state/showTopText";
	import { container } from "$lib/style";
	import type { Snippet } from "svelte";

    let {children, icon, synopsis, title} : BaseProject & {children : Snippet} = $props()

    let offset = $state(0)
    let header : HTMLElement
    $effect(() => {
        offset = header.clientHeight

        const el = () => {

        }
        window.addEventListener("resize", el)
    })

    showTopText.set(false)
</script>
<div class="grid grid-cols-1" style="grid-template-columns: 1fr auto 1fr;">
    <div class="lg:flex justify-end items-start px-2" style={`padding-top: ${offset}px;`}>
        <div class={`${container} lg:hidden xl:block`}>
            {@render icon()}
        </div>
    </div>
    <div class="max-w-200 w-full h-full">
        <div class="flex justify-between items-baseline">
            <div>
                <h1 bind:this={header} class="pl-4 pb-2 font-bold"> {@render title()} </h1>
            </div>
        </div>
        <div class={`min-h-80 p-4 ${container}`}>
            <div class={`${container} xl:hidden float-right ml-2 mb-2 -mt-2 -mr-2`}>
                {@render icon()}
            </div>
            <p class="indent-[2ex] pb-2"> {@render synopsis()} </p>
            {@render children()}
        </div>
    </div>
    <div></div>
</div>

