<script lang="ts">
    import { resolve } from '$app/paths';
    import A from '$lib/components/A';
	import Container from '$lib/components/Container';
	import P from '$lib/components/P';
	import type { Project, BlogPost } from '$lib/content/data';
    import { showTopText } from '$lib/state/showTopText';

    showTopText.set(true)

    const projects : Project[] = Object.values(import.meta.glob("./projects/*/+page.svelte", { eager : true }))
    const blogs : BlogPost[] = Object.values(import.meta.glob("./blog/*/+page.svelte", { eager : true }))
</script>

<div id="about-me" class="flex justify-center -mt-25 pt-25">
    <div class="flex flex-col lg:flex-row max-w-6xl gap-2">
        <div class="flex justify-center flex-col gap-2">
            <Container class="w-full overflow-hidden">
                <img src="harstad.jpg" alt="home" />
            </Container>
            <div class="text-xs text-gray-500 text-right">
                Photo by <A href="https://unsplash.com/@gskjalmar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Geir Skjalmar</A> on <A href="https://unsplash.com/photos/a-large-body-of-water-with-snow-covered-mountains-in-the-background-jvPrC3n60u0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</A>
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <Container class="flex flex-col gap-2">
                <P>
                    Hi great to meet you, I'm <span title="/ˈvɪljɑm s.ɔːɹɛnsən/">William Sørensen</span>!
                    I am a computer scientist specializing in programming language theory, compilers and systems programming.
                    I intend to start a <A href={resolve("/#blog")}>blog</A> where I write tools and posts about my course!
                </P>

                <P>
                    As a bit of background,
                    I stem from <A href="https://www.openstreetmap.org/relation/407767#map=8/68.975/16.729">Harstad</A>,
                    a beautiful city of the north.
                    I later moved to Cambridge for uni where I still reside.
                </P>
                <P>
                    In my freetime I enjoy long distance biking,
                    rowing, and playing the timps (though not as often as I'd like to).
                </P>
            </Container>
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

<div id="blog" class= "flex justify-center py-4">
    <div class="max-w-6xl w-full flex flex-col gap-2">
        <Container>
            I am trying to write a silly little blog.
            To begin I explore the great lengths I have to go to for animation on the web!
        </Container>
        <div class="flex flex-col gap-2">
            {#each blogs as blog}
                <a class="flex gap-2 flex-col" href={resolve(`/blog/${blog.slug}` as any)}>
                    <h2 class="font-bold">
                        <A> {@render blog.title()} </A>
                    </h2>
                    <div class="flex items-center justify-center">
                        {@render blog.banner(false)}
                    </div>
                    {@render blog.synopsis()}
                </a>
            {/each}
        </div>
    </div>
</div>

<div class="flex justify-center py-4">
    <div class="max-w-6xl w-full flex flex-col gap-2">
        <Container>
            Over the years I have worked on a few different projects.
            Most of these are just silly proof of concepts,
            but some of them also larger, more developed projects.
        </Container>
        <div class="flex flex-col gap-2">
            {#each projects as proj}
                <a class="min-h-40 flex gap-2" href={resolve(`/projects/${proj.slug}` as any)}>
                    <Container no-pad class="w-40 aspect-square flex items-center justify-center">
                        {@render proj.icon()}
                    </Container>
                    <div class="w-full py-2 flex flex-col justify-center gap-2">
                        <h2 class="font-bold">
                            <A> {@render proj.title()} </A>
                        </h2>
                        <Container no-pad class="w-full min-h-20 p-2">
                            {@render proj.synopsis()}
                        </Container>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</div>
