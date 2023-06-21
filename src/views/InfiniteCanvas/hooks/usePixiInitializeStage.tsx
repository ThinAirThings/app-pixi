import { useApp } from "@pixi/react"
import { Rectangle } from "pixi.js"
import { useEffect } from "react"


export const usePixiInitializeStage = () => {
    // Get Pixi App Handle
    const app = useApp()
    // Stage Initialization
    useEffect(() => {
        // Run all stage initialization code
        app.stage.eventMode = 'static'
        app.stage.hitArea = new Rectangle(-1e+6, -1e+6, 2e+6, 2e+6) // Oversize the hit area for scaling
    }, [])
}