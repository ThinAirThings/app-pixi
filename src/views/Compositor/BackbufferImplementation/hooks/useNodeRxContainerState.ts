import { ContainerState } from "@thinairthings/zoom-utils";
import { useWorkerNodeSignal } from "../../hooks/useWorkerNodeSignal.worker";
import { Dispatch, SetStateAction } from "react";


export const useNodeRxContainerState = (
    nodeId: string,
    setContainerState: Dispatch<SetStateAction<ContainerState>>
) => {
    useWorkerNodeSignal<{
        containerState: ContainerState
    }>(nodeId, 'rxContainerState', ({
        containerState
    }) => {
        setContainerState(containerState)
    })
}