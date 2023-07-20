import { ViewportState } from "@thinairthings/zoom-utils";
import { useWorkerNodeSignal } from "./useWorkerNodeSignal.worker";
import { useApp } from "@pixi/react";


export const useRootRxViewportState = () => {
    const app = useApp()
    useWorkerNodeSignal<{
        viewportState: ViewportState
    }>('root', 'rxViewportState', ({
        viewportState
    }) => {
        app.stage.position.set(
            1/viewportState.scale * viewportState.x,
            1/viewportState.scale * viewportState.y
        )
        app.stage.scale.set(1/viewportState.scale)
    })
}