import { useApp } from "@pixi/react"
import { ScreenState } from "@thinairthings/zoom-utils"
import { useEffect, useRef } from "react"
import {RenderTexture, Sprite, Texture} from "@pixi/webworker"
import { SocketioClient } from "@thinairthings/websocket-client"

export const useApplicationBackendChannelRef = (
    nodeId: string,
    applicationTexture: RenderTexture
    
) => {
    // Refs
    const app = useApp()
    const applicationBackendChannelRef = useRef<SocketioClient>()

    useEffect(() => {
        // Create SocketioClient
        applicationBackendChannelRef.current = new SocketioClient( `http://${import.meta.env.VITE_SERVER_HOST}:3000/${nodeId}-webClient`, {
            'rxFrameDamage': async ({dirtyRect, frameBuffer}: {
                dirtyRect: ScreenState
                frameBuffer: ArrayBuffer
            }) => {
                try {
                    const arrayBufferView = new Uint8Array(frameBuffer)
                    const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
                    const dirtyBitmap = await createImageBitmap(blob)
                    const dirtyTexture = Texture.from(dirtyBitmap)
                    const dirtySprite = Sprite.from(dirtyTexture)
                    dirtySprite.position.x = dirtyRect.x
                    dirtySprite.position.y = dirtyRect.y
                    app.renderer.render(dirtySprite, {
                        renderTexture: applicationTexture,
                        clear: false,
                    })
                    // console.timeEnd('createTexture')
                    dirtyTexture.baseTexture.destroy()
                    dirtySprite.destroy()
                    dirtyBitmap.close()
                    // rerender()
                } catch (err) {
                    console.error(err)
                }
            }
        })
    }, [])
    return applicationBackendChannelRef
}