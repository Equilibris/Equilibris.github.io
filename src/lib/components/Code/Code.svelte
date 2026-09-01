<script lang="ts">
	import { container } from '$lib/components/Container/css';
    import { highlightCode, classHighlighter } from '@lezer/highlight';
    import { parser as jsParser } from '@lezer/javascript';
    import dedent from "dedent"

    let { 
        code: codep,
        lang = "ts",
        block,
        el = $bindable(null)
    } : {
        code : string,
        lang?: string,
        block?: boolean,
        el?: HTMLElement | null
    } = $props()

    const code = $derived(dedent(codep))

    const parsers: Record<string, { parse: (input: string) => import('@lezer/common').Tree }> = {
      ts: jsParser.configure({ dialect: 'ts' }),
      tsx: jsParser.configure({ dialect: 'ts jsx' }),
    };

    const escapeHtml = (str: string): string => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');


    const highlighted = $derived.by(() => {
        const parser = parsers[lang];

        const lineCount = code.split("\n").length + 1
        const lineOOM = Math.ceil(Math.log10(lineCount))

        let lid = 1
        const format = () => String(lid++).padStart(lineOOM, " ")

        let html = lineCount > 2 ? `<span class="lnum">${format()} </span>` : ""

        function emit(text: string, classes: string) {
            const escaped = escapeHtml(text);
            html += classes ? `<span class="${classes}">${escaped}</span>` : escaped;
        }


        function emitBreak() {
            html += `\n<span class="lnum">${format()} </span>`;
        }

        highlightCode(code, parser.parse(code), classHighlighter, emit, emitBreak);
        return html;
    })
</script>

{#if block}
    <pre bind:this={el} class={`${container} inline px-2 code-block whitespace-pre-wrap`} data-lang={lang}><code>{@html highlighted}</code></pre>
{:else}
    <span bind:this={el} class={`${container} px-2 inline code-block`} data-lang={lang}><code>{@html highlighted}</code></span>
{/if}

<style>
    .code-block :global(.tok-comment) { color: #9ca0b0; font-style: italic; } /* overlay0 */
    .code-block :global(.tok-keyword) { color: #8839ef; } /* mauve */
    .code-block :global(.tok-string) { color: #40a02b; } /* green */
    .code-block :global(.tok-number) { color: #fe640b; } /* peach */
    .code-block :global(.tok-bool) { color: #fe640b; } /* peach */
    .code-block :global(.tok-null) { color: #fe640b; } /* peach */
    .code-block :global(.tok-atom) { color: #fe640b; } /* peach */
    .code-block :global(.tok-variableName) { color: #4c4f69; } /* text */
    .code-block :global(.tok-propertyName) { color: #1e66f5; } /* blue */
    .code-block :global(.tok-typeName) { color: #df8e1d; } /* yellow */
    .code-block :global(.tok-className) { color: #df8e1d; } /* yellow */
    .code-block :global(.tok-function) { color: #1e66f5; } /* blue */
    .code-block :global(.tok-operator) { color: #04a5e5; } /* sky */
    .code-block :global(.tok-punctuation) { color: #6c6f85; } /* subtext0 */
    .code-block :global(.tok-meta) { color: #6c6f85; } /* subtext0 */
    .code-block :global(.tok-invalid) { color: #d20f39; text-decoration: underline wavy; } /* red */
    .code-block :global(.lnum) {
        user-select: none;
        color: #9ca0b0;
    }
</style>
