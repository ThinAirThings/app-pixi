
import { useEffect } from "react"
import { compositorWorkerClient } from "../../../views/Compositor/hooks/useInitializeCompositor"
import { ContainerState } from "@thinairthings/zoom-utils"


export const useCompositorNodeUpdateContainerState = (
    nodeId: string,
    containerState: ContainerState
) => {
    useEffect(() => {
        compositorWorkerClient.sendMessage("txContainerState", {
            nodeId,
            containerState
        })
    }, [containerState])
}