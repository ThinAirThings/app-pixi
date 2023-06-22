import { useEffect } from "react"
import { fromEvent } from "rxjs"
import { useLanguageInterfaceActiveContext } from "../context/SpaceContext"
import { useStorageMyFocusedNodeId } from "./liveblocks/useStorageMyFocusedNodeId"
import { useMutationMySelectedNodeIds } from "./liveblocks/useMutationMySelectedNodeIds"
import { useMutationMyFocusedNodeId } from "./liveblocks/useMutationMyFocusedNodeId"


export const useMainKeyboardEvents = () => {
    // State
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    const setMyFocusedNodeId = useMutationMyFocusedNodeId()
    const updateMySelectedNodeIds = useMutationMySelectedNodeIds()
    const [languageInterfaceActive, setLanguageInterfaceActive] = useLanguageInterfaceActiveContext()
    useEffect(() => {
        const subscription = fromEvent<KeyboardEvent>(window, "keydown")
        .subscribe((event) => {
            // Check for input focus
            if (
                !myFocusedNodeId    // No focused node
                && document.activeElement?.tagName.toLowerCase() !== 'input'     // No focused input
                && document.activeElement?.tagName.toLowerCase() !== 'textarea' // No focused textarea
            ){
                if (event.code === "Space"){
                    event.preventDefault()
                    setLanguageInterfaceActive(true)
                }
            }
            if (event.key === "Escape"){
                event.preventDefault()
                setMyFocusedNodeId(null)
                updateMySelectedNodeIds([])
                setLanguageInterfaceActive(false)
            }
        })
        return () => subscription.unsubscribe()
    }, [])
}
