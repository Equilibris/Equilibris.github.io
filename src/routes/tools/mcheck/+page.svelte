<script lang="ts">
	import { container } from "$lib/style";
    import { sToExpr } from "$lib/content/tools/mcheck/ctls"
	import { debounce } from "../../hooks/debounce.svelte";
	import { sToGraph } from "$lib/content/tools/mcheck/graph";

    let ctlStarContent = $state("A G F p")
    let graphContent = $state(`n1\nn2[p q]\nn1 n2`)

    const dbCtl = $derived.by(debounce(() => ctlStarContent, 300))
    const parseCtl = $derived(sToExpr(dbCtl))

    const dbGraph = $derived.by(debounce(() => graphContent, 300))
    const parseGraph = $derived(sToGraph(dbGraph))

    $inspect(parseCtl, parseGraph)
</script>

<div class="grid top-level-grid min-h-150 gap-2">
    <div class={`row-span-2 p-2 ${container}`}>
        Side menu
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
            <GraphView g={parseGraph} />
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

