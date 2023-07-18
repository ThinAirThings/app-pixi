import { SocketioClient } from "@thinairthings/websocket-client"
import {WorkerClient} from "@thinairthings/worker-client"
import { ScreenState } from "@thinairthings/zoom-utils"

// Setup Messaging
let ioClient: SocketioClient
const workerClient = new WorkerClient(self as unknown as Worker, {
    'initialize': async ({serverUrl, nodeId}: {
        serverUrl: string
        nodeId: string,
    }) => {
        ioClient = new SocketioClient( `${serverUrl}/${nodeId}-webClient`, {
            'rxFrameDamage': async (payload: {
                dirtyRect: ScreenState
                frameBuffer: ArrayBuffer
            }) => {
                try {
                    const arrayBufferView = new Uint8Array(payload.frameBuffer)
                    const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
                    const dirtyBitmap = await createImageBitmap(blob)
                    workerClient.sendMessage('txFrameDamage', {dirtyBitmap, dirtyRect: payload.dirtyRect})                    
                } catch (err) {
                    console.error(err)
                }
            },
            "rxPageDetails": (payload: {
                pageTitle: string
                url: string
                faviconUrl: string
            }) => {
                workerClient.sendMessage('txPageDetails', payload)
            },
            'rxCursor': ({cursorType}: {cursorType: string}) => {
                workerClient.sendMessage('txCursor', {
                    cursorType
                })
            },
        }) 
    },
    'rxResize': ({width, height}: {width: number, height: number}) => {
        ioClient?.sendMessage('txResize', {
            width, height
        })
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
    "rxUrl": ({url}: {url: string}) => {
        ioClient?.sendMessage('txUrl', {
            url
        })
    },
    "rxReload": () => {
        ioClient?.sendMessage('txReload')
    },
    "rxGoBack": () => {
        ioClient?.sendMessage('txGoBack')
    },
    "rxGoForward": () => {
        ioClient?.sendMessage('txGoForward')
    },
    "rxBlur": () => {
        ioClient?.sendMessage('txBlur')
    },
    "rxDeleteBrowserNode": async ({nodeId}: {nodeId:string}) => {
        ioClient.sendMessage('txDeleteBrowserNode', {
            nodeId
        })
    },
    "rxScale": ({scale}: {scale: number}) => {
        ioClient.sendMessage('txScale', {
            scale
        })
    }
})