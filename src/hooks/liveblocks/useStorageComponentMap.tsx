import { NodeTypeIndex } from "../../NodeComponentIndex"
import { useStorage } from "../../context/LiveblocksContext"
import _isEqual from "lodash.isequal"

export const useStorageComponentMap = () => {
    return useStorage(root => {
        return new Map<string, {type: keyof NodeTypeIndex, nodeId: string}>(
            [...root.nodeMap].map(([nodeId, nodeRef]) => [
                nodeId,
                {
                    type: nodeRef.type,
                    nodeId
                }
            ])
        )
    }, (a,b)=>_isEqual(a,b))
}