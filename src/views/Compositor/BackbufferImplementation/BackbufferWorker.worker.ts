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
                jpegData: ArrayBuffer
            }) => {
                try {
                    const arrayBufferView = new Uint8Array(payload.jpegData)
                    const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
                    let dirtyBitmap = await createImageBitmap(blob)   // Decompression happens here
                    workerClient.sendMessage('txDirtyBitmap', {
                        dirtyBitmap,
                        dirtyRect: payload.dirtyRect
                    }, [dirtyBitmap])
                } catch (err) {
                    console.error(err)
                }
            },
            "rxCursorType": async (payload: {
                cursorType: string
            }) => {
                workerClient.sendMessage('txCursorType', payload)
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
    'rxWheelInput': ({
        x, y,
        wheelX, wheelY
    }: {
        x: number, y: number
        wheelX: number, wheelY: number
    }) => {
        ioClient?.sendMessage('txWheelInput', {
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