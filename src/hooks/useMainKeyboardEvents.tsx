import { useEffect } from "react"
import { fromEvent } from "rxjs"
import { useLanguageInterfaceActiveContext } from "../context/SpaceContext"
import { useStorageMyFocusedNodeId } from "./liveblocks/useStorageMyFocusedNodeId"
import { useMutationMySelectedNodeIds } from "./liveblocks/useMutationMySelectedNodeIds"
import { useMutationMyFocusedNodeId } from "./liveblocks/useMutationMyFocusedNodeId"
import { useStorageMySelectedNodeIds } from "./liveblocks/useStorageMySelectedNodeIds"
import { useMutationDeleteNode } from "./liveblocks/useMutationDeleteNode"


export const useMainKeyboardEvents = () => {
    // State
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    const mySelectedNodeIds = useStorageMySelectedNodeIds()
    const [languageInterfaceActive, setLanguageInterfaceActive] = useLanguageInterfaceActiveContext()

    // Mutations
    const updateMyFocusedNodeId = useMutationMyFocusedNodeId()
    const updateMySelectedNodeIds = useMutationMySelectedNodeIds()
    const deleteNode = useMutationDeleteNode()
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
                if (event.code === "Backspace"){
                    event.preventDefault()
                    mySelectedNodeIds.forEach(nodeId => deleteNode(nodeId))
                    updateMySelectedNodeIds([])
                }
            }
            if (event.key === "Escape"){
                event.preventDefault()
                updateMyFocusedNodeId(null)
                updateMySelectedNodeIds([])
                setLanguageInterfaceActive(false)
            }
        })
        return () => subscription.unsubscribe()
    }, [mySelectedNodeIds, myFocusedNodeId, languageInterfaceActive])
}
