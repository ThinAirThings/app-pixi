import { SocketioClient } from "@thinairthings/websocket-client"
import {WorkerClient} from "@thinairthings/worker-client"
import { ScreenState } from "@thinairthings/zoom-utils"

// Setup Messaging
let ioClient: SocketioClient
let canvasRef: OffscreenCanvas
new WorkerClient(self as unknown as Worker, {
    'initialize': async ({serverUrl, nodeId, canvas}: {
        serverUrl: string
        nodeId: string,
        canvas: OffscreenCanvas
    }) => {
        canvasRef = canvas
        const canvasCtx = canvas.getContext('2d')
        ioClient = new SocketioClient( `${serverUrl}/${nodeId}-webClient`, {
            'rxFrameDamage': async (payload: {
                dirtyRect: ScreenState
                frameBuffer: ArrayBuffer
            }) => {
                try {
                    const arrayBufferView = new Uint8Array(payload.frameBuffer)
                    const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
                    const dirtyBitmap = await createImageBitmap(blob)
                    canvasCtx?.drawImage(dirtyBitmap, payload.dirtyRect.x, payload.dirtyRect.y)
                } catch (err) {
                    console.error(err)
                }
            }
        }) 
    },
    'rxResizeCanvas': ({width, height}: {width: number, height: number}) => {
        canvasRef.width = width
        canvasRef.height = height
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