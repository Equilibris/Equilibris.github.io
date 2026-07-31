import { parser } from "./ctls/gen.ctlstar"
import { LRLanguage, LanguageSupport, foldNodeProp } from "@codemirror/language";
import type { SyntaxNode } from "@lezer/common";
import { styleTags, tags as t } from "@lezer/highlight";

const ctlStarLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            styleTags({
                PathQuantifier: t.controlKeyword,
                TemporalUnaryOp: t.keyword,
                TemporalBinaryOp: t.keyword,
                Not: t.operator,
                And: t.operator,
                Or: t.operator,
                Implies: t.operator,
                Iff: t.operator,
                True: t.bool,
                False: t.bool,
                Prop: t.variableName,
                LineComment: t.lineComment,
                "( )": t.paren,
            }),
            foldNodeProp.add({
                ParenFormula: (tree) => ({ from: tree.from + 1, to: tree.to - 1 }),
            }),
        ],
    }),
    languageData: {
        closeBrackets: { brackets: ["("] },
    },
});

export const ctlStar = () =>
    new LanguageSupport(ctlStarLanguage);

type Quant = "existential" | "universal";
type TemporalUnOp = "next" | "future" | "generally";
type TemporalBiOp = "until";
type LogicalBiOp = "iff" | "and" | "or" | "implies"
type LogicalUnOp = "not"

type Expr =
    ({ kind: "bool"; value: boolean }
        | { kind: "prop"; value: string }
        | { kind: "quant"; form: Quant; value: Expr }
        | { kind: "temporalUnOp"; form: TemporalUnOp; value: Expr }
        | { kind: "temporalBiOp"; form: TemporalBiOp; lhs: Expr; rhs: Expr }
        | { kind: "logicalBiOp"; form: LogicalBiOp; lhs: Expr; rhs: Expr }
        | { kind: "logicalUnOp"; form: LogicalUnOp; value: Expr }
        | { kind: "ident"; value: string }
        | { kind: "hole"; content: string; more?: unknown }) & { stx: SyntaxNode }

const siblingsToExpr = (nd: SyntaxNode | null, s: string): Expr[] => {
    const out = []
    while (nd !== null) {
        out.push(nodeToExpr(nd, s))
        nd = nd.nextSibling
    }
    return out
}

const nodeToExpr = (stx: SyntaxNode, s: string): Expr => {
    const hv: Expr = { kind: "hole", stx: stx, content: s.slice(stx.from, stx.to), more: [stx.name] }
    switch (stx.name) {
        case "Atom":
        case "Program":
        case "Formula": {
            return stx.firstChild && nodeToExpr(stx.firstChild, s) || hv
        }
        case "ParenFormula": {
            return stx.firstChild?.nextSibling && nodeToExpr(stx.firstChild.nextSibling, s) || hv
        }

        case "QuantifiedFormula": {
            if (!stx.firstChild) return hv
            const children = siblingsToExpr(stx.firstChild, s)
            if (children[0]?.kind != "hole" || children[1]?.kind == "hole") return hv
            return {
                kind: "quant",
                form: s.slice(children[0].stx.from, children[0].stx.to) === "A" ? "universal" : "existential",
                value: children[1],
                stx
            }
        }
        case "UnaryTemporalFormula": {
            if (!stx.firstChild) return hv
            const children = siblingsToExpr(stx.firstChild, s)
            if (children[0]?.kind != "hole") {
                debugger
                return hv
            }
            let form: TemporalUnOp | null = null
            switch (s.slice(children[0].stx.from, children[0].stx.to)) {
                case "G": {
                    form = "generally"
                    break
                }
                case "F": {
                    form = "future"
                    break
                }
                case "X": {
                    form = "next"
                    break
                }
            }
            if (form === null) return hv

            return {
                kind: "temporalUnOp",
                form: form,
                value: children[1],
                stx
            }
        }
        case "BinaryTemporalFormula": {
            const children = siblingsToExpr(stx.firstChild, s)
            return {
                kind: "temporalBiOp",
                form: "until",
                lhs: children[0],
                rhs: children[2],
                stx
            }
        }
        case "UnaryLogFormula": {
            const children = siblingsToExpr(stx.firstChild, s)
            return {
                kind: "logicalUnOp",
                form: "not",
                value: children[1],
                stx
            }
        }
        case "BinaryLogFormula": {
            const children = siblingsToExpr(stx.firstChild, s)
            let form: null | LogicalBiOp = null
            console.log(children)
            if (children[1].kind !== "hole") return hv
            switch (children[1].content) {
                case "&&": { form = "and"; break }
                case "||": { form = "or"; break }
                case "->": { form = "implies"; break }
                case "<->": { form = "iff"; break }
            }

            if (form === null) return hv
            return {
                kind: "logicalBiOp",
                form,
                lhs: children[0],
                rhs: children[2],
                stx
            }
        }
        case "True": {
            return { kind: "bool", value: true, stx }
        }
        case "False": {
            return { kind: "bool", value: false, stx }
        }
        case "Prop": {
            return { kind: "prop", value: s.slice(stx.from, stx.to), stx }
        }
        default:
            return hv
    }
}

export const sToExpr = (s: string): Expr | null => {
    const p = parser.parse(s).topNode

    const stx = nodeToExpr(p, s)
    console.log(stx)
    if (!stx || stx.kind === "hole") return null
    return stx
}

export { parser } from "./ctls/gen.ctlstar"

