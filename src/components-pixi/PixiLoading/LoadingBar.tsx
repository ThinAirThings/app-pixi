import { Container, Graphics, Sprite, useTick } from "@pixi/react"
import { BaseTexture, Sprite as PxSprite, Texture, Graphics as PxGraphics, Container as PxContainer } from "pixi.js"
import { useEffect, useRef, useState } from "react"


const colors = [
    '#0420A1',
    '#1185D8',
    '#12AEA6',
    '#3DDF8C',
    '#EBCD19',
    '#E1351F',
    '#C00A1E'
]
export const LoadingBar = ({width, height}: {
    width: number
    height: number
}) => {
    const canvasDrawRef = useRef<HTMLCanvasElement | null>(null)
    const [maskReadyState, setMaskReadyState] = useState(false)
    // const [gradientTexture, setGradientTexture] = useState<Texture | null>(null)
    const t_gradient = useRef(0)
    const spriteRef = useRef<PxSprite | null>(null)
    const containerRef = useRef<PxContainer | null>(null)
    useTick((delta) => {
        // console.log(delta)
        t_gradient.current +=  delta / 25
        const s_period = 3
        const d_offset = (t_gradient.current % s_period) / s_period
        if (!canvasDrawRef.current) {
            canvasDrawRef.current = document.createElement('canvas')
            canvasDrawRef.current.width = 200
            canvasDrawRef.current.height = 5
        }
        const canvas = canvasDrawRef.current
        const ctx = canvas.getContext('2d')
        ctx && (() => {
            let grd = ctx.createLinearGradient(0, 0, 200, 0);
            let N = colors.length
            for (let n = 0; n < N; n++) {
                const pos = (n/N)+d_offset
                if (pos < 1){
                    grd.addColorStop(pos, colors[n%N])
                } else if (pos > 1) {
                    if (pos-1 < 1/(N)){
                        // In break zone
                        grd.addColorStop(0, colors[n-1%N])
                        grd.addColorStop(pos-1, colors[n%N])
                    } else {
                        grd.addColorStop(pos-1, colors[n%N])
                    }
                }
            }   
            ctx.fillStyle = grd;
            ctx.fillRect(25, 0, 150, 5);
            spriteRef.current!.texture = new Texture(new BaseTexture(canvas))
            setMaskReadyState(true)
        })()
    })
    useEffect(() => {
        if (!maskReadyState) return
        const mask = new PxGraphics()
        const spriteBounds = spriteRef.current!.getLocalBounds()
        mask.beginFill(0x000000)
        mask.drawRoundedRect(27, 0, 146, spriteBounds.height, 5)
        mask.endFill()
        containerRef.current!.mask = mask
        containerRef.current!.addChild(mask)
    }, [maskReadyState])
    return (
        <>
            <Container ref={containerRef}
                x={width/2-100}
                y={height/2+75}
            >
                <Sprite
                    ref={spriteRef}
                    texture={Texture.from('/logos/thinair-white.svg')}
                />
            </Container>

        </>
    )
}