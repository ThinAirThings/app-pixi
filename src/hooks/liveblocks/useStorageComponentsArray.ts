import { FilterNodeKeysByProperty, NodeDataTypeIndex } from "@thinairthings/liveblocks-model"
import { useStorage } from "../../context/LiveblocksContext"
import _isEqual from "lodash.isequal"

type ComponentSpec<T extends 'pixi' | 'dom'> = {
    key: FilterNodeKeysByProperty<{renderer: T}>
    nodeId: string
}
export const useStorageComponentsArray = <T extends 'pixi' | 'dom'>(renderer: T) => {
    return useStorage(root => {
        return [...root.nodeMap]
        .filter(([_, nodeRef])=>NodeDataTypeIndex[nodeRef.key].renderer === renderer)
        .map(([nodeId, nodeRef]) => {
            return {
                nodeId,
                key: nodeRef.key as FilterNodeKeysByProperty<{renderer: T}>
            }
        })
    }, (a: Array<ComponentSpec<T>>, b: Array<ComponentSpec<T>>) => {
        return _isEqual(a, b)
    })
}