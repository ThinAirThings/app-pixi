import { ViewportState } from "@thinairthings/zoom-utils";
import { useApp } from "@pixi/react";
import { useNodeSignal } from "../../../hooks/useNodeSignal";


export const useRootRxViewportState = () => {
    const app = useApp()
    useNodeSignal<{
        viewportState: ViewportState
    }>("worker", 'root', 'rxViewportState', ({
        viewportState
    }) => {
        app.stage.position.set(
            1/viewportState.scale * viewportState.x,
            1/viewportState.scale * viewportState.y
        )
        app.stage.scale.set(1/viewportState.scale)
    })
}