import { Sprite } from "@pixi/react"
import { ContainerState } from "@thinairthings/zoom-utils"
import { FC, useRef, useState } from "react"
import { useApplicationTextureWorker } from "./hooks/useApplicationTextureWorkerRef"
import {BaseTexture, Texture } from "@pixi/webworker"
import { ApplicationTextureResource } from "./webgl/ApplicationTextureResource"
import { useNodeRxContainerState } from "./hooks/useNodeRxContainerState"
import { useResizeApplicationTexture } from "./hooks/useResizeApplicationTexture"

export const ApplicationSprite: FC<{
    nodeId: string,
    initialContainerState: ContainerState,
    messagePort: MessagePort
}> = ({nodeId, initialContainerState, messagePort}) => {
    // State
    const [containerState, setContainerState] = useState<ContainerState>(initialContainerState)
    // Refs
    const applicationTextureRef = useRef((() => {
        return new Texture<ApplicationTextureResource>(new BaseTexture(
            new ApplicationTextureResource(containerState)
        ))
    })())
    // Effects
    useNodeRxContainerState(nodeId, setContainerState)
    useResizeApplicationTexture(applicationTextureRef, containerState)
    useApplicationTextureWorker(
        nodeId,
        containerState,
        applicationTextureRef,
        messagePort
    )
    
    return (<>
       <Sprite
            texture={applicationTextureRef.current}
            width={containerState?.width}
            height={containerState?.height}
            x={containerState?.x}
            y={containerState?.y}
       />
    </>)
}