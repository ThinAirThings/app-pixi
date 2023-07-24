import { MutableRefObject } from "react"
import { useNodeSignal } from "../../../../hooks/useNodeSignal"
import { WorkerClient } from "@thinairthings/worker-client"

export const useNodeRxKeyboardInput = (
    nodeId: string,
    backbufferWorkerRef: MutableRefObject<WorkerClient>
) => {
    useNodeSignal<{
        type: 'keyDown'|'keyUp', 
        keyCode: string
    }>("worker", nodeId, 'rxKeyboardInput', ({
        type,
        keyCode
    }) => {
        backbufferWorkerRef.current?.sendMessage("txKeyboardInput", {
            type,
            keyCode
        })
    })
}