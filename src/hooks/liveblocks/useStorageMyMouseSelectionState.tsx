import { useMyPresence, useSelf } from "../../context/LiveblocksContext"

export const useStorageMyMouseSelectionState = ()
: ReturnType<typeof useMyPresence>[0]['mouseSelectionState'] => {
    return useSelf(me=>me.presence.mouseSelectionState)
}