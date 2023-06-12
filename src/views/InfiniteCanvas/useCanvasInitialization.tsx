import { useApp } from "@pixi/react"
import { Rectangle } from "pixi.js"
import { useEffect } from "react"


export const useCanvasInitialization = () => {
    const app = useApp()
    useEffect(() => {
        // Run all stage initialization code
        app.stage.eventMode = 'auto'
        app.stage.hitArea = new Rectangle(-1e+6, -1e+6, 1e+6, 1e+6) // Oversize the hit area for scaling
    }, []) 
}