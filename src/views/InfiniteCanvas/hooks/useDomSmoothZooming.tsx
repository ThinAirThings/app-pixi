import { useEffect, useRef } from "react"
import { useViewportStateContext } from "../../../context/SpaceContext"
import { zoomSpeed } from "./usePixiViewportStage"


export const useDomSmoothZooming = (referencePointRef: React.RefObject<HTMLDivElement>) => {
    // State
    const [viewportState] = useViewportStateContext()
    const viewportStateFrameRef = useRef(viewportState)
    // Effects
    useEffect(() => {
        if (!referencePointRef.current) return
        let animationFrameId: number
        const tick = () => {
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
                referencePointRef.current!.style.transform = `
                    scale(${1/viewportStateFrameRef.current.scale})
                    translate(${viewportStateFrameRef.current.x}px, ${viewportStateFrameRef.current.y}px)
                `
            }
            animationFrameId = requestAnimationFrame(tick)
        }
        animationFrameId = requestAnimationFrame(tick)
        return () => {
            animationFrameId && cancelAnimationFrame(animationFrameId)
        }
    }, [referencePointRef, viewportState])
}