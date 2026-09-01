import { all, Color, waitFor, type ThreadGeneratorFactory } from "@canvas-commons/core";
import { type View2D, Circle, Rect, Code, LezerHighlighter, Txt } from "@canvas-commons/2d";
import { parser } from "@lezer/javascript"
import dedent from "dedent"
import { catppuccinLatteHighlightStyle, catppuccinLattePalette } from "$lib/components/RenderScene";

export function* baseScene(view: View2D) {
    const c2 =
        new Circle({
            x: -100,
            y: 0,
            width: 100,
            height: 100,
            fill: "#AAF"
        })
    const myCircle = new Circle({
        // try changing these properties:
        x: -100,
        width: 140,
        height: 140,
        fill: '#e13238',
        children: [c2]
    });

    view.add(myCircle);

    yield* all(
        myCircle.position.x(100, 1).to(-100, 1),
        c2.position.x(100, 1).to(-100, 1),
        myCircle.fill('#e6a700', 1).to('#e13238', 1),
    );
}

const highlighter = new LezerHighlighter(parser, catppuccinLatteHighlightStyle)

export function* codeView(view: View2D) {
    const start = dedent(`
        const fsd: FullSceneDescription<T> = {
            ...desc,
            name,
            size: bundle.size,
            variables: undefined,
            playback:
                new PlaybackStatus(bundle.pbm),
            logger: bundle.log,
            onReplaced:
                new ValueDispatcher(null),
            sharedWebGLContext:
                bundle.wgl,
            timeEventsClass:
                EditableTimeEvents,
            resolutionScale: 1
        }
    `)
    const c = new Code({
        code: start,
        highlighter,
        fontFamily: "'Fira Code'",
        fontSize: 15,
    })

    view.add(c)

    yield* c.code.append("\nfsd.onReplaced.current = fsd", 1)
    yield* c.code.append("\nconst scenev = new fsd.klass(fsd)", 1)
    yield* c.code.append("\nfsd.variables = new Variables(scenev)", 1)
}

export function* paralax(view: View2D) {
    const boxes: Rect[] = []

    const max = 10
    const offs = 200 / max
    for (let i = 0; i < max; i++) {
        const box =
            new Rect({
                fill: new Color({
                    r: 400 * i / max,
                    g: 200,
                    b: 200,
                    a: 1
                }),
                width: 1,
                height: offs + 2,
                children: boxes.length ? [boxes[boxes.length - 1]] : []
            })
        boxes.push(box)
        view.add(box)
    }

    const anims = []
    let i = 0
    for (const box of boxes) {
        anims.push(
            box.position.y(offs, 0).to(-offs, 6),
            box.width(200 + i * 100, 0).to(300 - (i / max) * 100, 6)
        )
        i++
    }

    yield* all(...anims);

}
