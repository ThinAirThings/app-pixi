import { useEffect } from "react"
import { useStorageMyFocusedNodeId } from "../../../hooks/liveblocks/useStorageMyFocusedNodeId"
import { WorkerClient } from "@thinairthings/worker-client"
import { fromEvent } from "rxjs"

export const useApplicationKeyboardEvents = (nodeId: string, {
    readyToRender,
    workerClientRef
}: {
    readyToRender: boolean
    workerClientRef: React.MutableRefObject<WorkerClient | null>
}) => {
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    // Key Down
    useEffect(() => {
        if (!readyToRender) return
        const subscription = fromEvent<KeyboardEvent>(window, "keydown").subscribe((event) => {
            if (myFocusedNodeId !== nodeId) return
            event.key === "Tab" && event.preventDefault()
            workerClientRef.current?.sendMessage('txKeyboardInput', {
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
        if (!readyToRender) return
        const subscription = fromEvent<KeyboardEvent>(window, "keyup").subscribe((event) => {
            if (myFocusedNodeId !== nodeId) return
            event.key === "Tab" && event.preventDefault()
            workerClientRef.current?.sendMessage('txKeyboardInput', {
                type: 'keyUp',
                code: event.code,
                keyCode: event.key,
                location: event.location,
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId])
}