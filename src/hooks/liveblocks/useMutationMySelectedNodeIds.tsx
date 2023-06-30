import { useUpdateMyPresence } from "../../context/LiveblocksContext"


export const useMutationMySelectedNodeIds = () => {
    const updateMyPresence = useUpdateMyPresence()
    return (nodeIds: string[]) => updateMyPresence({
        selectedNodeIds: [...new Set(nodeIds)]
    })
}