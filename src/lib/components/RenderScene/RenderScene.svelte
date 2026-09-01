<script lang="ts" generics="TScene">
	import { createViewBundle } from "$lib/content/canvcom/bundle";
	import { completeScene } from "$lib/content/canvcom/completeScene";
	import { Stage, type SceneDescription, type Vector2 } from "@canvas-commons/core";
    import { type Driver, animationFrameDriver } from "./drivers"

    const {
        scene: desc, size, driver = animationFrameDriver
    }: {
        scene : SceneDescription<TScene>
        size: Vector2,
        driver?: Driver
    } = $props()

    const bundle = $derived(createViewBundle(size))
    const scene = $derived(completeScene<TScene>(desc, "", bundle))

    let el: HTMLDivElement

    $effect(() => {
        bundle.pbm.setup([scene])
        bundle.pbm.fps = 60
        // promise
        bundle.pbm.recalculate()
    })
    $effect(()=> {
        const st = new Stage()
        st.configure({ size })
        const end = driver(() => st.render(scene, null), bundle.pbm)

        el.appendChild(st.finalBuffer)

        return () => {
            end()
            el.removeChild(st.finalBuffer)
        }
    })
</script>

<div bind:this={el}>

</div>

