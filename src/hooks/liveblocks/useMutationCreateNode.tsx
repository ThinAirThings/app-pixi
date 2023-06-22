import { createAirNode, useMutation } from "../../context/LiveblocksContext"

export const useMutationCreateNode = () => {
    return useMutation(({storage}, {type, state}: Parameters<typeof createAirNode>[0]) => {
        const node = createAirNode({type, state})
        const nodeId = node.get("nodeId")
        storage.get("nodeMap").set(nodeId, node)
        return nodeId
    }, [])
}