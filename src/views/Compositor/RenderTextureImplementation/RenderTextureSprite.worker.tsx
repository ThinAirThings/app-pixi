import { Sprite } from "@pixi/react"
import { ContainerState } from "@thinairthings/zoom-utils"
import { FC, useRef, useState } from "react"
import { useApplicationBackendChannelRef } from "./hooks/useApplicationBackendChannelRef"
import { useNodeRxContainerState } from "./hooks/useNodeRxContainerState"
import {RenderTexture} from "@pixi/webworker"
import { useNodeRxMouseInput } from "./hooks/useNodeRxMouseInput"

export const RenderTextureSprite: FC<{
    nodeId: string,
    initialContainerState: ContainerState
}> = ({nodeId, initialContainerState}) => {
    // Refs
    const applicationTextureRef = useRef<RenderTexture>(RenderTexture.create({
        width: initialContainerState.width,
        height: initialContainerState.height,
    }))
    // State
    const [containerState, setContainerState] = useState<ContainerState>(initialContainerState)
    // Effects
    useNodeRxContainerState(
        nodeId, 
        applicationTextureRef.current,
        setContainerState
    )
    const applicationChannelRef = useApplicationBackendChannelRef(
        nodeId, 
        applicationTextureRef.current
    )
    useNodeRxMouseInput(nodeId, applicationChannelRef)
    return (<>
       <Sprite
            texture={applicationTextureRef.current}
            x={containerState?.x}
            y={containerState?.y}
       />
    </>)
}