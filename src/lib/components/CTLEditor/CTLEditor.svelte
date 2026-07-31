<script lang="ts">
    import { EditorView, minimalSetup } from "codemirror"
    import { keymap } from "@codemirror/view"
	import { Prec } from "@codemirror/state";
	import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
	import { ctlStar } from "$lib/state/ctls";
	import { untrack } from "svelte";

    let { editorContent = $bindable() } : { editorContent : string } = $props()

    let ctlRoot : HTMLDivElement

    let editorRef = $state<EditorView | null>(null)

    $effect(() => {
        // TODO: add linter, and add syntax seperator
        editorRef = new EditorView({
            doc: untrack(()=> editorContent),
            parent : ctlRoot,
            extensions : [
                minimalSetup,
                EditorView.lineWrapping,
                ctlStar(),
                syntaxHighlighting(defaultHighlightStyle),
                Prec.highest(
                    keymap.of([
                        {
                            key: "Enter",
                            run: () => true
                        }
                    ])
                ),
                EditorView.updateListener.of((update) => {
                    const s = update.state.doc.toString()
                    if (s != editorContent) editorContent = s
                }),
            ],
        })
    })

    $effect(() => {
        if (editorRef && editorContent != editorRef.state.doc.toString()) {
            editorRef.dispatch({
                changes: {
                    from : 0,
                    to : editorRef.state.doc.length,
                    insert : editorContent
                }
            })
        }
    })
</script>

<div class="h-full" bind:this={ctlRoot}></div>
