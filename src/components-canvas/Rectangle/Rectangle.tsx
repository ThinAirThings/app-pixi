import { Graphics } from "@pixi/react"
import { Graphics as pxGraphics } from "pixi.js"
import { useCallback } from "react"
import { ImmutableAirNode } from "../../context/LiveblocksContext"

export const Rectangle = ({
    nodeRef
}: {
    nodeRef: ImmutableAirNode
}) => {
    const draw = useCallback((g: pxGraphics) => {
        g.beginFill(0x0000ff)
        g.drawRect(0, 0, 100, 100)
        g.endFill()
    }, [])
    return(
        <Graphics
            draw={draw}
        />
    )
}