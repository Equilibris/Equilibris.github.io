<script lang="ts">
    import { sToExpr } from "$lib/content/tools/mcheck/ctls"
	import { debounce } from "$lib/hooks/debounce.svelte";
	import { sToGraph } from "$lib/content/tools/mcheck/graph";
	import { check } from "$lib/content/tools/mcheck/check";
	import CtlRender from "$lib/components/CtlRender";
	import A from "$lib/components/A";
	import classNames from "classnames";
	import { showTopText } from "$lib/state/showTopText";
	import { deadCol, selCol, unselCol } from "$lib/content/tools/mcheck/colors";
	import { osc } from "$lib/hooks/osc.svelte";
	import type { Expr } from "$lib/content/tools/mcheck/models";
	import { untrack } from "svelte";
	import { examples } from "$lib/content/tools/mcheck/examples";
	import P from "$lib/components/P";
	import Container from "$lib/components/Container";

    showTopText.set(false)

    let ctlStarContent = $state(examples.coffee[0])
    let graphContent = $state(examples.coffee[1])

    let deads = $state(new Set<string>())

    const dbCtl = $derived.by(debounce(() => ctlStarContent, 300))
    const parseCtl = $derived(sToExpr(dbCtl))

    const dbGraph = $derived.by(debounce(() => graphContent, 300))
    const parseGraph = $derived(sToGraph(dbGraph))

    $effect(() => {
        const url = new URL(location.href)
        const q = url.searchParams.get("q")
        const g = url.searchParams.get("g")
        if (untrack(() => q !== dbCtl || g !== dbGraph)) {
            if (q) ctlStarContent = q
            if (g) graphContent = g
        }
    })

    $effect(() => {
        const url = new URL(location.href)
        if (url.searchParams.get("q") === dbCtl && url.searchParams.get("g") === dbGraph) return
        if (dbCtl !== examples.coffee[0]) url.searchParams.set("q", dbCtl)
        if (graphContent !== examples.coffee[1]) url.searchParams.set("g", dbGraph)
        history.replaceState(null, "", url)
    })

    const checked = $derived.by(()=> {
        try {
            if (!parseCtl) return null
            return check(parseCtl, parseGraph)
        } catch (e) {
            console.log(e)
            return null
        }
    })

    const nodes = $derived.by(() => {
        const vtxs = new Set()
        for (const v in parseGraph.vtxs) {vtxs.add(v)}
        return vtxs
    })

    let selected = $state<null | Expr>(null)

    const setToShow = $derived(
        (selected ? selected.nset : checked?.nset)
        || null
    )

    const spathOsc = osc(3000)

    $inspect(checked)
</script>

