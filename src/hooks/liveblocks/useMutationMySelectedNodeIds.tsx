import { useUpdateMyPresence } from "../../context/LiveblocksContext"


export const useMutationMySelectedNodeIds = () => {
    const updateMyPresence = useUpdateMyPresence()
    return (nodeIds: string[]) => updateMyPresence({
        selectedNodes: [...new Set(nodeIds)]
    })
}