import { ContainerState, useStorage } from "../../context/LiveblocksContext";

export const useStorageContainerState = (nodeId: string) => 
    useStorage(root => root.nodeMap.get(nodeId)?.state.containerState) as ContainerState