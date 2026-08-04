import type { Expr, GraphData } from "./models";

// By default, treat this as being under an existential qunatifier
const checkState = (e: Expr, g: GraphData, all: Set<string>): Expr => {
    switch (e.kind) {
        case "bool": {
            if (e.value) {
                return { ...e, nset: all }
            } else {
                return { ...e, nset: new Set() }
            }
        }
        case "prop": {
            const v = []
            for (const vtx in g.vtxs) {
                const res = g.vtxs[vtx]
                if (res.has(e.value)) {
                    v.push(vtx)
                }
            }
            return {
                ...e,
                nset: new Set(v)
            }
        }
        case "quant": {
            if (e.form === "universal") {
                const v = checkState({
                    kind: "logicalUnOp", form: "not", value: e.value, stx: e.stx,
                }, g, all)
                if (v.nset === undefined) throw new Error("No nset")
                return {
                    ...e,
                    nset: all.difference(v.nset)
                }
            } else {
                return {
                    ...e,
                    value: checkState(e.value, g, all)
                }
            }
        }
        case "temporalUnOp": {
            switch (e.form) {
                case "next": {
                    const value = checkState(e.value, g, all)
                    if (value.nset === undefined) throw new Error("No nset")

                    const nset = new Set<string>()
                    for (const x of value.nset) {
                        for (const k in g.rev_edge[x]) {
                            nset.add(k)
                        }
                    }
                    return {
                        ...e,
                        value,
                        nset,
                    }
                }
                case "future": {
                    const value = checkState(e.value, g, all)
                    if (value.nset === undefined) throw new Error("No nset")
                    const frontier: string[] = [...value.nset]
                    const nset = new Set<string>()
                    while (frontier.length) {
                        const v = frontier.pop()!
                        if (nset.has(v)) continue
                        for (const i in g.rev_edge[v]) {
                            frontier.push(i)
                        }
                        nset.add(v)
                    }
                    return {
                        ...e,
                        value,
                        nset
                    }
                }

                case "generally":
                    const value = checkState(e.value, g, all)
                    if (value.nset === undefined) throw new Error("No nset")
                    const frontier: string[] = [...value.nset]
                    const nset = new Set(value.nset)
                    while (frontier.length) {
                        const v = frontier.pop()!
                        if (!nset.has(v)) continue
                        let hasCont = false
                        for (const next in g.edge[v]) {
                            if (nset.has(next)) {
                                hasCont = true
                                break
                            }
                        }
                        if (!hasCont) {
                            nset.delete(v)
                            for (const n in g.vtxs[v])
                                frontier.push(n)

                        }
                    }
                    return {
                        ...e,
                        value,
                        nset,
                    }
            }
        }
        case "temporalBiOp": {
            throw new Error("biop")
        }
        case "logicalBiOp": {
            const lhs = checkState(e.lhs, g, all)
            const rhs = checkState(e.rhs, g, all)
            if (lhs.nset === undefined || rhs.nset === undefined)
                throw new Error("NSet is not set on subexpr")

            let nset: Set<string>

            switch (e.form) {
                case "iff": {
                    nset = lhs.nset.intersection(rhs.nset).union(
                        all.difference(lhs.nset).intersection(all.difference(rhs.nset))
                    )
                    break
                }
                case "and": {
                    nset = lhs.nset.intersection(rhs.nset)
                    break
                }
                case "or": {
                    nset = lhs.nset.union(rhs.nset)
                    break
                }
                case "implies": {
                    nset = rhs.nset.union(all.difference(lhs.nset))
                    break
                }
            }

            return {
                ...e,
                lhs,
                rhs,
                nset
            }
        }
        case "logicalUnOp": {
            const value = checkState(e.value, g, all)
            if (!value.nset) throw new Error("NSet is not set on subexpr")
            return {
                ...e,
                value,
                nset: all.difference(value.nset)
            }
        }


        case "hole": {
            return e
        }
    }
}

export const check = (e: Expr, g: GraphData): Expr => {
    const all = new Set(Object.keys(g.vtxs))
    return checkState(e, g, all)
}


