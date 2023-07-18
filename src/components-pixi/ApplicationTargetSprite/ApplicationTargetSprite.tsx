import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { ContainerState } from "@thinairthings/zoom-utils";
import { Sprite as PxSprite, Texture } from "pixi.js";
import { MixinThinAirTargetingDataset } from "../_ext/MixinThinAirTargetingDataset";



export const ApplicationTargetSprite = PixiComponent<{
    nodeId?: string
    containerState?: ContainerState
}, PxSprite>('ApplicationTargetSprite', {
    create: ({nodeId, containerState}) => {
        const sprite =  MixinThinAirTargetingDataset(PxSprite).create({
            nodeid: nodeId,
            isselectiontarget: true,
            isapplicationtarget: true,
            ispixitarget: true
        })
        sprite.texture = Texture.WHITE
        sprite.alpha = 0
        sprite.width = containerState.width
        sprite.height = containerState.height
        return sprite
    },
    applyProps: (instance, oldProps, newProps) => {
        applyDefaultProps(instance, oldProps, newProps)
        instance.eventMode = "static"
        instance.width = newProps.containerState?.width
        instance.height = newProps.containerState?.height
    } 
})