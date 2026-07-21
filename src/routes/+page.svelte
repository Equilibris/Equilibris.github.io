<script lang="ts">
    import { resolve } from '$app/paths';
    import A from '$lib/components/A';
	import type { Project } from '$lib/content/projects';
    import { showTopText } from '$lib/state/showTopText';
    import { container } from "$lib/style"

    showTopText.set(true)

    const projects : Project[] = Object.values(import.meta.glob("./projects/*/+page.svelte", { eager : true }))
</script>

<div id="about-me" class="flex justify-center -mt-25 pt-25">
    <div class="flex flex-col lg:flex-row max-w-6xl gap-2">
        <div class="flex justify-center flex-col gap-2">
            <div class={`w-full ${container} overflow-hidden`}>
                <img src="harstad.jpg" alt="home" />
            </div>
            <div class="text-xs text-gray-500 text-right">
                Photo by <A href="https://unsplash.com/@gskjalmar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Geir Skjalmar</A> on <A href="https://unsplash.com/photos/a-large-body-of-water-with-snow-covered-mountains-in-the-background-jvPrC3n60u0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</A>
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <div class={`${container} p-4 flex flex-col gap-2`}>
                <p class="indent-[2ex]">
                    Hi great to meet you, I'm <span title="/ˈvɪljɑm s.ɔːɹɛnsən/">William Sørensen</span>!
                    I am a computer scientist specializing in programming language theory, compilers and systems programming.
                    I intend to start a <A href={resolve("/blog")}>blog</A> where I write tools and posts about my course!
                </p>

                <p class="indent-[2ex]">
                    As a bit of background,
                    I stem from <A href="https://www.openstreetmap.org/relation/407767#map=8/68.975/16.729">Harstad</A>,
                    a beautiful city of the north.
                    I later moved to Cambridge for uni where I still reside.
                </p>
                <p class="indent-[2ex]">
                    In my freetime I enjoy long distance biking,
                    rowing, and playing the timps (though not as often as I'd like to).
                </p>
            </div>
            <!-- <div class="flex flex-row items-end"> -->
            <!--     <a title="ACB Smith, CC BY-SA 4.0 &lt;https://creativecommons.org/licenses/by-sa/4.0&gt;, via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Gonville_%26_Caius_College_Crest_Monochrome.svg"> -->
            <!--         <img width="100" alt="Gonville &amp; Caius College Crest Monochrome" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Gonville_%26_Caius_College_Crest_Monochrome.svg/250px-Gonville_%26_Caius_College_Crest_Monochrome.svg.png"> -->
            <!--     </a> -->
            <!--     <div class="grayscale"> -->
            <!--         <img alt="Byvåpen" loading="lazy" height="20" src="https://www.harstad.kommune.no/images/18.3b84deaf195b24645314a7a1/1743682445663/byvapen.gif"> -->
            <!--     </div> -->
            <!-- </div> -->
        </div>
    </div>
</div>

<div class="flex justify-center py-8">
    <div class="max-w-6xl w-full flex flex-col gap-2">
        <div class={`${container} p-4`}>
            Over the years I have worked on a few different projects.
            Most of these are just silly proof of concepts,
            but some of them also larger, more developed projects.
        </div>
        <div class="flex flex-col gap-2">
            {#each projects as proj}
                <a class="min-h-40 flex gap-2" href={resolve(`/projects/${proj.slug}` as any)}>
                    <div class={`${container} w-40 aspect-square flex items-center justify-center`}>
                        {@render proj.icon()}
                    </div>
                    <div class="w-full py-2 flex flex-col justify-center gap-2">
                        <h2 class="font-bold">
                            <A href={resolve(`/projects/${proj.slug}` as any)}> {@render proj.title()} </A>
                        </h2>
                        <div class={`${container} w-full min-h-20 p-2`}>
                            {@render proj.synopsis()}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</div>
