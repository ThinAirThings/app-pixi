import { useApp } from "@pixi/react"
import { Rectangle } from "pixi.js"
import { useEffect } from "react"
import { useViewportStateContext } from "../../../context/SpaceContext"


export const usePixiViewportStage = () => {
    // Get Pixi App Handle
    const app = useApp()
    // State
    const [viewportState] = useViewportStateContext()
    // Stage Initialization
    useEffect(() => {
        // Run all stage initialization code
        app.stage.eventMode = 'static'
        app.stage.hitArea = new Rectangle(-1e+6, -1e+6, 2e+6, 2e+6) // Oversize the hit area for scaling
    }, [])
    // Stage Updates
    useEffect(() => {
        // Run all stage update code
        app.stage.position.set(
            1/viewportState.scale * viewportState.x, 
            1/viewportState.scale * viewportState.y
        )
        app.stage.scale.set(1/viewportState.scale)
    }, [viewportState])
}