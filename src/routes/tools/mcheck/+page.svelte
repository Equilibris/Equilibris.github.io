<script lang="ts">
	import { container } from "$lib/style";
    import { parser, sToExpr } from "$lib/state/ctls"
	import { debounce } from "../../hooks/debounce.svelte";

    let editorContent = $state("A G F p")

    const dbc = $derived.by(debounce(() => editorContent, 300))
    const parse = $derived(sToExpr(dbc))

    $inspect(parse)
</script>

<div class="grid top-level-grid min-h-120 gap-2">
    <div class={`row-span-2 p-2 ${container}`}>
        Side menu
    </div>
    <div class={container}>
        {#await import("$lib/components/CTLEditor")}
            <div class="p-2">
                Loading editor
            </div>
        {:then {default : CTLEditor}}
            <CTLEditor bind:editorContent />
        {:catch e}
            {JSON.stringify(e)}
        {/await}
    </div>
    <div>
        hello
    </div>
</div>

<style>
    .top-level-grid {
        grid-template-columns: 1fr 2fr;
        grid-template-rows: auto 1fr;
    }
</style>

