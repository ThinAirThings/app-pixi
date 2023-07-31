import { ContainerState } from "@thinairthings/zoom-utils";
import { useNodeSignal } from "../../../../../hooks/useNodeSignal";
import { Dispatch, SetStateAction } from "react";

export const useNodeRxContainerState = (
    nodeId: string,
    setContainerState: Dispatch<SetStateAction<ContainerState>>,
) => {
    useNodeSignal<{
        containerState: ContainerState
    }>("worker", nodeId, 'rxContainerState', ({
        containerState
    }) => {
        setContainerState(containerState)
    })
}