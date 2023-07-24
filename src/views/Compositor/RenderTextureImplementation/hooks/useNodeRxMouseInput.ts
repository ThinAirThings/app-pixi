import { MutableRefObject } from "react"
import { SocketioClient } from "@thinairthings/websocket-client"
import { useNodeSignal } from "../../../../hooks/useNodeSignal"

export const useNodeRxMouseInput = (
    nodeId: string,
    applicationBackendChannelRef: MutableRefObject<SocketioClient>
) => {
    useNodeSignal<{
        type: 'mouseDown'|'mouseUp'|'mouseMove'
        x: number, y: number
        button: 'left'|'right'
        clickCount: number
    }>("worker", nodeId, 'rxMouseInput', ({
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