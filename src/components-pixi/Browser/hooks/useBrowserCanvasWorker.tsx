import { MutableRefObject, useEffect } from "react"
import {WorkerClient} from "@thinairthings/worker-client"
import { useStorageContainerState } from "../../../hooks/liveblocks/useStorageContainerState"
import RenderWorker from "../renderWorker?worker"
import { useSpaceDetailsContext } from "../../../context/SpaceContext"
import { useUserDetailsContext } from "../../../context/UserContext"
import { useNodeState } from "../../../hooks/liveblocks/useStorageNodeState"
import { NodeComponentIndex } from "../../../NodeComponentIndex"
import { Texture } from "pixi.js"

export const useBrowserCanvasWorker = (nodeId: string, {
    canvasRef,
    browserTextureRef,
    workerClientRef,
    setReadyToRender
}: {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>
    browserTextureRef: MutableRefObject<Texture | null>
    workerClientRef: MutableRefObject<WorkerClient | null>
    setReadyToRender: (readyToRender: boolean) => void
}) => {
    // Storage
    const containerState = useStorageContainerState(nodeId)
    const url = useNodeState<typeof NodeComponentIndex['browser']['defaultProps'], 'url'>(nodeId, 'url') // Used in initialization
    const [spaceDetails] = useSpaceDetailsContext()
    const [userDetails] = useUserDetailsContext()
    useEffect(() => {
        // Create Texture
        browserTextureRef.current = Texture.EMPTY
        // Create worker client
        workerClientRef.current = new WorkerClient(new RenderWorker(), {
            'rxFrameDamage': ({imageBitmap}:{imageBitmap: ImageBitmap}) => {
                const texture = Texture.from(imageBitmap)
                browserTextureRef.current = texture
                console.log("Received")
                // setReadyToRender(true)
            }
        })
        // Create canvas
        canvasRef.current = document.createElement('canvas')
        canvasRef.current.width = containerState.width
        canvasRef.current.height = containerState.height
        const offscreenCanvasTransfer = canvasRef.current.transferControlToOffscreen()

        // Initialize worker
        workerClientRef.current.sendMessage('initialize', {
            serverUrl: `http://${import.meta.env.VITE_SERVER_HOST}:3000`,
            userId: userDetails.userId,
            spaceId: spaceDetails.spaceId,
            nodeId,
            url,
            containerState: {
                x: Math.round(containerState.x),
                y: Math.round(containerState.y),
                width: Math.round(containerState.width),
                height: Math.round(containerState.height),
                scale: containerState.scale
            },
            canvas: offscreenCanvasTransfer
        }, [offscreenCanvasTransfer])
        setReadyToRender(true)
    }, [])
}