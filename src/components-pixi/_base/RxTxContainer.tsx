import { PixiComponent, Container as RxContainer, applyDefaultProps } from "@pixi/react";
import { MixinThinAirTargetingDataset, TxPxContainer } from "../_ext/MixinThinAirTargetingDataset";
import { ReactNode } from "react";
import { Graphics as PxGraphics } from "pixi.js";
import { useStorageContainerState } from "../../hooks/liveblocks/useStorageContainerState";


const RxTxPxContainer = PixiComponent<{
    nodeid?: string
    isselectiontarget?: boolean
    isviewport?: boolean
    istransformtarget?: boolean
    x: number
    y: number
    scale: number
    children?: ReactNode
}&Parameters<typeof RxContainer>['0'], TxPxContainer>('RxTxPxContainer', {
    create: ({nodeid, isselectiontarget, isviewport, istransformtarget}) => {
        return MixinThinAirTargetingDataset(PxGraphics).create({
            nodeid,
            isselectiontarget,
            isviewport,
            istransformtarget,
            ispixitarget: true,
        })
    },
    applyProps: (instance, oldProps, newProps) => {
        applyDefaultProps(instance, oldProps, newProps)
    }
})

export const RxTxContainer = ({
    nodeId,
    children
}: {
    nodeId: string
    children?: ReactNode
}) => {
    const containerState = useStorageContainerState(nodeId)
    return (
        <RxTxPxContainer
            nodeid={nodeId}
            isselectiontarget={true}
            x={containerState.x}
            y={containerState.y}
            scale={containerState.scale}
            eventMode="static"
            cursor="pointer"
        >
            {children}
        </RxTxPxContainer>
    )
}
