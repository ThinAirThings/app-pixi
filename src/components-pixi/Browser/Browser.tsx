
import { Sprite } from "@pixi/react"
import { useStorageContainerState } from "../../hooks/liveblocks/useStorageContainerState"
import { RxTxContainer } from "../_base/RxTxContainer"
import { Texture } from "pixi.js"
import { useRef, useState } from "react"
import { PixiLoading } from "../PixiLoading/PixiLoading"
import { useBrowserCanvasWorker } from "./hooks/useBrowserCanvasWorker"
import { WorkerClient } from "@thinairthings/worker-client"

export const Browser = ({
    nodeId
}: {
    nodeId: string
}) => {
    // Refs
    const browserTextureRef = useRef<Texture | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const workerClientRef = useRef<WorkerClient | null>(null)
    // State
    const containerState = useStorageContainerState(nodeId)
    const [readyToRender, setReadyToRender] = useState(false)
    // Effects
    useBrowserCanvasWorker(nodeId, {
        browserTextureRef,
        canvasRef,
        workerClientRef,
        setReadyToRender
    })
    return(
        <RxTxContainer nodeId={nodeId}>
            {readyToRender
                ? <Sprite
                    eventMode="auto"
                    texture={browserTextureRef.current!}
                />
                : <PixiLoading
                    width={(1/containerState.scale)*containerState.width}
                    height={(1/containerState.scale)*containerState.height}
                />
            }
        </RxTxContainer>
    )
}