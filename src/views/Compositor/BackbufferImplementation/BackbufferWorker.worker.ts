import { SocketioClient } from "@thinairthings/websocket-client"
import { WorkerClient } from "@thinairthings/worker-client"
import { ContainerState, ScreenState } from "@thinairthings/zoom-utils"

// Create a queue to hold bitmap updates
let queue: Array<{ dirtyBitmap: ImageBitmap, x: number, y: number }> = [];

// Backbuffer
let backbufferCanvas: OffscreenCanvas
let backbufferCanvasCtx: OffscreenCanvasRenderingContext2D
// Setup Messaging
let ioClient: SocketioClient
console.log("INITIALIZING BACKBUFFER WORKER")
// requestAnimationFrame(paint)
const workerClient = new WorkerClient(self as unknown as Worker, {
    'initialize': async ({serverUrl, nodeId, containerState}: {
        serverUrl: string
        nodeId: string,
        containerState: ContainerState
    }) => {
        // Setup Backbuffer
        backbufferCanvas = new OffscreenCanvas(containerState.width, containerState.height)
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
                    if (queue.length > 1 ) {
                        while(queue.length > 0) {
                            const { dirtyBitmap, x, y } = queue.shift()!
                            backbufferCanvasCtx.drawImage(dirtyBitmap, x, y);
                            dirtyBitmap.close()
                        }
                        const canvasCopy = new OffscreenCanvas(backbufferCanvas.width, backbufferCanvas.height)
                        const canvasCopyCtx = canvasCopy.getContext('2d')
                        canvasCopyCtx!.drawImage(backbufferCanvas, 0, 0)
                        const backbufferBitmap = canvasCopy.transferToImageBitmap()
                        workerClient.sendMessage('txBackbufferBitmap', {
                            backbufferBitmap
                        }, [backbufferBitmap])
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        }) 
    },
    'rxResizeBackbuffer': ({width, height}: {width: number, height: number}) => {
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