import { ContainerState } from "@thinairthings/zoom-utils";
import { Dispatch, SetStateAction } from "react";
import {RenderTexture} from "@pixi/webworker"
import { useNodeSignal } from "../../../../hooks/useNodeSignal";

export const useNodeRxContainerState = (
    nodeId: string,
    applicationTexture: RenderTexture,
    setContainerState: Dispatch<SetStateAction<ContainerState>>
) => {
    useNodeSignal<{
        containerState: ContainerState
    }>("worker", nodeId, 'rxContainerState', ({
        containerState
    }) => {
        applicationTexture.resize(containerState.width, containerState.height)
        setContainerState(containerState)
    })
}