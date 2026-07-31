import { EditorView, minimalSetup } from "codemirror"
import { keymap } from "@codemirror/view"
import { Prec } from "@codemirror/state";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { ctlStar } from "./ctls";

export const ext = [
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
]

