import { PixiComponent, Graphics as RxGraphics, applyDefaultProps} from "@pixi/react"
import {Graphics as PxGraphics} from "pixi.js"
import { RxTxContainer } from "../_base/RxTxContainer"
import { useStorageContainerState } from "@thinairthings/liveblocks-model"
import { useStorage } from "../../context/LiveblocksContext"


const RxPxRectangle = PixiComponent<{
    width: number
    height: number
    color: number
}&Parameters<typeof RxGraphics>['0'], PxGraphics>('RxPxRectangle', {
    create: () => new PxGraphics(),
    applyProps: (instance, oldProps, newProps) => {
        if (oldProps.width !== newProps.width || oldProps.height !== newProps.height) {
            instance.clear()
            instance.beginFill(newProps.color)
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
    const containerState = useStorageContainerState(useStorage, nodeId)
    return(
        <RxTxContainer nodeId={nodeId}>
            <RxPxRectangle
                width={(1/containerState.scale)*containerState.width}
                height={(1/containerState.scale)*containerState.height}
                color={0x000000}
            />
        </RxTxContainer>
    )
}