import { ContainerState } from "@thinairthings/zoom-utils"
import { useStorage } from "../../context/LiveblocksContext"
import _isEqual from "lodash.isequal"

export const useStorageContainerStateMap = (nodeIds?: string[]): Map<string, ContainerState> => {
    return useStorage(root => {
        return new Map([...root.nodeMap].filter(([nodeId]) => nodeIds ? nodeIds.includes(nodeId) : true)
            .map(([nodeId, node]) => ([nodeId, node.state.containerState]))
        )
    }
    , (a,b)=>_isEqual(a,b)
    )
}