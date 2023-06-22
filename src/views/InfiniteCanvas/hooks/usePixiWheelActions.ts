import { useEffect } from "react"
import { useViewportStateContext } from "../../../context/SpaceContext"
import { fromEvent } from "rxjs"
import { useApp } from "@pixi/react"
import { mousePoint } from "@thinairthings/mouse-utils"


export const usePixiWheelActions = () => {
    // Get Pixi App Handle
    const app = useApp()
    // States
    const [viewportState, setViewportState] = useViewportStateContext()

    // Wheel Actions
    useEffect(() => {
        const subscription = fromEvent<WheelEvent>(app.stage, 'wheel')
        .subscribe((event) => {
            // Get zoom direction
            let direction: -1 | 1
            event.deltaY < 0 ? (direction = -1) : (direction = 1)
            const viewportBoxScaleFactor = 1 + (0.1*direction);
            // NOTE: Scale = Units / Pixel
            // Translate
            ((  screenWidth=window.innerWidth, screenHeight=window.innerHeight, 
                dAbsoluteViewportWidth=viewportState.scale*screenWidth*(viewportBoxScaleFactor - 1),
                dAbsoluteViewportHeight=viewportState.scale*screenHeight*(viewportBoxScaleFactor - 1)) => 
                    // Use screen width, height, dWidth, and dHeight to calculate new viewport state
                    setViewportState({
                        // ...viewportState,
                        x: viewportState.x + mousePoint(event).x/screenWidth*dAbsoluteViewportWidth,
                        y: viewportState.y + mousePoint(event).y/screenHeight*dAbsoluteViewportHeight,
                        scale: viewportState.scale*viewportBoxScaleFactor
                    })
            )()
        })
        return () => subscription.unsubscribe()
    }, [viewportState])
}