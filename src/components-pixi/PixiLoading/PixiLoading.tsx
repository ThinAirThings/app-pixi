import { Container as RxContainer, Sprite as RxSprite, Graphics as RxGraphics} from "@pixi/react"
import { Graphics as PxGraphics, Texture, Container as PxContainer, Sprite as PxSprite } from "pixi.js"
import { useCallback, useEffect, useRef } from "react"
import { LoadingBar } from "./LoadingBar"

export const PixiLoading = ({width, height}: {
    width: number
    height: number
}) => {
    const containerRef = useRef<PxContainer>(null)
    const earsRef = useRef<PxSprite>(null)
    const drawBackground = useCallback((g: PxGraphics) => {
        g.clear()
        g.beginFill(0x111111)
        g.drawRoundedRect(0, 0, width, height, 5)
        g.endFill()
    }, [width, height])
    
    return (
        <RxContainer ref={containerRef}>
            <RxGraphics draw={drawBackground} />
            <RxSprite
                ref={earsRef}
                scale={4/3*0.5}
                x={width/2-14}
                y={height/2}
                anchor={.5}
                texture={Texture.from('/baselineSVG/ears-white-100baseline.svg')}
            />
            <LoadingBar width={width} height={height} />
        </RxContainer>
    )
}