<script lang="ts">
	import type { Expr } from "$lib/content/tools/mcheck/models";
	import { container } from "$lib/style";
	import classNames from "classnames";
    import CtlRender from ".";

    let {expr, selected = $bindable(null) } : {expr : Expr | null, selected: Expr | null} = $props()

    let isSelected = $derived(expr?.sval === selected?.sval)
</script>

{#snippet select()}
    <button class={classNames("border p-1 rounded-sm outline-none", isSelected && "bg-black text-white")} onclick={()=> {
        if (isSelected) {
            selected = null
        } else {
            selected = expr
        }
    }}> {isSelected ? "Selected" : "Select"} {expr?.nset?.size} </button>
{/snippet}

{#if expr === null || expr.kind === "hole"}
    <div class={`${container} p-2 text-left`}>
        Syntax error
    </div>
{:else if expr.kind === "bool"}
    <div class={`${container} p-2 bg-white text-left`}>
        {#if expr.value}
            always true
        {:else}
            always false
        {/if}
        {@render select()}
    </div>
{:else if expr.kind === "prop"}
    <div class={`${container} p-2 bg-white text-left`}>
        Atomic proposition: {expr.value}
        {@render select()}
    </div>
{:else if expr.kind === "quant"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-pink-100 text-left`}>
        <div>
            {expr.form === "universal" ? "Universal" : "Existential"} quantifier
            {@render select()}
        </div>

        <CtlRender expr={expr.value} bind:selected={selected}/>
    </div>
{:else if expr.kind === "logicalBiOp"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-blue-100 text-left`}>
        <CtlRender expr={expr.lhs} bind:selected={selected}/>
        <div>
            {expr.form}
            {@render select()}
        </div>
        <CtlRender expr={expr.rhs} bind:selected={selected} />
    </div>
{:else if expr.kind === "logicalUnOp"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-blue-100 text-left`}>
        <div>
            {expr.form}
            {@render select()}
        </div>
        <CtlRender expr={expr.value} bind:selected={selected} />
    </div>
{:else if expr.kind === "temporalBiOp"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-amber-100 text-left`}>
        <CtlRender expr={expr.lhs} bind:selected={selected} />
        <div>
            {expr.form}
            {@render select()}
        </div>
        <CtlRender expr={expr.rhs} bind:selected={selected} />
    </div>
{:else if expr.kind === "temporalUnOp"}
    <div class={`${container} flex gap-2 flex-col p-2 bg-amber-100 text-left`}>
        <div>
            {expr.form}
            {@render select()}
        </div>
        <CtlRender expr={expr.value} bind:selected={selected} />
    </div>
{/if}

