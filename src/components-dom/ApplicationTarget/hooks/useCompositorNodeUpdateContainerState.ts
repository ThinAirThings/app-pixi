
import { useEffect } from "react"
import { compositorMainThreadWorkerClient } from "../../../views/Compositor/hooks/useInitializeCompositor"
import { ContainerState } from "@thinairthings/zoom-utils"


export const useCompositorNodeUpdateContainerState = (
    nodeId: string,
    containerState: ContainerState
) => {
    useEffect(() => {
        compositorMainThreadWorkerClient.sendMessage("txContainerState", {
            nodeId,
            containerState
        })
    }, [containerState])
}