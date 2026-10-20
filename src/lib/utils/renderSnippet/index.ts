import type { Snippet } from "svelte"
import RenderSnippet from "./RenderSnippet.svelte"
import { render } from "svelte/server"


export const renderSnippet = (snippet: Snippet) =>
    render(
        RenderSnippet,
        { props: { snippet } }
    )
