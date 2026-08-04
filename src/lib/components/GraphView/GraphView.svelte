<script lang="ts">
    import Graph from "graphology";
    import ForceSupervisor from "graphology-layout-force/worker";
    import Sigma from "sigma";
    import type { GraphData } from "$lib/content/tools/mcheck/models"
    import EdgeCurveProgram from "@sigma/edge-curve";

    let space : HTMLElement

    let { g, checked } : { g : GraphData; checked : null | Set<string> } = $props()

    type VtxData = {
        x : number
        y : number
        size: number
        props: Set<string>
        label: string
        highlighted: boolean
        color?: string
    }
    type EdgeData = {
        type: string
        label: string
        size: number
    }
    const graph = new Graph<VtxData, EdgeData>({
        allowSelfLoops: true
    });

    const lpToS = (label : string, props: Set<string>): string => `${label} : ${[...props.keys()].join(" ")}`.trim()
    const randRange = () => (Math.random() - .5) * 20

    $effect(()=>{
        const layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted });
        layout.start();

        return () => {
            layout.kill()
        }
    })

    const selCol = "red"
    const unselCol = ""

    $effect(()=>{
        for (const nd of graph.nodes()) {
            if (!g.vtxs[nd]) graph.dropNode(nd)
        }
        for (const edge of graph.edges()) {
            const v : string | undefined = (g.edge[graph.source(edge)] ?? {})[graph.target(edge)]
            if (v === undefined) {
               graph.dropEdge(edge)
               continue
            }
            if (graph.getEdgeAttribute(edge, "label") !== v) {
                graph.setEdgeAttribute(edge, "label", v)
            }
        }
        for (const v in g.vtxs) {
            if (!graph.hasNode(v)) {
                const vp = v+"'"
                graph.addNode(v, {
                    props: g.vtxs[v],
                    x : randRange(),
                    y : randRange(),
                    size: 10,
                    label: lpToS(v, g.vtxs[v]),
                    highlighted : false,
                    color: unselCol
                })
                // graph.addNode(vp, {
                //     props: new Set(),
                //     x : randRange(),
                //     y : randRange(),
                //     size: 1,
                //     label: "",
                //     highlighted : false,
                //     color: unselCol
                // })
                // graph.addEdge(v, vp, {
                //     type:"curved",
                //     label : "",
                //     curvature: 1
                // })
                // graph.addEdge(vp, v, {
                //     type:"curved",
                //     label : "",
                //     curvature: 1
                // })
            }
            const lab = lpToS(v, g.vtxs[v])
            graph.setNodeAttribute(v, "props", g.vtxs[v])
            graph.setNodeAttribute(v, "label", lab)
        }
        // TODO: Change this to be a hashmap, of a hashmap, of strings
        for (const from in g.edge) {
            for (const to in g.edge[from]) {
                if (!graph.areDirectedNeighbors(from, to)) {
                    graph.addEdge(from, to, { label: g.edge[from][to], type: "arrow", size:4 })
                }
            }
        }
    })

    $effect(() => {
        if (!checked) return
        for (const i in g.vtxs) {
            graph.setNodeAttribute(i, "color", checked.has(i) ? selCol : unselCol)
        }
    })
    $effect(()=> {

        // Create the sigma
        const renderer = new Sigma(graph, space, {
            minCameraRatio: 0.5,
            maxCameraRatio: 2,
            labelDensity: 1,
            renderEdgeLabels: true,
            autoRescale: true,
            autoCenter : true,
            edgeProgramClasses: {
                curved : EdgeCurveProgram
            }
        });

        //
        // Drag'n'drop feature
        // ~~~~~~~~~~~~~~~~~~~
        //

        // State for drag'n'drop
        let draggedNode: string | null = null;
        let isDragging = false;

        // On mouse down on a node
        //  - we enable the drag mode
        //  - save in the dragged node in the state
        //  - highlight the node
        //  - disable the camera so its state is not updated
        renderer.on("downNode", (e) => {
            isDragging = true;
            draggedNode = e.node;
            graph.setNodeAttribute(draggedNode, "highlighted", true);
            if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
        });

        // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
        renderer.on("moveBody", ({ event }) => {
            if (!isDragging || !draggedNode) return;

            // Get new position of node
            const pos = renderer.viewportToGraph(event);

            graph.setNodeAttribute(draggedNode, "x", pos.x);
            graph.setNodeAttribute(draggedNode, "y", pos.y);

            // Prevent sigma to move camera:
            event.preventSigmaDefault();
            event.original.preventDefault();
            event.original.stopPropagation();
        });

        // On mouse up, we reset the dragging mode
        const handleUp = () => {
            if (draggedNode) {
                graph.removeNodeAttribute(draggedNode, "highlighted");
            }
            isDragging = false;
            draggedNode = null;
        };
        renderer.on("upNode", handleUp);
        renderer.on("upStage", handleUp);

        //
        // Create node (and edge) by click
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //

        // When clicking on the stage, we add a new node and connect it to the closest node
        // renderer.on("clickStage", ({ event }: { event: { x: number; y: number } }) => {
        //     // Sigma (ie. graph) and screen (viewport) coordinates are not the same.
        //     // So we need to translate the screen x & y coordinates to the graph one by calling the sigma helper `viewportToGraph`
        //     const coordForGraph = renderer.viewportToGraph({ x: event.x, y: event.y });

        //     // We create a new node
        //     const node = {
        //         ...coordForGraph,
        //         size: 10,
        //     };

        //     // Searching the two closest nodes to auto-create an edge to it
        //     const closestNodes = graph
        //         .nodes()
        //         .map((nodeId) => {
        //           const attrs = graph.getNodeAttributes(nodeId);
        //           const distance = Math.pow(node.x - attrs.x, 2) + Math.pow(node.y - attrs.y, 2);
        //           return { nodeId, distance };
        //         })
        //         .sort((a, b) => a.distance - b.distance)
        //         .slice(0, 2);

        //     // We register the new node into graphology instance
        //     const id = String(Math.random())
        //     graph.addNode(id, node);

        //     // We create the edges
        //     closestNodes.forEach((e) => graph.addEdge(id, e.nodeId));
        // });

        return () => {
            renderer.kill();
        }
    })
</script>

<div bind:this={space} class="w-full h-full"></div>

