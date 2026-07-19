<script lang="ts">
	import { showTopText } from "$lib/state/showTopText";
	import classNames from "classnames";

    let prnt : HTMLDivElement
    let canvas : HTMLCanvasElement
    let showText = false

    const expRandomPow2 = (n : number, p : number) : number => {
        let szm = 1;
        for (let j = 0; j < n; j++) {
            if (Math.random() >= p) break;
            szm *= 2;
        }
        return szm
    }

    const nbase = [
            "                                    ",
            " XXXX            XXXX      XXXXXXXX ",
            " XXXX            XXXX      XXXXXXXX ",
            " XXXX            XXXX      XXXXXXXX ",
            " XXXX            XXXX      XXXXXXXX ",
            " XXXX    XXXX    XXXX      XXXX     ",
            " XXXX    XXXX    XXXX      XXXX     ",
            " XXXX    XXXX    XXXX      XXXX     ",
            " XXXX    XXXX    XXXX      XXXX     ",
            " XXXXXXXXXXXXXXXXXXXX  XXXXXXXX     ",
            " XXXXXXXXXXXXXXXXXXXX  XXXXXXXX     ",
            " XXXXXXXXXXXXXXXXXXXX  XXXXXXXX     ",
            " XXXXXXXXXXXXXXXXXXXX  XXXXXXXX     ",
            "                                    ",
            "       O                            ",
            " XXX X O XXX X X XXX XXX XX X X     ",
            " X X X OO X  XXX X X X X X  X X     ",
            " XXX XX O X  X X XX  XXX X  XXX     ",
            " X      O                     X     ",
            "                                    ",
            " XXX XXX X X XXX X X  XXX XX XX     ",
            " X   X X XXX X X X X  X X X  X      ",
            " XXX XXX XXX XXX X XX XX  X XX      ",
            "             X                      ",
            "O                                   ",
            "O XX X X  XX XXX XXX XXXXX  XX      ",
            "  X  X X  X O X  X X X X X  X       ",
            " XX  XXX XX O X  XX  X X X XX       ",
            "       X    O                       ",
            "                                    ",
        ]
    // WS
    // PLTHEORY
    // COMPILERs
    // SYSTEMS

    const nv  = nbase.map(x => Array(...x).map(x => x === "X"))
    const pad = nbase.map(x => Array(...x).map(x => x === "O"))
    {
        for (let x = 0; x < nv.length; x++) {
            for (let y = 0; y < nv[x].length; y++) {
                pad[x][y] ||= ((nv[x-1] || [])[y - 1] ||
                    (nv[x]   || [])[y - 1] ||
                    (nv[x+1] || [])[y - 1] ||
                    (nv[x-1] || [])[y] ||
                    // (nv[x]   || [])[y - 1] ||
                    (nv[x+1] || [])[y] ||
                    (nv[x-1] || [])[y + 1] ||
                    (nv[x]   || [])[y + 1] ||
                    (nv[x+1] || [])[y + 1] || false)
            }
        }
    }


    $effect(()=> {
        if (!canvas || !prnt) {
            console.log("no canvas or prnt", canvas, prnt)
            return
        }
        const psty = getComputedStyle(prnt)
        let ph = parseInt(psty.getPropertyValue("height"))
        let w = document.querySelector("html")?.scrollHeight || 0
        let h = document.querySelector("html")?.scrollWidth || 0

        canvas.height = h
        canvas.width = w

        const realestate = canvas.width * canvas.height

        const ctx = canvas.getContext("2d", { alpha: false })
        if (!prnt) return
        if (!ctx) return

        ctx.fillStyle = "#FFF"
        ctx.fillRect(0, 0, 10_000_000, 10_000_000)

        const rm = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

        const active : [boolean] = [true];

        const boxSz = 10
        const inset = 2
        const pbig = 0.1
        const frameChance = .5
        const cursorRand = 4

        const firstCnt = 8
        const drawFract = 0.004
        const rmDrawFract = 0.3

        const dstDown = 80
        const tDiv = 20 // 20 frames
        const frameRate = 30
        const frameVal = 1000/frameRate

        const textXOffset = 2
        const textYOffset = 2
        const nameSz = 1
        const nameBoxSize = boxSz * nameSz

        let firstFrame = true
        let mx = 0;
        let my = 0;
        let sx = 0;
        let sy = 0;
        let moved = false;
        let timeSinceMoved = 0
        let lastFrame = 2 * -frameVal
        let lastTopText = false
        let frameCnt = 0
        let drawCnt = rm ? (realestate / (boxSz * boxSz)) * rmDrawFract : (realestate / (boxSz * boxSz)) * drawFract

        const mm = (e : MouseEvent) => {
            moved = true;
            timeSinceMoved *= 0.9;
            mx = e.x;
            my = e.y;
        }
        const scroll = () => {
            timeSinceMoved *= 0.9;
            sx = window.pageXOffset;
            sy = window.pageYOffset;
        }
        window.addEventListener("mousemove", mm)
        window.addEventListener("scroll", scroll)

        const frameHandler = (fl : number) => {
            if (fl - lastFrame <= frameVal) {
                requestAnimationFrame(frameHandler)
                return
            }
            lastFrame = fl

            if (frameCnt % frameRate != 0) recomputeHeight()

            const mousex = mx + sx
            const mousey = my + sy

            if (!active[0]) return

            if (Math.random() <= frameChance) {
                const fs = ctx.fillStyle
                ctx.fillStyle = "#FFFFFF10"
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = fs
            }


            if (moved) {
                let szm = expRandomPow2(2, pbig);

                const dst = Math.min(((Math.max(mousey - ph, 0)) / dstDown), 1)

                const r = Math.min(cursorRand * (1 - dst), timeSinceMoved/10)

                const rx = (Math.random() - .5) * 2
                const ry = (Math.random() - .5) * 2

                const norm = Math.sqrt(rx * rx + ry * ry)

                const rv = r * Math.random()
                const rxt = rv * rx / norm
                const ryt = rv * ry / norm

                const x = Math.floor(-szm/2 + rxt + mousex / boxSz) * boxSz
                const y = Math.floor(-szm/2 + ryt + mousey / boxSz) * boxSz

                const fs = ctx.fillStyle
                ctx.fillStyle = "#000"
                if (Math.random() > (dst * timeSinceMoved / tDiv))
                    ctx.fillRect(x + inset, y + inset, boxSz * szm - 2 * inset, boxSz * szm - 2 * inset)
                ctx.fillStyle = fs
            }


            {
                for (let i = 0; i < (firstFrame ? firstCnt : 1) * drawCnt; i++) {
                    const x = Math.floor(Math.random() * canvas.width / boxSz) * boxSz
                    const y = Math.floor(Math.random() * canvas.height / boxSz) * boxSz

                    let szm = expRandomPow2(10, pbig);
                    const fs = ctx.strokeStyle
                    ctx.strokeStyle = `#DDD`

                    ctx.strokeRect(x + inset, y + inset, boxSz * szm - 2 * inset, boxSz * szm - 2 * inset)
                    ctx.strokeStyle = fs
                }

                firstFrame = false;
            }

            if($showTopText) {
                lastTopText = true

                for (let x = 0; x < nv.length; x++) {
                    for (let y = 0; y < nv[x].length; y++) {
                        const xp = (x + textXOffset) * nameBoxSize
                        const yp = (y + textYOffset) * nameBoxSize

                        const fs = ctx.fillStyle
                        if (nv[x][y]) {
                            ctx.fillStyle = "#000"
                            ctx.fillRect(yp, xp, nameBoxSize, nameBoxSize)
                        } else if (pad[x][y]) {
                            ctx.fillStyle = "#FFF"
                            ctx.fillRect(yp, xp, nameBoxSize, nameBoxSize)
                        }
                        ctx.fillStyle = fs
                    }
                }
            } else if (lastTopText) {
                recomputeHeight(true)
            }
            timeSinceMoved++;
            frameCnt++;
            if (!rm) requestAnimationFrame(frameHandler)
        }

        requestAnimationFrame(frameHandler)
        return () => {
            active[0] = false
            window.removeEventListener("mousemove", mm)
        }
    })
</script>

<div class={classNames("w-full relative z-[-1]", { ["h-[80vh]"] : $showTopText, ["h-0"]: !$showTopText })} bind:this={prnt}>
    <canvas class="absolute" style="image-rendering: crisp-edges;" bind:this={canvas}> </canvas>
</div>

