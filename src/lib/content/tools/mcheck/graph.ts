
export type Edge = {
    from: string
    to: string
    name?: string
}

export type GraphData = {
    vtxs: Record<string, string[]>
    edge: Edge[],
    errors: number[]
}

const vtxRx = /^(\w+)(\[(((\w+) \w+)?)\])?$/
const edgeRx = /^(\w+) (\w+)( .*)?$/

export const sToGraph = (s: string): GraphData => {
    const vtxs: Record<string, string[]> = {}
    const edge: Edge[] = []
    const errors: number[] = []
    const lines = s.split("\n")

    for (const i in lines) {
        const l = lines[i]

        let match: null | RegExpMatchArray = null

        if (match = l.match(vtxRx)) {
            const nm = match[1]
            const vals = match[3]?.split(" ") || []
            vtxs[nm] = vals
            continue
        } else if (match = l.match(edgeRx)) {
            edge.push({
                from: match[1],
                to: match[2],
                name: match[3]
            })
            continue
        } else {
            lines.push(i + 1)
        }
    }
    return { vtxs, edge, errors }
}

