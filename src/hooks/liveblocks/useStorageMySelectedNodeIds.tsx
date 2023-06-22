import { useMyPresence, useSelf } from "../../context/LiveblocksContext"

export const useStorageMySelectedNodeIds = ()
: ReturnType<typeof useMyPresence>[0]['selectedNodes'] => {
    return useSelf(me=>me.presence.selectedNodes)
}