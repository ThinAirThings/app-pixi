
import { RxTxContainer } from "../_base/RxTxContainer"
import { RenderTexture } from "pixi.js"
import { ReactNode, useRef, useState } from "react"
import { PixiLoading } from "../PixiLoading/PixiLoading"
import { WorkerClient } from "@thinairthings/worker-client"
import { useApplicationTextureRendering } from "./hooks/useApplicationTextureRendering"
import { useApplicationPointerEvents } from "./hooks/useApplicationPointerEvents"
import {Sprite as PxSprite} from "pixi.js"
import { ApplicationSprite } from "../_base/ApplicationSprite"
import { useStorageContainerState, useStorageNodeState } from "@thinairthings/liveblocks-model"
import { useApplicationKeyboardEvents } from "./hooks/useApplicationKeyboardEvents"
import { useStorage } from "../../context/LiveblocksContext"

export const applicationSocketMap = new Map<string, WorkerClient>()

export const ApplicationWindow = ({
    nodeId,
    children
}: {
    nodeId: string
    children?: ReactNode
}) => {
    // State
    const containerState = useStorageContainerState(useStorage, nodeId)
    const [readyToRender, setReadyToRender] = useState(false)
    const cursor = useStorageNodeState<'browser', 'cursor'>(useStorage, nodeId, "cursor")
    // Refs
    const applicationSpriteRef = useRef<PxSprite>(null)
    const applicationTextureRef = useRef<RenderTexture>(RenderTexture.create({
        width: containerState.width,
        height: containerState.height
    }))

    const workerClientRef = useRef<WorkerClient | null>(null)
    applicationSocketMap.has(nodeId) || applicationSocketMap.set(nodeId, workerClientRef.current!)
    // Effects
    useApplicationTextureRendering(nodeId, {
        applicationTextureRef,
        applicationSpriteRef,
        workerClientRef,
        setReadyToRender
    })
    useApplicationPointerEvents(applicationSpriteRef, nodeId, {
        workerClientRef,
        readyToRender
    })
    useApplicationKeyboardEvents(nodeId, {
        workerClientRef,
        readyToRender
    })
    return(
        <RxTxContainer nodeId={nodeId}>
            {readyToRender
                ? <ApplicationSprite
                    ref={applicationSpriteRef}
                    nodeId={nodeId}
                    texture={applicationTextureRef.current!}
                    cursor={cursor}
                    containerState={containerState}
                /> 
                : <PixiLoading
                    width={(1/containerState.scale)*containerState.width}
                    height={(1/containerState.scale)*containerState.height}
                />
            }
            {children}
        </RxTxContainer>
    )
}