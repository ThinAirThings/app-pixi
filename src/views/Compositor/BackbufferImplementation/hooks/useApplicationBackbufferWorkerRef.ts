import { WorkerClient } from "@thinairthings/worker-client"
import { MutableRefObject, useEffect, useRef } from "react"
import BackbufferWorker from "../BackbufferWorker.worker?worker"
import { ContainerState } from "@thinairthings/zoom-utils"
import {Texture } from "@pixi/webworker"
import { useRerender } from "../../../../hooks/useRerender"
export const useApplicationBackbufferWorkerRef = (
    nodeId: string,
    containerState: ContainerState,
    applicationTextureRef: MutableRefObject<Texture>
) => {
    // Refs
    const backBufferWorkerClientRef = useRef<WorkerClient>(null)
    const rerender = useRerender()
    // Effects
    useEffect(() => {
        backBufferWorkerClientRef.current = new WorkerClient(new BackbufferWorker(), {
            'rxBackbufferBitmap': ({backbufferBitmap}: {
                backbufferBitmap: ImageBitmap
            }) => {
                const temp = applicationTextureRef.current
                const newTexture = Texture.from(backbufferBitmap)
                applicationTextureRef.current = newTexture
                temp.baseTexture.destroy()
                rerender()
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