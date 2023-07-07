import { useApp, useTick } from "@pixi/react"
import { Rectangle } from "pixi.js"
import { useEffect, useRef } from "react"
import { useViewportStateContext } from "../../../context/SpaceContext"
import { TxPxContainer } from "../../../components-pixi/_ext/MixinThinAirTargetingDataset"


export const zoomSpeed = 0.15
export const usePixiViewportStage = () => {
    // Get Pixi App Handle
    const app = useApp()
    // State
    const [viewportState] = useViewportStateContext()
    const viewportStateFrameRef = useRef(viewportState)
    useTick(() => {
        if (viewportStateFrameRef.current !== viewportState) {
            const {dx, dy, dScale} = {
                dx: viewportState.x - viewportStateFrameRef.current.x,
                dy: viewportState.y - viewportStateFrameRef.current.y,
                dScale: viewportState.scale - viewportStateFrameRef.current.scale
            }
            viewportStateFrameRef.current = {
                ...viewportStateFrameRef.current,
                x: viewportStateFrameRef.current.x + dx * zoomSpeed,
                y: viewportStateFrameRef.current.y + dy * zoomSpeed,
                scale: viewportStateFrameRef.current.scale + dScale * zoomSpeed
            }
            app.stage.position.set(
                1/viewportStateFrameRef.current.scale * viewportStateFrameRef.current.x,
                1/viewportStateFrameRef.current.scale * viewportStateFrameRef.current.y
            )
            app.stage.scale.set(1/viewportStateFrameRef.current.scale)
        }
    })

    // Stage Initialization
    useEffect(() => {
        // Run all stage initialization code
        app.stage.eventMode = 'static'
        app.stage.hitArea = new Rectangle(-1e+6, -1e+6, 2e+6, 2e+6); // Oversize the hit area for scaling
        (app.stage as TxPxContainer).dataset = { ...(app.stage as TxPxContainer).dataset, isviewport: "true", ispixitarget: "true"};
        (app.view as HTMLCanvasElement).dataset.ispixitarget = "true"
    }, [])


}