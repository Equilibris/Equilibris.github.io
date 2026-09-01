import { PlaybackManager, Logger, SharedWebGLContext, Vector2 } from "@canvas-commons/core";


export interface ViewBundle {
    pbm: PlaybackManager
    log: Logger
    wgl: SharedWebGLContext
    size: Vector2
}

export const createViewBundle = (size: Vector2): ViewBundle => {
    const log = new Logger()

    return {
        pbm: new PlaybackManager(),
        log,
        wgl: new SharedWebGLContext(log),
        size,
    }
}

