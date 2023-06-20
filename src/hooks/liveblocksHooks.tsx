
import { ContainerState, createAirNode, useMutation, useMyPresence, useSelf, useStorage, useUpdateMyPresence } from "../context/LiveblocksContext"

// Presence

export const useMySelectedNodeIds = (): [
    ReturnType<typeof useMyPresence>[0]['selectedNodes'],
    (nodeId: string[]) => void
] => {
    const updateMyPresence = useUpdateMyPresence()
    return [
        useSelf(me=>me.presence.selectedNodes),
        (nodeIds: string[]) => updateMyPresence({
            selectedNodes: [...new Set(nodeIds)]
        })
    ]
}

export const useMyFocusedNodeId = (): [
    ReturnType<typeof useMyPresence>[0]['focusedNode'],
    (nodeId: string | null) => void
] => {
    const updateMyPresence = useUpdateMyPresence()
    return [
        useSelf(me=>me.presence.focusedNode),
        (nodeId: string | null) => updateMyPresence({
            focusedNode: nodeId
        })
    ]
}

export const useContainerState = (nodeId: string) => 
    useStorage(root => root.nodeMap.get(nodeId)?.state.containerState) as ContainerState


export const useCreateNode = () => {
    return useMutation(({storage}, {type, state}: Parameters<typeof createAirNode>[0]) => {
        const node = createAirNode({type, state})
        storage.get("nodeMap").set(node.get("nodeId"), node)
    }, [])
}
