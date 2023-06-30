import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { Sprite as RxSprite } from "@pixi/react";
import { Sprite as PxSprite } from "pixi.js";
import { MixinThinAirTargetingDataset } from "../_ext/MixinThinAirTargetingDataset";


export const ApplicationSprite = PixiComponent<{
    nodeId?: string
}&Parameters<typeof RxSprite>['0'], PxSprite>('ApplicationSprite', {
    create: ({nodeId}) => {
        return MixinThinAirTargetingDataset(PxSprite).create({
            nodeid: nodeId,
            isselectiontarget: true,
            isapplicationtarget: true,
            ispixitarget: true,
        })
    },
    applyProps: (instance, oldProps, newProps) => {
        applyDefaultProps(instance, oldProps, newProps)
        instance.eventMode = "static"
    }
})
