<script lang="ts">
	import type { BaseBlogPost, } from "$lib/content/data";
	import { showTopText } from "$lib/state/showTopText";
	import type { Snippet } from "svelte";
	import BlogPostCell from "../BlogPostCell";

    let {children, synopsis, title, banner, leftS, rightS} : BaseBlogPost & {
        children : Snippet
        leftS?: number
        rightS?: number
    } = $props()

    let header : HTMLElement

    showTopText.set(false)
</script>
<div class="lg:grid grid-cols-3 gap-2 justify-stretch items-strech" style={`grid-template-columns: ${leftS||1}fr 2fr ${rightS||1}fr;`}>
    <div class="col-span-3">
        {@render banner(true)}
    </div>
    <BlogPostCell>
        <div class="pl-4">
            <h1 bind:this={header} class="pb-2 font-bold text-2xl"> {@render title()} </h1>
            <p class="pb-2"> {@render synopsis()} </p>
        </div>
    </BlogPostCell>

    {@render children()}
</div>

