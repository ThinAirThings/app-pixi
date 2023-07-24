import { useEffect, useState } from "react"
import { useRerender } from "../../../hooks/useRerender"
import { WorkerClient } from "@thinairthings/worker-client"
import CompositorWorker from "../Compositor.worker?worker"
import { sendNodeSignal } from "../../../hooks/useNodeSignal"

export let compositorWorkerClient: WorkerClient
export const useInitializeCompositor = (
    compositorDiv: HTMLDivElement | null
) => {
    // State
    const [compositorReady, setCompositorReady] = useState(false)
    // Special Hooks
    const rerender = useRerender()
    useEffect(() => {
        if (!compositorDiv) {
            rerender()
            return
        }
        // Create Worker
        compositorWorkerClient = new WorkerClient(new CompositorWorker(), {
            "rxCursorType": (payload: {
                nodeId: string
                cursorType: string
            }) => {
               sendNodeSignal('main', payload.nodeId, 'txCursorType', {
                     cursorType: payload.cursorType
               })
            }
        })
        // Create Canvas
        const compositorCanvas = document.createElement("canvas")
        compositorCanvas.width = compositorDiv.clientWidth
        compositorCanvas.height = compositorDiv.clientHeight
        compositorDiv.appendChild(compositorCanvas)
        const offscreenCanvasTransfer = compositorCanvas.transferControlToOffscreen()
        compositorWorkerClient.sendMessage('initialize', {
            compositorCanvas: offscreenCanvasTransfer,
        }, [offscreenCanvasTransfer])
        // Initialize Resize Observer
        const resizeObserver = new ResizeObserver(() => {
            compositorWorkerClient.sendMessage('txScreenSize', {
                width: compositorDiv.clientWidth,
                height: compositorDiv.clientHeight,
            })
        })
        resizeObserver.observe(compositorDiv)
        // Set Compositor Ready
        setCompositorReady(true)
        return () => {
            compositorCanvas.remove()
            compositorWorkerClient.cleanup()
            resizeObserver.disconnect()
            setCompositorReady(false)
        }
    }, [compositorDiv])
    return compositorReady
}