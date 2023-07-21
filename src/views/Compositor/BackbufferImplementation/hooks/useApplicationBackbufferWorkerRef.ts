import { WorkerClient } from "@thinairthings/worker-client"
import { MutableRefObject, useEffect, useRef } from "react"
import BackbufferWorker from "../BackbufferWorker.worker?worker"
import { ContainerState, ScreenState } from "@thinairthings/zoom-utils"
import {Renderer, Texture, TextureSystem } from "@pixi/webworker"
import { useRerender } from "../../../../hooks/useRerender"
import { useApp } from "@pixi/react"
import { ApplicationFramebufferResource } from "../webgl/ApplicationFramebufferResource"
export const useApplicationBackbufferWorkerRef = (
    nodeId: string,
    containerState: ContainerState,
    applicationTextureRef: MutableRefObject<Texture<ApplicationFramebufferResource>>
) => {
    // Refs
    const app = useApp()
    const backBufferWorkerClientRef = useRef<WorkerClient>(null)
    const rerender = useRerender()
    // Effects
    useEffect(() => {
        backBufferWorkerClientRef.current = new WorkerClient(new BackbufferWorker(), {
            'rxBackbufferBitmap': ({backbufferBitmap}: {
                backbufferBitmap: ImageBitmap
            }) => {
                // app.renderer.addSystem(TextureSystem)
                const temp = applicationTextureRef.current
                const newTexture = Texture.from(backbufferBitmap)
                // applicationTextureRef.current = newTexture
                temp.baseTexture.destroy()
                rerender()
            },
            'rxDirtyBitmap': async ({dirtyBitmap, dirtyRect}: {
                dirtyBitmap: ImageBitmap
                dirtyRect: ScreenState
            }) => {
                applicationTextureRef.current.baseTexture.resource.uploadDirtyFrame(
                    dirtyBitmap,
                    dirtyRect
                )
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