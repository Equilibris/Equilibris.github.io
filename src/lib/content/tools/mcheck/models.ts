import type { SyntaxNode } from "@lezer/common";

export type Quant = "existential" | "universal";
export type TemporalUnOp = "next" | "future" | "generally";
export type TemporalBiOp = "until";
export type LogicalBiOp = "iff" | "and" | "or" | "implies"
export type LogicalUnOp = "not"

interface ENode {
    stx: SyntaxNode
    nset?: Set<string>
    sval: string
}
interface BoolExpr extends ENode {
    kind: "bool"; value: boolean
}
interface PropExpr extends ENode {
    kind: "prop"; value: string
}
interface QuantExpr extends ENode {
    kind: "quant"; form: Quant; value: Expr
}
interface TempUnExpr extends ENode {
    kind: "temporalUnOp"; form: TemporalUnOp; value: Expr
}
interface TempBiExpr extends ENode {
    kind: "temporalBiOp"; form: TemporalBiOp; lhs: Expr; rhs: Expr
}
interface LogicalBiExpr extends ENode {
    kind: "logicalBiOp"; form: LogicalBiOp; lhs: Expr; rhs: Expr
}
interface LogicalUnExpr extends ENode {
    kind: "logicalUnOp"; form: LogicalUnOp; value: Expr
}
interface Hole extends ENode {
    kind: "hole"; more?: unknown
}

export type Expr = BoolExpr
    | PropExpr
    | QuantExpr
    | TempUnExpr
    | TempBiExpr
    | LogicalBiExpr
    | LogicalUnExpr
    | Hole

export type GraphData = {
    vtxs: Record<string, Set<string>>
    edge: Record<string, Record<string, string>>,
    rev_edge: Record<string, Record<string, string>>,
    errors: number[]
}

