
import { Sprite } from "@pixi/react"
import { useStorageContainerState } from "../../hooks/liveblocks/useStorageContainerState"
import { RxTxContainer } from "../_base/RxTxContainer"
import { RenderTexture } from "pixi.js"
import { ReactNode, useRef, useState } from "react"
import { PixiLoading } from "../PixiLoading/PixiLoading"
import { WorkerClient } from "@thinairthings/worker-client"
import { useApplicationTextureRendering } from "./hooks/useApplicationTextureRendering"


export const applicationSocketMap = new Map<string, WorkerClient>()

export const ApplicationWindow = ({
    nodeId,
    children
}: {
    nodeId: string
    children?: ReactNode
}) => {
    // State
    const containerState = useStorageContainerState(nodeId)
    const [readyToRender, setReadyToRender] = useState(false)
    // Refs
    const applicationTextureRef = useRef<RenderTexture>(RenderTexture.create({
        width: containerState.width,
        height: containerState.height
    }))
    const workerClientRef = useRef<WorkerClient | null>(null)
    applicationSocketMap.has(nodeId) || applicationSocketMap.set(nodeId, workerClientRef.current!)
    // Effects
    useApplicationTextureRendering(nodeId, {
        applicationTextureRef,
        workerClientRef,
        setReadyToRender
    })
    return(
        <RxTxContainer nodeId={nodeId}>
            {readyToRender
                ? <Sprite
                    texture={applicationTextureRef.current}
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