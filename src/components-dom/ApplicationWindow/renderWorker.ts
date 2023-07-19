import { SocketioClient } from "@thinairthings/websocket-client"
import {WorkerClient} from "@thinairthings/worker-client"
import { ScreenState } from "@thinairthings/zoom-utils"
import { request } from "http";

// Create a queue to hold bitmap updates
let queue: Array<{ dirtyBitmap: ImageBitmap, x: number, y: number }> = [];
let repaintNeeded = false
let containerScale = 1
let viewportScaleRef = 1
// Canvas Objects
let onScreenCanvas: OffscreenCanvas
let onScreenCanvasCtx: OffscreenCanvasRenderingContext2D
let backbufferCanvas: OffscreenCanvas
let backbufferCanvasCtx: OffscreenCanvasRenderingContext2D
// Setup Messaging
let ioClient: SocketioClient
let paintCount = 0
// Painting Loop
const paint = async () => {
    if (!repaintNeeded) {
        requestAnimationFrame(paint)
        return
    }
    repaintNeeded = false
    // Resize the on-screen canvas
    onScreenCanvas.width = Math.round(1/viewportScaleRef*backbufferCanvas.width)
    onScreenCanvas.height = Math.round(1/viewportScaleRef*backbufferCanvas.height)
    // Create downscaled bitmap
    const scaledBitmap = await createImageBitmap(backbufferCanvas, {
        resizeWidth: Math.round(backbufferCanvas.width * 1/viewportScaleRef),
        resizeHeight: Math.round(backbufferCanvas.height * 1/viewportScaleRef),
        resizeQuality: 'low'
    })
    console.log('scaledBitmap', scaledBitmap.width, scaledBitmap.height)
    // Draw the downscaled bitmap
    onScreenCanvasCtx.drawImage(scaledBitmap, 0, 0)
    scaledBitmap.close()
    if (paintCount > 300) {
        return
    }
    paintCount++
    requestAnimationFrame(paint)
}
// paint()  // Not running right now
// requestAnimationFrame(paint)
new WorkerClient(self as unknown as Worker, {
    'initialize': async ({serverUrl, nodeId, canvas}: {
        serverUrl: string
        nodeId: string,
        canvas: OffscreenCanvas
    }) => {
        onScreenCanvas = canvas
        onScreenCanvasCtx = onScreenCanvas.getContext('2d')
        backbufferCanvas = new OffscreenCanvas(canvas.width, canvas.height)
        backbufferCanvasCtx = backbufferCanvas.getContext('2d')!
        ioClient = new SocketioClient( `${serverUrl}/${nodeId}-webClient`, {
            'rxFrameDamage': async (payload: {
                dirtyRect: ScreenState
                frameBuffer: ArrayBuffer
            }) => {
                try {
                    const arrayBufferView = new Uint8Array(payload.frameBuffer)
                    const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
                    const dirtyBitmap = await createImageBitmap(blob)
                    queue.push({
                        dirtyBitmap,
                        x: payload.dirtyRect.x,
                        y: payload.dirtyRect.y
                    })
                    if (queue.length > 1 
                        // && 1/viewportScaleRef > 0.7
                    ) {
                        requestAnimationFrame(() => {
                            // if (repaintNeeded){
                            //     onScreenCanvasCtx.drawImage(backbufferCanvas, 0, 0)
                            // }
                            // repaintNeeded = false
                            while(queue.length > 0) {
                                const { dirtyBitmap, x, y } = queue.shift()!
                                onScreenCanvasCtx.drawImage(dirtyBitmap, x, y);
                                backbufferCanvasCtx.drawImage(dirtyBitmap, x, y)
                                dirtyBitmap.close()
                            }
                        })
                    }
                    // if (1/viewportScaleRef < 0.7) {
                    //     while(queue.length > 0){
                    //         const { dirtyBitmap, x, y } = queue.shift()!
                    //         backbufferCanvasCtx.drawImage(dirtyBitmap, x, y)
                    //         dirtyBitmap.close()
                    //     }
                    //     repaintNeeded = true
                    // }
                    // backbufferCanvasCtx.drawImage(dirtyBitmap, payload.dirtyRect.x, payload.dirtyRect.y);
                    // dirtyBitmap.close()
                    // repaintNeeded = true
                } catch (err) {
                    console.error(err)
                }
            }
        }) 
    },
    'rxRescaleCanvas': ({viewportScale, containerScale}: {containerScale: number, viewportScale: number}) => {
        viewportScaleRef = viewportScale
    },
    'rxResizeCanvas': ({width, height}: {width: number, height: number}) => {
        backbufferCanvas.width = width
        backbufferCanvas.height = height
    },
    'rxMouseInput': ({
        type,
        x, y,
        button,
        clickCount
    }: {
        type: 'mouseDown'|'mouseUp'|'mouseMove'
        x: number, y: number
        button: 'left'|'right'|'middle'
        clickCount: number
    }) => {
        ioClient?.sendMessage('txMouseInput', {
            type,
            x: Math.round(x), y: Math.round(y),
            button,
            clickCount
        })
    },
    'rxMouseWheel': ({
        x, y,
        wheelX, wheelY
    }: {
        x: number, y: number
        wheelX: number, wheelY: number
    }) => {
        ioClient?.sendMessage('txMouseWheel', {
            x, y,
            wheelX, wheelY
        })
    },
    'rxKeyboardInput': ({
        type, keyCode
    }: {type: 'keyDown'|'keyUp', keyCode: string}) => {
        ioClient?.sendMessage('txKeyboardInput', {
            type, keyCode
        })
    },
})