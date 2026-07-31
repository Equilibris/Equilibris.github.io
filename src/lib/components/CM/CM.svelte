<script lang="ts">
    import type { EditorViewConfig } from "@codemirror/view"
    import { EditorView } from "codemirror"
    import { untrack } from "svelte";

    let {
        doc = $bindable(),
        extensions
    } : Omit<EditorViewConfig, "parent"> = $props()

    let ctlRoot : HTMLDivElement

    let editorRef = $state<EditorView | null>(null)

    $effect(() => {
        // TODO: add linter, and add syntax seperator
        editorRef = new EditorView({
            doc: untrack(() => doc),
            parent : ctlRoot,
            extensions : [
                extensions || [],
                EditorView.updateListener.of((update) => {
                    const s = update.state.doc.toString()
                    if (s != doc) doc = s
                }),
            ],
        })
    })

    $effect(() => {
        if (editorRef && doc != editorRef.state.doc.toString()) {
            editorRef.dispatch({
                changes: {
                    from : 0,
                    to : editorRef.state.doc.length,
                    insert : doc
                }
            })
        }
    })
</script>

<div class="h-full" bind:this={ctlRoot}></div>
