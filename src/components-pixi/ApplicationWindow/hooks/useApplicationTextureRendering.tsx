import { MutableRefObject, useEffect } from "react"
import {WorkerClient} from "@thinairthings/worker-client"
import { useStorageContainerState } from "../../../hooks/liveblocks/useStorageContainerState"
import RenderWorker from "../renderWorker?worker"
import { useSpaceDetailsContext } from "../../../context/SpaceContext"
import { useUserDetailsContext } from "../../../context/UserContext"
import { useNodeState } from "../../../hooks/liveblocks/useStorageNodeState"
import { NodeComponentIndex } from "../../../NodeComponentIndex"
import { RenderTexture, Sprite, Texture } from "pixi.js"
import { ScreenState } from "@thinairthings/zoom-utils"
import { useApp } from "@pixi/react"

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
    // Storage
    const app = useApp()
    const containerState = useStorageContainerState(nodeId)
    const url = useNodeState<typeof NodeComponentIndex['browser']['defaultProps'], 'url'>(nodeId, 'url') // Used in initialization
    const [spaceDetails] = useSpaceDetailsContext()
    const [userDetails] = useUserDetailsContext()
    const readyToConnect = useNodeState<typeof NodeComponentIndex['browser']['defaultProps'], 'readyToConnect'>(nodeId, 'readyToConnect')
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
            width: containerState.width,
            height: containerState.height,
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