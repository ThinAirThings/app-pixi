import { Graphics } from "@pixi/react"
import { Graphics as pxGraphics } from "pixi.js"
import { useCallback } from "react"
import { ImmutableAirNode } from "../../context/LiveblocksContext"
import { useContainerState } from "../../hooks/liveblocksHooks"

export const Rectangle = ({
    nodeRef
}: {
    nodeRef: ImmutableAirNode
}) => {
    const containerState = useContainerState(nodeRef.nodeId)
    const draw = useCallback((g: pxGraphics) => {
        g.clear()
        g.beginFill(0x0000ff)
        g.drawRect(0, 0, containerState.width, containerState.height)
        g.endFill()
    }, [containerState.width, containerState.height])
    return(
        <Graphics
            x={containerState.x}
            y={containerState.y}
            draw={draw}
        />
    )
}