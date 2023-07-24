import { MutableRefObject } from "react"
import { useNodeSignal } from "../../../../hooks/useNodeSignal"
import { WorkerClient } from "@thinairthings/worker-client"

export const useNodeRxWheelInput = (
    nodeId: string,
    backbufferWorkerRef: MutableRefObject<WorkerClient>
) => {
    useNodeSignal<{
        x: number, y: number
        wheelX: number, wheelY: number
    }>("worker", nodeId, 'rxWheelInput', ({
        x, y,
        wheelX, wheelY
    }) => {
        backbufferWorkerRef.current?.sendMessage("txWheelInput", {
            x, y,
            wheelX, wheelY
        })
    })
}