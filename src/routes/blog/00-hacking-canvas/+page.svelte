<script lang="ts" module>
	import A from "$lib/components/A";
	import BlogPostCell from "$lib/components/BlogPostCell";
	import Container from "$lib/components/Container";
	import BlogPostView from "$lib/components/BlogPostView/BlogPostView.svelte";
	import Code from "$lib/components/Code";
	import P from "$lib/components/P";
	import { showTopText } from "$lib/state/showTopText";
    import { makeScene2D, } from "@canvas-commons/2d"
	import { Vector2, } from "@canvas-commons/core";
	import RenderScene, { scrollDriver } from "$lib/components/RenderScene";
	import { baseScene, codeView, paralax } from "./canvs";
	import classNames from "classnames";

    showTopText.set(false)

    const scene = makeScene2D(baseScene)
    const size = new Vector2(800, 300)

    let fContent: null | HTMLDivElement = $state(null)
    let cContent: null | HTMLElement = $state(null)

    let selfScroll: null | HTMLDivElement = $state(null)

    export const slug = "00-hacking-canvas"

    export { title, synopsis, banner }
</script>

{#snippet cc()}
    <A href="https://canvascommons.io/">Canvas commons</A>
{/snippet}

{#snippet title()}
    {@render cc()} for web animation
{/snippet}
{#snippet synopsis()}
    Making procedural canvas a tool for websites.
{/snippet}

{#snippet banner(big : boolean)}
    <div class="flex justify-center items-center flex-col">
        <div class={
            classNames(
                "flex justify-center flex-col gap-2",
                big && "max-w-300",
                !big && "max-h-20",
            )
        }>
            <Container no-pad class="overflow-hidden">
                <img src="/cyls.webp" alt="" class="opacity-95">
            </Container>
            {#if big}
                <div class="text-xs text-gray-500 text-left w-full">
                    Photo by <A href="https://unsplash.com/@eternalzard?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Yue Ma</A> on <A href="https://unsplash.com/photos/a-large-group-of-white-round-objects-LZwCJwa978k?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</A>
                </div>
            {/if}
        </div>
    </div>
{/snippet}

<BlogPostView {title} {synopsis} {banner} rightS={.3}>
    <BlogPostCell>
        {#snippet left()}
            <div class="relative">
                <Container class="sticky top-22">
                    <RenderScene
                        scene={makeScene2D(codeView)}
                        size={new Vector2(400, 400)}
                        driver={scrollDriver([ [fContent, 2], [cContent, 2], ])}
                    />
                </Container>
            </div>
        {/snippet}
        <Container bind:el={fContent}>
            <P>
                <A href="https://motioncanvas.io/">Motion canvas</A>,
                along with its more modern fork
                {@render cc()},
                are powerful and delightful procedural animation tools.
                These tools (henceforth referred to as a procedural canvas) have been written to be used for AOT rendered animation.
                I have wanted to use them for live web animation something they are not designed for.
                This blog details how I hacked around with the internals to finally get it working.
            </P>
            <P>
                To set the stage,
                I tried opening the basic example from the <A href = "https://canvascommons.io/docs/quickstart">quickstart page</A>
                expecting the code to work when putting it into a website.
                This did in-fact not work.
                Taking a look at the types here I noticed that
                <Code code="makeScene2D()" />
                does not return a <Code code = "Scene"/>,
                rather it returns a <i>description</i> of a Scene.
            </P>
        </Container>
        <Code code={`
            const desc: DescriptionOf<Scene2D> = 
              makeScene2D(function* (view) {
                const myCircle = new Circle({
                  x: -300, width: 140, height: 140,
                  fill: '#e13238',
                });

                view.add(myCircle);

                yield* all(
                  myCircle.position.x(300, 1).to(-300, 1),
                  myCircle.fill('#e6a700', 1).to('#e13238', 1),
                );
            });
        `} block bind:el={cContent} />
        <Container>
            <P>
                To fix this some serious nonsense was needed.
                Firstly motion canvas is built on the concept of 'meta files'.
                I believe this is an idea from Unity that Aarthificial brought over when he started implementing motion canvas.
                In my implementation I simply do not concern myself with this.
                Further, despite canvas commons being split into multiple packages,
                you are in practice forced to add the vite plugin as well as core.
                For this reason and my stubbornness I decided to try to hack it together.
                I started by reading the content of the transformer on scenes.
                From here and a lot of whacking my head against the wall,
                I came up with the code you see to the left.
                With this done it is super easy to render a scene.
            </P>
        </Container>
        <RenderScene {scene} {size} />
        <Container>
            Following this work I thought it would be fun to have the ability to define scroll animations using motion canvas.
        </Container>

        <div bind:this={selfScroll} class="flex justify-center">
            <RenderScene
                scene={makeScene2D(paralax)}
                size={new Vector2(600, 400)}
                driver={scrollDriver([[selfScroll, 6]])}
            />
        </div>

        <Container>
            <P>
                This entire project mainly exists just to be silly,
                but if you ever want to replicate this sillyness yourself:
                it is all on my <A href="https://github.com/Equilibris/Equilibris.github.io/tree/main/src/lib/components/RenderScene">GitHub</A>.
            </P>
            <P>
                That is all for now,
                hopefully at some point I will actually write something that isnt this insanely silly...
            </P>
        </Container>
        <div class="h-50"></div>
    </BlogPostCell>
</BlogPostView>

