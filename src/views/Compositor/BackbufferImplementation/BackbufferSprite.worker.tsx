import { Sprite } from "@pixi/react"
import { ContainerState } from "@thinairthings/zoom-utils"
import { FC, useRef, useState } from "react"
import { useApplicationBackbufferWorkerRef } from "./hooks/useApplicationBackbufferWorkerRef"
import {BaseTexture, Texture } from "@pixi/webworker"
import { useNodeRxContainerState } from "./hooks/useNodeRxContainerState"
import { useNodeRxMouseInput } from "./hooks/useNodeRxMouseInput"
import { ApplicationFramebufferResource } from "./webgl/ApplicationFramebufferResource"

export const BackbufferSprite: FC<{
    nodeId: string,
    initialContainerState: ContainerState
}> = ({nodeId, initialContainerState}) => {
    // Refs
    const applicationTextureRef = useRef<Texture>((() => {
        return new Texture<ApplicationFramebufferResource>(new BaseTexture(
            new ApplicationFramebufferResource(initialContainerState)
        ))
    })())
    const backbufferWorkerRef = useApplicationBackbufferWorkerRef(
        nodeId,
        initialContainerState,
        applicationTextureRef
    )
    // State
    const [containerState, setContainerState] = useState<ContainerState>(initialContainerState)
    useNodeRxContainerState(nodeId, setContainerState)
    useNodeRxMouseInput(nodeId, backbufferWorkerRef)
    return (<>
       <Sprite
            texture={applicationTextureRef.current}
            x={containerState?.x}
            y={containerState?.y}
       />
    </>)
}