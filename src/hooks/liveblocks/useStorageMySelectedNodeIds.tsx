import { useMyPresence, useSelf } from "../../context/LiveblocksContext"

export const useStorageMySelectedNodeIds = ()
: ReturnType<typeof useMyPresence>[0]['selectedNodeIds'] => {
    return useSelf(me=>me.presence.selectedNodeIds)
}