import { useEffect } from "react"
import { WorkerClient } from "@thinairthings/worker-client"
import { fromEvent } from "rxjs"
import { useStorageMyFocusedNodeId } from "./liveblocks/useStorageMyFocusedNodeId"

export const useApplicationKeyboardEvents = (
    nodeId: string, 
    workerClient: WorkerClient
) => {
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    // Key Down
    useEffect(() => {
        const subscription = fromEvent<KeyboardEvent>(window, "keydown").subscribe((event) => {
            if (myFocusedNodeId !== nodeId) return
            event.key === "Tab" && event.preventDefault()
            workerClient.sendMessage('txKeyboardInput', {
                nodeId,
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
            workerClient.sendMessage('txKeyboardInput', {
                nodeId,
                type: 'keyUp',
                code: event.code,
                keyCode: event.key,
                location: event.location,
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId])
}