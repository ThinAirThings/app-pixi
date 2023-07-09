import { NodeTypeIndex } from "@thinairthings/liveblocks-model"
import { useStorage } from "../../context/LiveblocksContext"
import _isEqual from "lodash.isequal"
import { NodeComponentIndex } from "../../NodeComponentIndex"

type ComponentSpec = {
    type: keyof NodeTypeIndex
    nodeId: string
}
export const useStorageComponentsArray = (renderer: 'pixi' | 'dom') => {
    return useStorage(root => {
        return [...root.nodeMap]
        .filter(([_, nodeRef])=>NodeComponentIndex[nodeRef.type].renderer === renderer)
        .map(([nodeId, nodeRef]) => {
            return {
                type: nodeRef.type,
                nodeId
            }
        })
    }, (a: Array<ComponentSpec>, b: Array<ComponentSpec>) => {
        return _isEqual(a, b)
    })
}