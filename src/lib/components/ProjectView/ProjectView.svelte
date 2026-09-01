<script lang="ts">
	import type { BaseProject, } from "$lib/content/data";
	import { showTopText } from "$lib/state/showTopText";
	import type { Snippet } from "svelte";
	import P from "../P/P.svelte";
	import Container from "../Container";

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
        <Container no-pad class={`lg:hidden xl:block`}>
            {@render icon()}
        </Container>
    </div>
    <div class="max-w-200 w-full h-full">
        <div class="flex justify-between items-baseline">
            <div>
                <h1 bind:this={header} class="pl-4 pb-2 font-bold"> {@render title()} </h1>
            </div>
        </div>
        <Container class={`min-h-80 p-4`}>
            <Container no-pad class={`xl:hidden float-right ml-2 mb-2 -mt-2 -mr-2`}>
                {@render icon()}
            </Container>
            <P class="pb-2"> {@render synopsis()} </P>
            {@render children()}
        </Container>
    </div>
    <div></div>
</div>

