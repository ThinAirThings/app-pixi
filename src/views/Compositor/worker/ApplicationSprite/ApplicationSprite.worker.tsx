import { Container, Sprite } from "@pixi/react"
import { ContainerState} from "@thinairthings/zoom-utils"
import { FC, useRef, useState } from "react"
import { useApplicationServerWorker } from "./hooks/useApplicationServerWorker"
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
    useApplicationServerWorker(
        nodeId,
        containerState,
        applicationTextureRef,
        messagePort
    )
    return (<>
        <Container
            x={containerState?.x}
            y={containerState?.y}
            scale={containerState?.scale}
        >
            <Sprite
                texture={applicationTextureRef.current}
                width={(1/containerState?.scale)*containerState?.width}
                height={(1/containerState?.scale)*containerState?.height}
            />
        </Container>
    </>)
}