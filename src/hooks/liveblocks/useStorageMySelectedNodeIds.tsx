import { useMyPresence, useSelf, useUpdateMyPresence } from "../../context/LiveblocksContext"

export const useStorageMySelectedNodeIds = ()
: ReturnType<typeof useMyPresence>[0]['selectedNodes'] => {
    return useSelf(me=>me.presence.selectedNodes)
}