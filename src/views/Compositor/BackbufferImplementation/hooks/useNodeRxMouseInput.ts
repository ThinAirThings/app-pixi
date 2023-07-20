import { MutableRefObject } from "react"
import { useWorkerNodeSignal } from "../../hooks/useWorkerNodeSignal.worker"
import { WorkerClient } from "@thinairthings/worker-client"

export const useNodeRxMouseInput = (
    nodeId: string,
    backbufferWorkerRef: MutableRefObject<WorkerClient>
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
        backbufferWorkerRef.current?.sendMessage("txMouseInput", {
            type,
            x, y,
            button,
            clickCount,
        })
    })
}