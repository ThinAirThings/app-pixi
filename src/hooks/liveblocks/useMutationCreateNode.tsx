import { createAirNode, useMutation } from "../../context/LiveblocksContext"

export const useMutationCreateNode = () => {
    return useMutation(({storage}, {type, state}: Parameters<typeof createAirNode>[0]) => {
        const node = createAirNode({type, state})
        storage.get("nodeMap").set(node.get("nodeId"), node)
    }, [])
}