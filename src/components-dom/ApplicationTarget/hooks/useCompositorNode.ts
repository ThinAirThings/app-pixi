import { useEffect, useRef, useState } from "react"
import { compositorMainThreadWorkerClient } from "../../../views/Compositor/hooks/useInitializeCompositor"
import { ContainerState } from "@thinairthings/zoom-utils"
import { WorkerClient } from "@thinairthings/worker-client"


export const useCompositorNode = (
    nodeId: string,
    containerState: ContainerState
) => {
    const [remoteCursorType, setRemoteCursorType] = useState<string>('default')
    const compositorNodePairWorkerClientRef = useRef<WorkerClient>()
    useEffect(() => {
        const messageChannel = new MessageChannel()
        compositorNodePairWorkerClientRef.current = new WorkerClient(messageChannel.port1, {
            "rxCursorType": (payload: {
                cursorType: string
            }) => {
                setRemoteCursorType(payload.cursorType)
            }
        })
        compositorMainThreadWorkerClient.sendMessage("txCreateNode", {
            nodeId,
            containerState,
            messagePort: messageChannel.port2
        }, [messageChannel.port2])
        return () => {
            compositorMainThreadWorkerClient.sendMessage("txDeleteNode", {
                nodeId
            })
            compositorNodePairWorkerClientRef.current.cleanup()
        }
    }, [])
    return {
        remoteCursorType,
        compositorNodePairWorkerClientRef
    }
}