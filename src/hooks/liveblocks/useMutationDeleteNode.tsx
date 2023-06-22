import { useMutation } from "../../context/LiveblocksContext"

export const useMutationDeleteNode = () => {
    return useMutation(({storage}, nodeId: string) => {
        storage.get("nodeMap").delete(nodeId)
    }, [])
}