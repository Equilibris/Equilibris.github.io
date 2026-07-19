
const expRandomPow2 = (n: number, p: number): number => {
    let szm = 1;
    for (let j = 0; j < n; j++) {
        if (Math.random() >= p) break;
        szm *= 2;
    }
    return szm
}
const attachedCanvs: [HTMLCanvasElement, BoxRenderer][] = []

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

const nv = nbase.map(x => Array(...x).map(x => x === "X"))
const pad = nbase.map(x => Array(...x).map(x => x === "O"))
{
    for (let x = 0; x < nv.length; x++) {
        for (let y = 0; y < nv[x].length; y++) {
            pad[x][y] ||= ((nv[x - 1] || [])[y - 1] ||
                (nv[x] || [])[y - 1] ||
                (nv[x + 1] || [])[y - 1] ||
                (nv[x - 1] || [])[y] ||
                // (nv[x]   || [])[y - 1] ||
                (nv[x + 1] || [])[y] ||
                (nv[x - 1] || [])[y + 1] ||
                (nv[x] || [])[y + 1] ||
                (nv[x + 1] || [])[y + 1] || false)
        }
    }
}

export class BoxRenderer {
    private readonly ctx: CanvasRenderingContext2D

    private readonly boxSz = 10
    private readonly inset = 2
    private readonly pbig = 0.1
    private readonly frameChance = .5
    private readonly cursorRand = 4

    private readonly firstCnt = 8
    private readonly drawFract = 0.004
    private readonly rmDrawFract = 0.3

    private readonly dstDown = 80
    private readonly tDiv = 20 // 20 frames
    private readonly frameRate = 30
    private readonly frameVal = 1000 / this.frameRate

    private readonly textXOffset = 2
    private readonly textYOffset = 2
    private readonly nameSz = 1
    private readonly nameBoxSize = this.boxSz * this.nameSz
    private readonly rm: boolean

    private w = 0
    private h = 0
    private ph = 0

    private firstFrame = true
    private mx = 0;
    private my = 0;
    private sx = 0;
    private sy = 0;
    private moved = false;
    private timeSinceMoved = 0
    private lastTopText = false
    private frameCnt = 0
    private lastFrame = 2 * -this.frameVal
    private drawCnt = 0
    private running = false

    static getForCanvas(
        canvas: HTMLCanvasElement,
        prnt: HTMLDivElement,
        measue: HTMLDivElement,
        showTopText: boolean
    ) {
        for (const [co, mapper] of attachedCanvs) {
            if (canvas === co) {
                mapper.showTopText = showTopText
                mapper.prnt = prnt
                mapper.measue = measue
                return mapper
            }
        }
        const mapper = new BoxRenderer(canvas, prnt, measue, showTopText)
        attachedCanvs.push([canvas, mapper])
        return mapper
    }


    constructor(
        private readonly canvas: HTMLCanvasElement,
        private prnt: HTMLDivElement,
        private measue: HTMLDivElement,
        public showTopText: boolean
    ) {
        const ctx = canvas.getContext("2d")

        if (!ctx) throw new Error("failed to get ctx")
        this.ctx = ctx

        this.rm = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

        this.updateConstants()
    }

    private recomputeHeight(force: boolean = false) {
        if (force) {
            this.canvas.height = 0
            this.canvas.width = 0
        }

        try {
            const psty = getComputedStyle(this.prnt)
            this.ph = parseInt(psty.getPropertyValue("height"))
        } catch (_) { }

        this.w = this.measue.scrollWidth - 1
        this.h = this.measue.scrollHeight - 1 + this.ph

        let changed = force;

        if (force || this.canvas.height != this.h) { this.canvas.height = this.h; changed = true; }
        if (force || this.canvas.width != this.w) { this.canvas.width = this.w; changed = true; }

        if (changed) {
            this.ctx.fillStyle = "#FFF"
            this.ctx.fillRect(0, 0, 10_000_000, 10_000_000)
        }
    }

    private updateConstants(force = false) {
        this.recomputeHeight(force)

        const realestate = this.canvas.width * this.canvas.height
        this.drawCnt = this.rm
            ? (realestate / (this.boxSz * this.boxSz)) * this.rmDrawFract
            : (realestate / (this.boxSz * this.boxSz)) * this.drawFract
    }

