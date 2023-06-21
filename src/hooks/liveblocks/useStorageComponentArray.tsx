import { useStorage } from "../../context/LiveblocksContext"
import { NodeTypeIndex } from "../../NodeComponentIndex"
import _isEqual from "lodash.isequal"

type ComponentSpec = {
    type: keyof NodeTypeIndex
    nodeId: string
}
export const useStorageComponentArray = () => {
    return useStorage(root => {
        return [...root.nodeMap].map(([nodeId, nodeRef]) => {
            return {
                type: nodeRef.type,
                nodeId
            }
        })
    }, (a: Array<ComponentSpec>, b: Array<ComponentSpec>) => {
        return _isEqual(a, b)
    })
}