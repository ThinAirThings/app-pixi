import { MutableRefObject, useEffect, useRef } from "react"
import {WorkerClient} from "@thinairthings/worker-client"
import RenderWorker from "../renderWorker?worker"
import { NodeComponentIndex } from "../../../NodeComponentIndex"
import { Graphics, Container as PxContainer, RenderTexture, Sprite, Texture } from "pixi.js"
import { ContainerState, ScreenState } from "@thinairthings/zoom-utils"
import { useApp } from "@pixi/react"
import { useStorageContainerState, useStorageNodeState } from "@thinairthings/liveblocks-model"
import { useStorage } from "../../../context/LiveblocksContext"

export const useApplicationRendering = (nodeId: string, {
    applicationContainerRef,
    workerClientRef,
    setReadyToRender
}: {
    applicationContainerRef: MutableRefObject<PxContainer | null>
    workerClientRef: MutableRefObject<WorkerClient | null>
    setReadyToRender: (readyToRender: boolean) => void
}) => {
    // Refs
    const app = useApp()
    const prevRenderTextureRef = useRef<RenderTexture | null>(null)
    // State
    const readyToConnect = useStorageNodeState<'browser', 'readyToConnect'>(useStorage, nodeId, 'readyToConnect')
    const containerState = useStorageContainerState(useStorage, nodeId)
    const containerStateRef = useRef<ContainerState | null>(null)
    containerStateRef.current = containerState
    // Effects
    useEffect(() => {
        if (!readyToConnect) return
        // Create worker client
        workerClientRef.current = new WorkerClient(new RenderWorker(), {
            'rxFrameDamage': ({dirtyBitmap, dirtyRect}:{
                dirtyBitmap: ImageBitmap
                dirtyRect: ScreenState
            }) => {
                console.log('rxFrameDamage', dirtyRect, dirtyBitmap)
                // Clear container
                applicationContainerRef.current?.removeChildren()
                // You need to rearchitect this to use batch rendering
                const dirtyTexture = Texture.from(dirtyBitmap)
                const dirtySprite = Sprite.from(dirtyTexture)
                dirtySprite.position.x = dirtyRect.x
                dirtySprite.position.y = dirtyRect.y
                let mask = new Graphics()
                mask.beginFill(0x000000)
                mask.drawRect(0, 0, containerStateRef.current.width, containerStateRef.current.height)
                mask.endFill()
                dirtySprite.mask = mask
                if (prevRenderTextureRef.current) {
                    const prevScene = Sprite.from(prevRenderTextureRef.current)
                    applicationContainerRef.current?.addChild(prevScene)
                }                 
                applicationContainerRef.current?.addChild(dirtySprite)
                applicationContainerRef.current?.addChild(mask)
                if (applicationContainerRef.current){
                    prevRenderTextureRef.current = app.renderer.generateTexture(applicationContainerRef.current)
                }
                setReadyToRender(true)
                // Cleanup
                // dirtyTexture.destroy(true);
                // Run garbage collection
            }
        })

        // Initialize worker
        workerClientRef.current.sendMessage('initialize', {
            nodeId,
            serverUrl: `http://${import.meta.env.VITE_SERVER_HOST}:3000`,
        })
        return () => {
            setTimeout(() => {
                workerClientRef.current?.worker.terminate()
            }, 500)
        }
    }, [readyToConnect])
}
