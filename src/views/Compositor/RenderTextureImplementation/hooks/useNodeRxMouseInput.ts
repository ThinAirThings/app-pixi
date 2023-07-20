import { MutableRefObject } from "react"
import { useWorkerNodeSignal } from "../../hooks/useWorkerNodeSignal.worker"
import { SocketioClient } from "@thinairthings/websocket-client"

export const useNodeRxMouseInput = (
    nodeId: string,
    applicationBackendChannelRef: MutableRefObject<SocketioClient>
) => {
    useWorkerNodeSignal<{
        type: 'mouseDown'|'mouseUp'|'mouseMove'
        x: number, y: number
        button: 'left'|'right'
        clickCount: number
    }>(nodeId, 'rxMouseInput', ({
        type,
        x, y,
        button,
        clickCount,
    }) => {
        applicationBackendChannelRef.current?.sendMessage("txMouseInput", {
            type,
            x, y,
            button,
            clickCount,
        })
    })
}