<script lang="ts">
	import type { Expr } from "$lib/content/tools/mcheck/models";
	import { container } from "$lib/style";
    import CtlRender from ".";

    const {expr} : {expr : Expr | null} = $props()
</script>

{#if expr === null || expr.kind === "hole"}
    <div class={`${container} p-2`}>
        Syntax error
    </div>
{:else if expr.kind === "bool"}
    <div class={`${container} p-2 bg-white`}>
        {#if expr.value}
            always true
        {:else}
            always false
        {/if}
    </div>
{:else if expr.kind === "prop"}
    <div class={`${container} p-2 bg-white`}>
        Atomic proposition: {expr.value}
    </div>
{:else if expr.kind === "quant"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-pink-100`}>
        <div>
            {expr.form === "universal" ? "Universal" : "Existential"} quantifier
        </div>

        <CtlRender expr={expr.value}/>
    </div>
{:else if expr.kind === "logicalBiOp"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-blue-100`}>
        <CtlRender expr={expr.lhs}/>
        <div>
            {expr.form}
        </div>
        <CtlRender expr={expr.rhs}/>
    </div>
{:else if expr.kind === "logicalUnOp"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-blue-100`}>
        <div>
            {expr.form}
        </div>
        <CtlRender expr={expr.value}/>
    </div>
{:else if expr.kind === "temporalBiOp"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-amber-100`}>
        <CtlRender expr={expr.lhs}/>
        <div>
            {expr.form}
        </div>
        <CtlRender expr={expr.rhs}/>
    </div>
{:else if expr.kind === "temporalUnOp"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-amber-100`}>
        <div>
            {expr.form}
        </div>
        <CtlRender expr={expr.value}/>
    </div>
{/if}

