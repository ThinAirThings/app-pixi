import { Container, Sprite } from "@pixi/react"
import { ContainerState, ScreenState } from "@thinairthings/zoom-utils"
import { FC, useRef, useState } from "react"
import { useApplicationServerWorker } from "./hooks/useApplicationServerWorker"
import {BaseTexture, Texture } from "@pixi/webworker"
import { ApplicationTextureResource } from "./webgl/ApplicationTextureResource"
import { useNodeRxContainerState } from "./hooks/useNodeRxContainerState"
import { useResizeApplicationTexture } from "./hooks/useResizeApplicationTexture"
import { useImmer } from "use-immer"
import { PopupSprite } from "./PopupSprite.worker"

export const ApplicationSprite: FC<{
    nodeId: string,
    initialContainerState: ContainerState,
    messagePort: MessagePort
}> = ({nodeId, initialContainerState, messagePort}) => {
    // State
    const [containerState, setContainerState] = useState<ContainerState>(initialContainerState)
    const [popupWindows, setPopupWindows] = useImmer<Map<number, {
        pixmapId: number,
        screenState: ScreenState
    }>>(new Map())
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
        messagePort,
        setPopupWindows
    )
    
    return (<>
        <Container
            x={containerState?.x}
            y={containerState?.y}
        >
            <Sprite
                texture={applicationTextureRef.current}
                width={containerState?.width}
                height={containerState?.height}
            />
            {[...popupWindows].map(([pixmapId, {screenState}]) => {
                return <PopupSprite
                    key={pixmapId}
                    pixmapId={pixmapId}
                    screenState={screenState}
                />
            })}
        </Container>
    </>)
}