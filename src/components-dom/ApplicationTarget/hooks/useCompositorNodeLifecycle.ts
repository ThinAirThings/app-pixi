import { useEffect } from "react"
import { compositorWorkerClient } from "../../../views/Compositor/hooks/useInitializeCompositor"
import { ContainerState } from "@thinairthings/zoom-utils"


export const useCompositorNodeLifecycle = (
    nodeId: string,
    containerState: ContainerState
) => {
    useEffect(() => {
        compositorWorkerClient.sendMessage("txCreateNode", {
            nodeId,
            containerState
        })
        return () => {
            compositorWorkerClient.sendMessage("txDeleteNode", {
                nodeId
            })
        }
    }, [])
}