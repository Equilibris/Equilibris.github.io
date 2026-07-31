<script lang="ts">
	import { container } from "$lib/style";
    import Graph from "graphology";
	import forceLayout from "graphology-layout-force";
    import ForceSupervisor from "graphology-layout-force/worker";
    import Sigma from "sigma";
    import type { GraphData } from "$lib/content/tools/mcheck/graph"

    let space : HTMLElement

    let { g } : { g : GraphData } = $props()

    const graph = new Graph();

    $effect(()=>{
        const layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted });
        layout.start();

        return () => {
            layout.kill()
        }
    })

    const randRange = () => (Math.random() - .5) * 20

    $effect(()=>{
        for (const v in g.vtxs) {
            if (!graph.hasNode(v)) {
                graph.addNode(v, {props: g.vtxs[v], x : randRange(), y : randRange(), size:10})
            }
            if (graph.getNodeAttribute(v, "props") == g.vtxs[v]) {
                graph.setAttribute(v, g.vtxs[v])
            }
        }
        for (const nd of graph.nodes()) {
            if (!g.vtxs[nd]) graph.dropNode(nd)
        }
        // TODO: Change this to be a hashmap, of a hashmap, of strings
        for (const {from, to, name} of g.edge) {
            if (!graph.areDirectedNeighbors(from, to)) {
                console.log("adding edge", from, to)
                graph.addEdge(from, to, { name })
            }
        }
        for (const edge of graph.edges()) {
            console.log(edge)
        }

        // Create a sample graph
        // graph.addNode("n1", { x: 0, y: 0, size: 10, });
        // graph.addNode("n2", { x: -5, y: 5, size: 10, });
        // graph.addNode("n3", { x: 5, y: 5, size: 10, });
        // graph.addNode("n4", { x: 0, y: 10, size: 10, });
        // graph.addEdge("n1", "n2");
        // graph.addEdge("n2", "n4");
        // graph.addEdge("n4", "n3");
        // graph.addEdge("n3", "n1");
    })

    $effect(()=> {

        // Create the sigma
        const renderer = new Sigma(graph, space, { minCameraRatio: 0.5, maxCameraRatio: 2 });

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
            layout.stop()
            layout.kill()
        }
    })
</script>

<div bind:this={space} class="w-full h-full"></div>

