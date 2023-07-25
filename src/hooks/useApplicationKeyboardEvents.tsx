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
        const subscription = fromEvent<KeyboardEvent>(window, "keydown").subscribe((event) => {
            if (myFocusedNodeId !== nodeId) return
            event.key === "Tab" && event.preventDefault()
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
            if (myFocusedNodeId !== nodeId) return
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