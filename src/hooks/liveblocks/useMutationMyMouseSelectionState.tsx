import { useMyPresence, useUpdateMyPresence } from "../../context/LiveblocksContext"


export const useMutationMyMouseSelectionState = () => {
    const updateMyPresence = useUpdateMyPresence()
    return (mouseSelectionState: ReturnType<typeof useMyPresence>[0]['mouseSelectionState']) => {
        updateMyPresence({mouseSelectionState}, {addToHistory: false})
    }
}