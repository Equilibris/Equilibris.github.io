
import type { PlaybackManager } from "@canvas-commons/core"

export type Driver = (
    render: () => Promise<void>,
    playbackManager: PlaybackManager
) => () => void


export const animationFrameDriver: Driver = (render, pbm) => {
    let last = 0
    let live = true

    const anfr = async (tm: number) => {
        if (tm - last >= 1000 / pbm.fps - 3) {
            last = tm
            if (await pbm.progress()) {
                await pbm.seek(0)
            }
        }
        await render()
        if (live) requestAnimationFrame(anfr)
    }

    requestAnimationFrame(anfr)

    return () => {
        live = false
    }
}

export const scrollDriver = (
    nodes: [HTMLElement | null, number][],
    x: boolean = false
): Driver => {
    return (render, pbm) => {
        const lis = async () => {
            const displacement = x ? window.innerWidth / 2 : window.innerHeight / 2;

            let tot = 0
            for (const [node, sval] of nodes) {
                if (node === null) break
                const bb = node.getBoundingClientRect()
                const start = x ? bb.left : bb.top
                const end = x ? bb.right : bb.bottom
                const v = (displacement - start) / (end - start)
                if (v < 0) {
                    break
                } else if (v < 1) {
                    tot += sval * v
                    break
                } else {
                    tot += sval
                }
            }
            await pbm.seek(
                Math.floor(pbm.fps * tot)
            )
            await render()
        }
        document.addEventListener("scroll", lis)

        render()

        return () => {
            document.removeEventListener("scroll", lis)
        }
    }
}

