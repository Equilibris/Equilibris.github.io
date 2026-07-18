<script lang="ts">
    let prnt : HTMLDivElement
    let canvas : HTMLCanvasElement

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
            "O XX X X  XX XXX XXX XXXXX  XX        ",
            "  X  X X  X O X  X X X X X  X         ",
            " XX  XXX XX O X  XX  X X X XX         ",
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
        const psty = getComputedStyle(prnt)
        const h = document.querySelector("html")?.scrollHeight || parseInt(psty.getPropertyValue("height")) 
        canvas.height = h
        canvas.width = parseInt(psty.getPropertyValue("width"))

        const realestate = canvas.width * canvas.height

        const ctx = canvas.getContext("2d", { alpha: true })
        const rm = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

        if (!ctx) return

        const active : [boolean] = [true];

        const boxSz = 10
        const inset = 2
        const pbig = 0.1
        const frameChance = .5
        const cursorRand = 4

        const firstCnt = 400
        const drawCnt = rm ? (realestate / (boxSz * boxSz)) * .3: (realestate / (boxSz * boxSz)) * 0.003

        let firstFrame = true

        let mousex = 0;
        let mousey = 0;
        let moved = false;
        let timeSinceMoved = 0

        const mm = (e : MouseEvent) => {
            moved = true;
            timeSinceMoved *= 0.9;
            mousex = e.x + window.pageXOffset;
            mousey = e.y + window.pageYOffset;
        }
        window.addEventListener("mousemove", mm)

        const frameHandler = (fl : number) => {
            if (!active[0]) return

            if (Math.random() <= frameChance) {
                const fs = ctx.fillStyle
                ctx.fillStyle = "#FFFFFF10"
                    ctx.fillRect(0,0,canvas.width,canvas.height)
                ctx.fillStyle = fs
            }


            if (moved) {
                let szm = expRandomPow2(2, pbig);

                const r = Math.min(cursorRand, timeSinceMoved/10)

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

            {
                const bx = 2
                const by = 2

                const nms = 1
                const bz = boxSz * nms

                for (let x = 0; x < nv.length; x++) {
                    for (let y = 0; y < nv[x].length; y++) {
                        const xp = (x + bx) * bz
                        const yp = (y + by) * bz

                        const fs = ctx.fillStyle
                        if (nv[x][y]) {
                            ctx.fillStyle = "#000"
                            ctx.fillRect(yp, xp, bz, bz)
                        } else if (pad[x][y]) {
                            ctx.fillStyle = "#FFF"
                            ctx.fillRect(yp, xp, bz, bz)
                        }
                        ctx.fillStyle = fs
                    }
                }
            }
            timeSinceMoved++;
            if (!rm) requestAnimationFrame(frameHandler)
        }

        requestAnimationFrame(frameHandler)
        return () => {
            active[0] = false
            window.removeEventListener("mousemove", mm)
        }
    })
</script>

<div class="h-[80vh] w-full relative z-[-1]" bind:this={prnt}>
    <canvas class="absolute" style="image-rendering: crisp-edges;" bind:this={canvas}> </canvas>
</div>

