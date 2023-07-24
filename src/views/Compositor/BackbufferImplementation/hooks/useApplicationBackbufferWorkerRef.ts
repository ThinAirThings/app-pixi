import { WorkerClient } from "@thinairthings/worker-client"
import { MutableRefObject, useEffect, useRef } from "react"
import BackbufferWorker from "../BackbufferWorker.worker?worker"
import { ContainerState, ScreenState } from "@thinairthings/zoom-utils"
import { Texture } from "@pixi/webworker"
import { ApplicationFramebufferResource } from "../webgl/ApplicationFramebufferResource"
import { mainThreadClient } from "../../Compositor.worker"
export const useApplicationBackbufferWorkerRef = (
    nodeId: string,
    containerState: ContainerState,
    applicationTextureRef: MutableRefObject<Texture<ApplicationFramebufferResource>>
) => {
    // Refs
    const backBufferWorkerClientRef = useRef<WorkerClient>(null)
    // Effects
    useEffect(() => {
        backBufferWorkerClientRef.current = new WorkerClient(new BackbufferWorker(), {
            'rxDirtyBitmap': async ({dirtyBitmap, dirtyRect}: {
                dirtyBitmap: ImageBitmap
                dirtyRect: ScreenState
            }) => {
                applicationTextureRef.current.baseTexture.resource.uploadDirtyFrame(
                    dirtyBitmap,
                    dirtyRect
                )
            },
            "rxCursorType": async (payload: {
                cursorType: string
            }) => {
                mainThreadClient.sendMessage('txCursorType', {
                    nodeId,
                    cursorType: payload.cursorType
                })
            }
        })
        backBufferWorkerClientRef.current.sendMessage('initialize', {
            serverUrl: `http://${import.meta.env.VITE_SERVER_HOST}:3000`,
            nodeId: nodeId,
            containerState
        })
        return () => {
            backBufferWorkerClientRef.current?.cleanup()
        }
    }, [])

    return backBufferWorkerClientRef
}