    public attachListener() {
        // TODO: might not work
        window.addEventListener("mousemove", this.mouseMove)
        window.addEventListener("scroll", this.scroll)

        return () => {
            window.removeEventListener("mousemove", this.mouseMove)
            window.removeEventListener("scroll", this.scroll)
        }
    }

    private mouseMove(e: MouseEvent) {
        this.moved = true;
        this.timeSinceMoved *= 0.9;
        this.mx = e.x;
        this.my = e.y;
    }
    private scroll() {
        this.timeSinceMoved *= 0.9;
        this.sx = window.pageXOffset;
        this.sy = window.pageYOffset;
    }

    private mouseTrail() {
        let szm = expRandomPow2(2, this.pbig);

        const mousex = this.mx + this.sx
        const mousey = this.my + this.sy

        const dst = Math.min(((Math.max(mousey - this.ph, 0)) / this.dstDown), 1)

        const r = Math.min(this.cursorRand * (1 - dst), this.timeSinceMoved / 10)

        const rx = (Math.random() - .5) * 2
        const ry = (Math.random() - .5) * 2

        const norm = Math.sqrt(rx * rx + ry * ry)

        const rv = r * Math.random()
        const rxt = rv * rx / norm
        const ryt = rv * ry / norm

        const x = Math.floor(-szm / 2 + rxt + mousex / this.boxSz) * this.boxSz
        const y = Math.floor(-szm / 2 + ryt + mousey / this.boxSz) * this.boxSz

        const fs = this.ctx.fillStyle
        this.ctx.fillStyle = "#000"
        if (Math.random() > (dst * this.timeSinceMoved / this.tDiv))
            this.ctx.fillRect(x + this.inset, y + this.inset, this.boxSz * szm - 2 * this.inset, this.boxSz * szm - 2 * this.inset)
        this.ctx.fillStyle = fs
    }

    private lighten() {
        if (Math.random() <= this.frameChance) {
            const fs = this.ctx.fillStyle
            this.ctx.fillStyle = "#FFFFFF10"
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.fillStyle = fs
        }
    }

    private drawBoxes() {
        for (let i = 0; i < (this.firstFrame ? this.firstCnt : 1) * this.drawCnt; i++) {
            const x = Math.floor(Math.random() * this.canvas.width / this.boxSz) * this.boxSz
            const y = Math.floor(Math.random() * this.canvas.height / this.boxSz) * this.boxSz

            let szm = expRandomPow2(10, this.pbig);
            const fs = this.ctx.strokeStyle
            this.ctx.strokeStyle = `#DDD`

            this.ctx.strokeRect(x + this.inset, y + this.inset, this.boxSz * szm - 2 * this.inset, this.boxSz * szm - 2 * this.inset)
            this.ctx.strokeStyle = fs
        }

        this.firstFrame = false;
    }

    private drawText() {
        if (this.showTopText) {
            this.lastTopText = true

            for (let x = 0; x < nv.length; x++) {
                for (let y = 0; y < nv[x].length; y++) {
                    const xp = (x + this.textXOffset) * this.nameBoxSize
                    const yp = (y + this.textYOffset) * this.nameBoxSize

                    const fs = this.ctx.fillStyle
                    if (nv[x][y]) {
                        this.ctx.fillStyle = "#000"
                        this.ctx.fillRect(yp, xp, this.nameBoxSize, this.nameBoxSize)
                    } else if (pad[x][y]) {
                        this.ctx.fillStyle = "#FFF"
                        this.ctx.fillRect(yp, xp, this.nameBoxSize, this.nameBoxSize)
                    }
                    this.ctx.fillStyle = fs
                }
            }
        } else if (this.lastTopText) {
            this.lastTopText = false;
            this.recomputeHeight(true)
        }
    }

    private requestFrame() {
        if (this.running) requestAnimationFrame(this.frameHandler.bind(this))
    }

    private frameHandler(fl: number) {
        if (fl - this.lastFrame <= this.frameVal) {
            this.requestFrame()
            return
        }
        this.lastFrame = fl

        // Every second recompute height
        if (this.frameCnt % this.frameRate != 0) this.recomputeHeight()

        if (this.moved) this.mouseTrail()
        this.lighten()
        this.drawBoxes()
        this.drawText()

        this.timeSinceMoved++;
        this.frameCnt++;
        if (!this.rm) this.requestFrame()
    }

    public start() {
        this.attachListener()
        if (!this.running) {
            this.running = true
            this.requestFrame()
        }
    }
}

