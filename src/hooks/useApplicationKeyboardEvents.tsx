import { MutableRefObject, useEffect } from "react"
import { WorkerClient } from "@thinairthings/worker-client"
import { fromEvent } from "rxjs"
import { useStorageMyFocusedNodeId } from "./liveblocks/useStorageMyFocusedNodeId"

export const useApplicationKeyboardEvents = (
    nodeId: string, 
    compositorNodePairWorkerClientRef: MutableRefObject<WorkerClient>,
) => {
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    // Key Down
    useEffect(() => {
        const subscription = fromEvent<KeyboardEvent>(window, "keydown").subscribe(async (event) => {
            if (myFocusedNodeId !== nodeId || event.metaKey) return
            event.key === "Tab" && event.preventDefault()
            // Handle paste from web platform clipboard to XServer
            if (event.ctrlKey && event.code === "KeyV"){
                event.preventDefault()
                compositorNodePairWorkerClientRef.current.sendMessage("txClipboardData", {
                    clipboardData: await navigator.clipboard.readText()
                })
                return
            }
            compositorNodePairWorkerClientRef.current.sendMessage('txKeyboardInput', {
                type: 'keyDown',
                code: event.code,
                keyCode: event.key,
                location: event.location,
            })

        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId])
    // Key Up
    useEffect(() => {
        const subscription = fromEvent<KeyboardEvent>(window, "keyup").subscribe((event) => {
            if (myFocusedNodeId !== nodeId || event.metaKey || (event.ctrlKey && event.code === "KeyV")) return
            // Note: The host OS owns the meta key. You should tell the user this when they try to copy/paste.
            // Print keycode, keydown
            event.key === "Tab" && event.preventDefault()
            compositorNodePairWorkerClientRef.current.sendMessage('txKeyboardInput', {
                type: 'keyUp',
                code: event.code,
                keyCode: event.key,
                location: event.location,
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId])
}