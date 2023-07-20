import { ContainerState } from "@thinairthings/zoom-utils";
import { Dispatch, SetStateAction } from "react";
import { useWorkerNodeSignal } from "../../hooks/useWorkerNodeSignal.worker";
import {RenderTexture} from "@pixi/webworker"

export const useNodeRxContainerState = (
    nodeId: string,
    applicationTexture: RenderTexture,
    setContainerState: Dispatch<SetStateAction<ContainerState>>
) => {
    useWorkerNodeSignal<{
        containerState: ContainerState
    }>(nodeId, 'rxContainerState', ({
        containerState
    }) => {
        applicationTexture.resize(containerState.width, containerState.height)
        setContainerState(containerState)
    })
}