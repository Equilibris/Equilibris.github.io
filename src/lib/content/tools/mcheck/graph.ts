import type { GraphData } from "./models"

const vtxRx = /^(\w+)(\[(.*)\])?$/
const edgeRx = /^(\w+) (\w+)( .*)?$/

export const sToGraph = (s: string): GraphData => {
    const vtxs: Record<string, Set<string>> = {}
    const edge: Record<string, Record<string, string>> = {}
    const rev_edge: Record<string, Record<string, string>> = {}
    const errors: number[] = []
    const lines = s.split("\n")

    for (const i in lines) {
        const l = lines[i]

        let match: null | RegExpMatchArray = null

        if (match = l.match(vtxRx)) {
            const nm = match[1]
            const vals = new Set(match[3]?.split(" ") || [])
            vtxs[nm] = vals
            continue
        } else if (match = l.match(edgeRx)) {
            const from = match[1]
            const to = match[2]
            const name = match[3]
            edge[from] ??= {}
            edge[from][to] = name || ""

            rev_edge[to] ??= {}
            rev_edge[to][from] = name || ""
        } else {
            lines.push(i + 1)
        }
    }

    return { vtxs, edge, errors, rev_edge }
}

