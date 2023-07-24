import { rxToTx } from "@thinairthings/worker-client"
import { useEffect } from "react"
import { fromEvent } from "rxjs"

export const sendNodeSignal = (
    env: 'main' | 'worker',
    targetNodeId: string,
    action: string,
    payload?: any,
) => {

    (env === "main"?window:self).dispatchEvent(new CustomEvent(`${targetNodeId}:${action}`, {
        detail: payload,
    }))
}
export const useNodeSignal = <T,>(
    env: 'main' | 'worker',
    nodeId: string, 
    action: string, 
    callback: (payload: T) => void,
) => {
    useEffect(() => {
        const subscription = fromEvent<CustomEvent>((env === "main"?window:self), `${nodeId}:${rxToTx(action)}`)
        .subscribe((messageEvent) => {
            callback(messageEvent.detail)
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [])
}