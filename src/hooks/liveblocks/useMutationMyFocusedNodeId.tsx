import { useUpdateMyPresence } from "../../context/LiveblocksContext"

export const useMutationMyFocusedNodeId = () => {
    const updateMyPresence = useUpdateMyPresence()
    return (nodeId: string | null) => updateMyPresence({
        focusedNodeId: nodeId
    })
}