<script lang="ts">
	import { container } from "$lib/style";
    import { sToExpr } from "$lib/content/tools/mcheck/ctls"
	import { debounce } from "../../hooks/debounce.svelte";
	import { sToGraph } from "$lib/content/tools/mcheck/graph";
	import { check } from "$lib/content/tools/mcheck/check";
	import CtlRender from "$lib/components/CtlRender";

    let ctlStarContent = $state("A G p")
    let graphContent = $state(`n1[p]\nn2[p]\nn3[p]\nn1 n1\nn2 n1\nn2 n3`)

    let deads = $state(new Set<string>())

    const dbCtl = $derived.by(debounce(() => ctlStarContent, 300))
    const parseCtl = $derived(sToExpr(dbCtl))

    const dbGraph = $derived.by(debounce(() => graphContent, 300))
    const parseGraph = $derived(sToGraph(dbGraph))

    const checked = $derived.by(()=> {
        try {
            if (!parseCtl) return null
            return check(parseCtl, parseGraph)
        } catch (e) {
            console.log(e)
            return null
        }
    })

    $inspect(checked?.nset, parseGraph)
</script>

<!-- TODO: Change this to be two flex flows  -->
<div class="grid top-level-grid min-h-150 gap-2">
    <div class={`row-span-2 p-2 ${container}`}>
        <CtlRender expr={parseCtl} />
    </div>
    <div class={container}>
        {#await Promise.all([import("$lib/components/CM"), import("$lib/content/tools/mcheck/ctlConfig")])}
            <div class={`${container} p-2`}>
                Loading editor
            </div>
        {:then [{default : CM}, { ext }]}
            <CM
                bind:doc={ctlStarContent}
                extensions={ext}
            />
        {:catch e}
            <div class={`${container} p-2`}>
                Something went wrong {JSON.stringify(e)}
            </div>
        {/await}
    </div>
    <div class={`${container} h-full w-full flex content-stretch items-stretch row-span-2`}>
        {#await import("$lib/components/GraphView")}
            <div class={`p-2`}>
                Loading graph view
            </div>
        {:then {default : GraphView}}
            <GraphView
                g={parseGraph}
                checked={checked?.nset || null}
                bind:deads={deads}
            />
        {:catch e}
            <div class={`p-2`}>
                Something went wrong {JSON.stringify(e)}
            </div>
        {/await}
    </div>
    <div class={container}>
        {#await Promise.all([import("$lib/components/CM"), import("$lib/content/tools/mcheck/graphConfig")])}
            <div class={`${container} p-2`}>
                Loading editor
            </div>
        {:then [{default : CM}, { ext }]}
            <CM
                bind:doc={graphContent}
                extensions={ext}
            />
        {:catch e}
            <div class={`${container} p-2`}>
                Something went wrong {JSON.stringify(e)}
            </div>
        {/await}
    </div>
</div>

<style>
    .top-level-grid {
        grid-template-columns: 1fr 2fr;
        grid-template-rows: auto 1fr auto;
    }
</style>

