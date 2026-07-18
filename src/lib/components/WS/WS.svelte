<script lang="ts">
    let canvas : HTMLCanvasElement

    const cellSz = 10
    const img = [
        "X   X  XX",
        "X X X  X ",
        "XXXXX XX ",
    ]

    const height = img.length * cellSz
    const width  = img[0].length * cellSz

    $effect(() => {
        canvas.height = height
        canvas.width = width

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.globalCompositeOperation = "difference"

        ctx.fillStyle = "#000"

        for (let y = 0; y < img.length; y++) {
            for (let x = 0; x < img[0].length; x++) {
                if (img[y][x] === "X") ctx.fillRect(x * cellSz, y * cellSz, cellSz, cellSz)
            }
        }
    })
</script>


<canvas
    height= {height}
    width= {width}
    aria-label="Home"
    style="image-rendering: crisp-edges;"
    bind:this={canvas}
> </canvas>
