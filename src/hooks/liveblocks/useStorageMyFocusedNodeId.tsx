import { useMyPresence, useSelf } from "../../context/LiveblocksContext"

export const useStorageMyFocusedNodeId = ()
: ReturnType<typeof useMyPresence>[0]['focusedNode'] => {
    return useSelf(me=>me.presence.focusedNode)
}