<div class="flex min-h-150 gap-2 flex-col lg:flex-row">
    <div class="flex flex-col items-stretch justify-between gap-2 flex-1">
        <div class="font-bold">
            Simple CTL* model checker
        </div>
        {#if deads.size}
            <Container class="row-span-2 text-left">
                Some nodes have no successor!
                This breaks the CTL* model checking algorithm.
                Please add edges to:

                <ul class="list-disc pl-6">
                    {#each deads as n}
                        <li>{n}</li>
                    {/each}
                </ul>
            </Container>
        {/if}
        <CtlRender expr={checked} bind:selected={selected} />
        <Container no-pad>
            {#await Promise.all([import("$lib/components/CM"), import("$lib/content/tools/mcheck/graphConfig")])}
                <div class="p-2">
                    Loading editor
                </div>
            {:then [{default : CM}, { ext }]}
                <CM
                    bind:doc={graphContent}
                    extensions={ext}
                />
            {:catch e}
                <div class="p-2">
                    Something went wrong {JSON.stringify(e)}
                </div>
            {/await}
        </Container>
        <div class="flex-1"></div>
    </div>
    <div class="flex flex-col items-stretch gap-2 flex-3">
        <Container no-pad>
            {#await Promise.all([import("$lib/components/CM"), import("$lib/content/tools/mcheck/ctlConfig")])}
                <div class="p-2">
                    Loading editor
                </div>
            {:then [{default : CM}, { ext }]}
                <CM
                    bind:doc={ctlStarContent}
                    extensions={ext}
                />
            {:catch e}
                <div class="p-2">
                    Something went wrong {JSON.stringify(e)}
                </div>
            {/await}
        </Container>
        <Container no-pad class="max-h-175 h-full w-full flex-col content-stretch items-stretch row-span-2">
            {#await import("$lib/components/GraphView")}
                <div class="p-2">
                    Loading graph view
                </div>
            {:then {default : GraphView}}
                <GraphView
                    g={parseGraph}
                    checked={setToShow}
                    bind:deads={deads}
                />
            {:catch e}
                <div class="p-2">
                    Something went wrong {JSON.stringify(e)}
                </div>
            {/await}
        </Container>
    </div>
</div>

<div class="p-2 flex items-center justify-center">
    <Container class="min-h-50 w-full max-w-200">
        <P>
            <A href="https://en.wikipedia.org/wiki/Computation_tree_logic">Computation tree logic</A> is a form of model checking
            detailed in the <A href="https://www.cl.cam.ac.uk/teaching/current/HLog+ModC/">Hoare Logic and Model Checking</A> course at Cambridge.
            It is first order logic extended with temporal and quantitative modalities.
        </P>
        <P>
            This calculator has two main components: model input and formula input.
            The formula input is the field that currently contains {ctlStarContent}.
            The model input is where the model (graph of states) is specified,
            currently specifying a model with nodes {[...nodes]}. 
            Notably the notation of start state has been removed,
            as the model checking algorithm given in lectures does not have this notion.
            If you want a node to act like a start node, I recommend calling it "start".
        </P>
        <div class="p-2"> </div>
        <P>
            Below is a syntax description of CTL*.
            Notably atomic propositions are always lowercase.
            Capitals are reserved for modalities.
        </P>
        {#snippet rawx(s: string, narrow?: boolean)}
            <raw class={classNames("bg-gray-200 rounded-xs px-1 inline-block text-center", !narrow && "w-40")}>{s}</raw>
        {/snippet}
        <ul class="list-disc pl-6">
            <p class="-translate-x-6"> FOL: </p>
            <li>{@render rawx("α -> β")} implication</li>
            <li>{@render rawx("α <-> β")} biimplication</li>
            <li>{@render rawx("α && β")} conjunction</li>
            <li>{@render rawx("α || β")} disjunction</li>
            <li>{@render rawx("!α")} negation</li>
            <li>{@render rawx("atp")} (lowercase) atomic proposition</li>
            <li>{@render rawx("true")} terminal</li>
            <li>{@render rawx("false")} initial</li>
            <p class="-translate-x-6"> Path quantifications: </p>
            <li>{@render rawx("A α")} quantify all paths</li>
            <li>{@render rawx("E α")} quantify any paths</li>
            <p class="-translate-x-6"> Temporal modalities </p>
            <li>{@render rawx("X α")} ne<span class="font-bold">x</span>t node</li>
            <li>{@render rawx("G α")} <span class="font-bold">G</span>tenerally, always</li>
            <li>{@render rawx("F α")} <span class="font-bold">F</span>uture, eventually</li>
            <li>{@render rawx("α U β")} <span class="font-bold">U</span>ntil, α holds generally until β holds</li>
        </ul>
        <div class="p-2"> </div>
        <P>
            The syntax of the model specification language is very simple:
            Specify nodes by their name,
            then what propositions they match in brackets .
            This
        </P>
        <ul class="list-disc pl-6">
            <li>{@render rawx("n[a1 a2 a3]")} Node with n satisfying a1 a2 a3</li>
            <li>{@render rawx("n1 n2 lab")} Edge from n1 to n2 labeled with lab</li>
        </ul>
        <div class="p-2"> </div>
        <P>
            The model view has a few different node modes.
            These signify different states a node can be in.
        </P>
        <ul class="list-disc pl-6">
            <li>
                <div class="inline-block h-6 w-6 translate-y-2 rounded-full" style={`background-color: ${selCol}`}></div>
                A node that is included in the curret checked set.
            </li>
            <li>
                <div class="inline-block h-6 w-6 translate-y-2 rounded-full" style={`background-color: ${unselCol}`}></div>
                A node that is not selected.
            </li>
            <li>
                <div class="inline-block h-6 w-6 translate-y-2 rounded-full border-2 transition duration-3000" style={`background-color: ${spathOsc() ? unselCol : selCol}`}></div>
                A node with a self-path.
                <A href="https://www.sigmajs.org/">Sigma.js</A> is a great library,
                but annoyingly it cant yet render self-paths.
            </li>
            <li>
                <div class="inline-block h-6 w-6 translate-y-2 rounded-full" style={`background-color: ${deadCol}`}></div>
                A node with no edges. This breaks the model checking algorithm. 
                If you see a node like this add an edge to it to make the checker function correctly.
            </li>
        </ul>
    </Container>
</div>


