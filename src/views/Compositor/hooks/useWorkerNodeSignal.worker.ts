import { rxToTx } from "@thinairthings/worker-client"
import { useEffect } from "react"
import { fromEvent } from "rxjs"

export const sendWorkerNodeSignal = (
    targetNodeId: string,
    action: string,
    payload?: any,
) => {
    self.dispatchEvent(new CustomEvent(`${targetNodeId}:${action}`, {
        detail: payload,
    }))
}
export const useWorkerNodeSignal = <T,>(
    nodeId: string, 
    action: string, 
    callback: (payload: T) => void,
) => {
    useEffect(() => {
        const subscription = fromEvent<CustomEvent>(self, `${nodeId}:${rxToTx(action)}`)
        .subscribe((messageEvent) => {
            callback(messageEvent.detail)
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [])
}