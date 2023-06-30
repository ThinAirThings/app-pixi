import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { Sprite as RxSprite } from "@pixi/react";
import { Sprite as PxSprite, Texture } from "pixi.js";
import { MixinThinAirTargetingDataset, TxPxSprite } from "../_ext/MixinThinAirTargetingDataset";


const RxTxPxSprite = PixiComponent<{
    nodeid?: string
    isselectiontarget?: boolean
    isapplicationtarget?: boolean
}&Parameters<typeof RxSprite>['0'], TxPxSprite>('RxTxPxSprite', {
    create: ({nodeid, isselectiontarget, isapplicationtarget}) => {
        return MixinThinAirTargetingDataset(PxSprite).create({
            nodeid,
            isselectiontarget,
            isapplicationtarget
        })
    },
    applyProps: (instance, oldProps, newProps) => {
        applyDefaultProps(instance, oldProps, newProps)
    }
})

export const RxTxSprite = ({
    nodeId,
    texture,
    isSelectionTarget
}: {
    nodeId: string
    texture: Texture
    isSelectionTarget: boolean
}) => {
    return (
        <RxTxPxSprite
            nodeid={nodeId}
            isselectiontarget={true}
            texture={texture}
            eventMode="auto"
            cursor="pointer"
        />
    )
}