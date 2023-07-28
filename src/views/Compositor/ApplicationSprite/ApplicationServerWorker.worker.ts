import { SocketioClient } from "@thinairthings/websocket-client"
import { WorkerClient } from "@thinairthings/worker-client"
import { ContainerState, ScreenState } from "@thinairthings/zoom-utils"

// Create a queue to hold bitmap updates
let queue: Array<{ 
    dirtyBitmap: ImageBitmap, 
    dirtyRect: ScreenState,
}> = [];

// Backbuffer
let backbufferCanvas: OffscreenCanvas
let backbufferCanvasCtx: OffscreenCanvasRenderingContext2D
// Setup Messaging
let applicationServerIoClient: SocketioClient
let mainThreadNodePairWorkerClient: WorkerClient

const applicationServerWorkerClient = new WorkerClient(self as unknown as Worker, {
    'initialize': async ({serverUrl, nodeId, containerState, mainThreadPairMessagePort}: {
        serverUrl: string
        nodeId: string,
        containerState: ContainerState
        mainThreadPairMessagePort: MessagePort
    }) => {
        // Setup Backbuffer
        backbufferCanvas = new OffscreenCanvas(containerState.width, containerState.height)
        backbufferCanvasCtx = backbufferCanvas.getContext('2d')!
        applicationServerIoClient = new SocketioClient( `${serverUrl}/${nodeId}-webClient`, {
            'rxFrameDamage': async (payload: {
                dirtyRect: ScreenState
                jpegData: ArrayBuffer
            }) => {
                try {
                    const arrayBufferView = new Uint8Array(payload.jpegData)
                    const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
                    let dirtyBitmap = await createImageBitmap(blob)   // Decompression happens here
                    applicationServerWorkerClient.sendMessage('txFrameDamage', {
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
                mainThreadNodePairWorkerClient.sendMessage('txCursorType', payload)
            },
            "rxCreatePopupWindow": async (payload: {
                pixmapId: number
                screenState: ScreenState
            }) => {
                applicationServerWorkerClient.sendMessage('txCreatePopupWindow', payload)
                mainThreadNodePairWorkerClient.sendMessage('txCreatePopupWindow', payload)
                applicationServerIoClient.sendMessage('txPopupWindowReady', {})
            },
            "rxDeletePopupWindow": async (payload: {
                pixmapId: number
            }) => {
                applicationServerWorkerClient.sendMessage('txDeletePopupWindow', payload)
                mainThreadNodePairWorkerClient.sendMessage('txDeletePopupWindow', payload)
            },
            "rxPopupDamage": async (payload: {
                pixmapId: number
                dirtyRect: ScreenState
                jpegData: ArrayBuffer
            }) => {
                try {
                    const arrayBufferView = new Uint8Array(payload.jpegData)
                    const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
                    let dirtyBitmap = await createImageBitmap(blob)   // Decompression happens here
                    applicationServerWorkerClient.sendMessage('txPopupDamage', {
                        pixmapId: payload.pixmapId,
                        dirtyBitmap,
                        dirtyRect: payload.dirtyRect
                    }, [dirtyBitmap])
                } catch (err) {
                    console.error(err)
                }
            }
        })
        mainThreadNodePairWorkerClient = new WorkerClient(mainThreadPairMessagePort, {
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
                applicationServerIoClient?.sendMessage('txMouseInput', {
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
                applicationServerIoClient?.sendMessage('txWheelInput', {
                    x, y,
                    wheelX, wheelY
                })
            },
            'rxKeyboardInput': ({
                type, keyCode
            }: {type: 'keyDown'|'keyUp', keyCode: string}) => {
                applicationServerIoClient?.sendMessage('txKeyboardInput', {
                    type, keyCode
                })
            },
        })
    },
    'rxResizeBackbuffer': ({width, height}: {width: number, height: number}) => {
        backbufferCanvas.width = width
        backbufferCanvas.height = height
    }
})