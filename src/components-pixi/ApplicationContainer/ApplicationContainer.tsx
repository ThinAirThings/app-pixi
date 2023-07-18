import { PixiComponent, applyDefaultProps } from "@pixi/react";
import { Container as PxContainer } from "pixi.js";
import { MixinThinAirTargetingDataset } from "../_ext/MixinThinAirTargetingDataset";


export const ApplicationContainer = PixiComponent<{
    nodeId?: string
}, PxContainer>('ApplicationContainer', {
    create: ({nodeId}) => {
        return MixinThinAirTargetingDataset(PxContainer).create({
            nodeid: nodeId,
            isselectiontarget: true,
            isapplicationtarget: true,
            ispixitarget: true
        })
    },
    applyProps: (instance, oldProps, newProps) => {
        applyDefaultProps(instance, oldProps, newProps)
        instance.eventMode = "static"
    } 
})