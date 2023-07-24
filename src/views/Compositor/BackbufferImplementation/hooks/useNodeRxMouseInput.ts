import { MutableRefObject } from "react"
import { useNodeSignal } from "../../../../hooks/useNodeSignal"
import { WorkerClient } from "@thinairthings/worker-client"

export const useNodeRxMouseInput = (
    nodeId: string,
    backbufferWorkerRef: MutableRefObject<WorkerClient>
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
        backbufferWorkerRef.current?.sendMessage("txMouseInput", {
            type,
            x, y,
            button,
            clickCount,
        })
    })
}