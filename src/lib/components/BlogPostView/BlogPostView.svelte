<script lang="ts">
	import type { BlogPost } from "$lib/content/data";
	import { showTopText } from "$lib/state/showTopText";
	import type { Snippet } from "svelte";
	import BlogPostCell from "../BlogPostCell";

    let {synopsis, title, banner, leftS, rightS, content, publishDate} : BlogPost & {
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
        <div class="pl-4 mt-1">
            <h1 bind:this={header} class="pb-2 font-bold text-2xl"> {@render title()} </h1>
            <p class="-mt-2 mb-1 text-gray-500 font-light">{publishDate.toLocaleDateString()}</p>

            <p class="pb-2"> {@render synopsis()} </p>
        </div>
    </BlogPostCell>

    {@render content()}
</div>

