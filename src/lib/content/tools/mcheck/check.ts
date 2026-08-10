import type { Expr, GraphData, Quant } from "./models";

const allSuccsIn = (s: string, set: Set<string>, g: GraphData): boolean => {
    for (const ndalt in g.edge[s]) {
        if (!set.has(ndalt))
            return false
    }
    return true
}
const anySuccsIn = (s: string, set: Set<string>, g: GraphData): boolean => {
    for (const ndalt in g.edge[s]) {
        if (!set.has(ndalt))
            return true
    }
    return false
}
const succsIn = (s: string, set: Set<string>, q: Quant, g: GraphData) => {
    switch (q) {
        case "existential":
            return anySuccsIn(s, set, g)
        case "universal":
            return allSuccsIn(s, set, g)
    }
}


// By default, treat this as being under an existential qunatifier
const checkState = (e: Expr, g: GraphData, all: Set<string>, quant: Quant): Expr => {
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
            const value = checkState(e.value, g, all, e.form)
            return {
                ...e,
                nset: value.nset,
                value
            }
        }
        case "temporalUnOp": {
            switch (e.form) {
                case "next": {
                    const value = checkState(e.value, g, all, quant)
                    if (value.nset === undefined) throw new Error("No nset")

                    const vals: Record<string, Set<string>> = {}
                    for (const x of value.nset) {
                        for (const k in g.rev_edge[x]) {
                            const arr = vals[k] ?? new Set()
                            arr.add(k)
                            vals[k] = arr
                        }
                    }
                    const nset = new Set<string>()
                    switch (quant) {
                        case "existential": {
                            for (const nd in vals) {
                                nset.add(nd)
                            }
                            break
                        }
                        case "universal": {
                            for (const nd in vals) {
                                if (allSuccsIn(nd, value.nset, g)) { nset.add(nd) }
                            }
                            break
                        }
                    }
                    return {
                        ...e,
                        value,
                        nset,
                    }
                }
                case "future": {
                    const value = checkState(e.value, g, all, quant)
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
                    frontier.push(...nset)
                    while (frontier.length) {
                        const v = frontier.pop()!
                        if (allSuccsIn(v, nset, g)) continue
                        if (!nset.has(v)) continue
                        nset.delete(v)
                        for (const i in g.rev_edge[v]) {
                            frontier.push(i)
                        }
                    }

                    return {
                        ...e,
                        value,
                        nset
                    }
                }

                case "generally": {
                    const value = checkState(e.value, g, all, quant)
                    if (value.nset === undefined) throw new Error("No nset")
                    const frontier: string[] = [...value.nset]
                    const nset = new Set(value.nset)
                    while (frontier.length) {
                        const v = frontier.pop()!
                        if (!nset.has(v)) continue
                        if (!succsIn(v, nset, quant, g)) {
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
        }
        case "temporalBiOp": {
            const lhs = checkState(e.lhs, g, all, quant)
            const rhs = checkState(e.rhs, g, all, quant)
            if (rhs.nset === undefined || lhs.nset === undefined) throw new Error("No nset")
            const frontier: string[] = [...rhs.nset]
            const nset = new Set<string>(...rhs.nset)
            const seen = new Set<string>()
            while (frontier.length) {
                const v = frontier.pop()!
                if (seen.has(v)) continue
                if (lhs.nset.has(v) || rhs.nset.has(v)) {
                    for (const i in g.rev_edge[v]) {
                        frontier.push(i)
                    }
                    nset.add(v)
                }
                seen.add(v)
            }
            frontier.push(...nset)
            if (quant === "universal")
                while (frontier.length) {
                    const v = frontier.pop()!
                    if (allSuccsIn(v, nset, g)) continue
                    if (!nset.has(v)) continue
                    nset.delete(v)
                    for (const i in g.rev_edge[v]) {
                        frontier.push(i)
                    }
                }

            return {
                ...e,
                lhs,
                rhs,
                nset
            }
        }
        case "logicalBiOp": {
            const lhs = checkState(e.lhs, g, all, quant)
            const rhs = checkState(e.rhs, g, all, quant)
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
            const value = checkState(e.value, g, all, quant)
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


