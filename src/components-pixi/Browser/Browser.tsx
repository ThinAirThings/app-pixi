import { Graphics } from "@pixi/react"
import { Graphics as pxGraphics } from "pixi.js"
import { useCallback } from "react"

export const Browser = ({
    nodeId
}: {
    nodeId: string
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