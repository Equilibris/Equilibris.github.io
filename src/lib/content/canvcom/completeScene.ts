import { makeProject, Player, bootstrap, MetaFile, type Scene, Vector2, Variables, PlaybackManager, PlaybackStatus, Logger, SharedWebGLContext, EditableTimeEvents, all, ValueDispatcher, loop, type SceneDescription, type FullSceneDescription } from "@canvas-commons/core";
import type { ViewBundle } from "./bundle";

export const completeScene = <T>(
    desc: SceneDescription<T>,
    name: string,
    bundle: ViewBundle
): Scene<T> => {
    const fsd: FullSceneDescription<T> = {
        ...desc,
        name,
        size: bundle.size,
        variables: undefined,
        playback: new PlaybackStatus(bundle.pbm),
        logger: bundle.log,
        onReplaced: new ValueDispatcher(null),
        sharedWebGLContext: bundle.wgl,
        timeEventsClass: EditableTimeEvents,
        resolutionScale: 1
    }
    fsd.onReplaced.current = fsd
    const scenev = new fsd.klass(fsd)
    fsd.variables = new Variables(scenev)

    return scenev
}
