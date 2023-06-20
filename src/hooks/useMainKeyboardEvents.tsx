import { useEffect } from "react"
import { fromEvent } from "rxjs"
import { useMyFocusedNodeId, useMySelectedNodeIds } from "./liveblocksHooks"
import { useLanguageInterfaceActiveContext } from "../context/SpaceContext"


export const useMainKeyboardEvents = () => {
    // State
    const [myFocusedNodeId, setMyFocusedNodeId] = useMyFocusedNodeId()
    const [mySelectedNodeIds, setMySelectedNodeIds] = useMySelectedNodeIds()
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
                setMySelectedNodeIds([])
                setLanguageInterfaceActive(false)
            }
        })
        return () => subscription.unsubscribe()
    }, [])
}
