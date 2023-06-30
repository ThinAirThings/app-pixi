import { useMyPresence, useSelf } from "../../context/LiveblocksContext"

export const useStorageMyFocusedNodeId = ()
: ReturnType<typeof useMyPresence>[0]['focusedNodeId'] => {
    return useSelf(me=>me.presence.focusedNodeId)
}