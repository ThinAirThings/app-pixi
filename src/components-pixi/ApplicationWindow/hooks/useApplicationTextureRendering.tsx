import { MutableRefObject, useEffect } from "react"
import {WorkerClient} from "@thinairthings/worker-client"
import RenderWorker from "../renderWorker?worker"
import { NodeComponentIndex } from "../../../NodeComponentIndex"
import { RenderTexture, Sprite, Texture } from "pixi.js"
import { ScreenState } from "@thinairthings/zoom-utils"
import { useApp } from "@pixi/react"
import { useStorageContainerState, useStorageNodeState } from "@thinairthings/liveblocks-model"
import { useStorage } from "../../../context/LiveblocksContext"

export const useApplicationTextureRendering = (nodeId: string, {
    applicationTextureRef,
    applicationSpriteRef,
    workerClientRef,
    setReadyToRender
}: {
    applicationTextureRef: MutableRefObject<RenderTexture | null>
    applicationSpriteRef: MutableRefObject<Sprite | null>
    workerClientRef: MutableRefObject<WorkerClient | null>
    setReadyToRender: (readyToRender: boolean) => void
}) => {
    // Refs
    const app = useApp()
    // State
    const containerState = useStorageContainerState(useStorage, nodeId)
    const readyToConnect = useStorageNodeState<'browser', 'readyToConnect'>(useStorage, nodeId, 'readyToConnect')
    // Effects
    useEffect(() => {
        if (!readyToConnect) return
        // Create worker client
        workerClientRef.current = new WorkerClient(new RenderWorker(), {
            'rxFrameDamage': ({dirtyBitmap, dirtyRect}:{
                dirtyBitmap: ImageBitmap
                dirtyRect: ScreenState
            }) => {
                if (!applicationTextureRef.current) {
                    return
                }  // Handle case where texture was destroyed and we're still cleaning up
                // You need to rearchitect this to use batch rendering
                const dirtyTexture = Texture.from(dirtyBitmap)
                const dirtySprite = Sprite.from(dirtyTexture)
                dirtySprite.position.x = dirtyRect.x
                dirtySprite.position.y = dirtyRect.y
                app.renderer.render(dirtySprite, {
                    renderTexture: applicationTextureRef.current!,
                    clear: false, 
                })
                setReadyToRender(true)
                // Cleanup
                dirtyTexture.destroy(true);
            }
        })

        // Initialize worker
        workerClientRef.current.sendMessage('initialize', {
            nodeId,
            serverUrl: `http://${import.meta.env.VITE_SERVER_HOST}:3000`,
        })
        return () => {
            applicationTextureRef.current?.destroy(true)
            applicationTextureRef.current = null
            setTimeout(() => {
                workerClientRef.current?.worker.terminate()
            }, 500)
        }
    }, [readyToConnect])
    // Handle Resize
    useEffect(() => {
        // NOTE!!! There may be a memory leak in here. I'm not sure if the old texture is being destroyed properly
        const newRenderTexture = RenderTexture.create({
            width: (1/containerState.scale)*containerState.width,
            height: (1/containerState.scale)*containerState.height,
        })
        app.renderer.render(Sprite.from(applicationTextureRef.current!), {
            renderTexture: newRenderTexture,
            clear: false
        })
        applicationTextureRef.current = newRenderTexture
        if (!applicationSpriteRef.current) return
        applicationSpriteRef.current!.texture = applicationTextureRef.current
    }, [containerState.width, containerState.height])
}