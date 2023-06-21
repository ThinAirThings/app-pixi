import { PixiComponent, applyDefaultProps, Graphics as RxGraphics} from "@pixi/react"
import { useRef } from "react"
import { TxPxGraphics } from "../_ext/TxPxGraphics"
import { useStorageContainerState } from "../../hooks/liveblocks/useStorageContainerState"

const RxTxPxRectangle = PixiComponent<{
    nodeId: string
    selectionTarget: boolean
    x: number
    y: number
    width: number
    height: number
}&Parameters<typeof RxGraphics>['0'], TxPxGraphics>('RxTxPxRectangle', {
    create: ({nodeId, selectionTarget}) => {
        return new TxPxGraphics(
            nodeId, selectionTarget
        )
    },
    applyProps: (instance, oldProps, newProps) => {
        if (oldProps.width !== newProps.width || oldProps.height !== newProps.height) {
            instance.clear()
            instance.beginFill(0x0000ff)
            instance.drawRect(0, 0, newProps.width, newProps.height)
            instance.endFill()
        }
        applyDefaultProps(instance, oldProps, newProps)
    }
})

export const Rectangle = ({
    nodeId
}: {
    nodeId: string
}) => {
    const rectangleRef = useRef<TxPxGraphics>(null)
    const containerState = useStorageContainerState(nodeId)

    return(
        <RxTxPxRectangle
            nodeId={nodeId}
            selectionTarget={true}
            ref={rectangleRef}
            eventMode="static"
            cursor="pointer"
            x={containerState.x}
            y={containerState.y}
            width={containerState.width}
            height={containerState.height}
        />
    )
}