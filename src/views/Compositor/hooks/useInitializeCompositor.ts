import { useEffect, useState } from "react"
import { useRerender } from "../../../hooks/useRerender"
import { WorkerClient } from "@thinairthings/worker-client"
import CompositorWorker from "../worker/Compositor.worker?worker"

export let compositorMainThreadWorkerClient: WorkerClient
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
        compositorMainThreadWorkerClient = new WorkerClient(new CompositorWorker(), {})
        // Create Canvas
        const compositorCanvas = document.createElement("canvas")
        compositorCanvas.width = compositorDiv.clientWidth
        compositorCanvas.height = compositorDiv.clientHeight
        compositorDiv.appendChild(compositorCanvas)
        const offscreenCanvasTransfer = compositorCanvas.transferControlToOffscreen()
        compositorMainThreadWorkerClient.sendMessage('initialize', {
            compositorCanvas: offscreenCanvasTransfer,
        }, [offscreenCanvasTransfer])
        // Initialize Resize Observer
        const resizeObserver = new ResizeObserver(() => {
            compositorMainThreadWorkerClient.sendMessage('txScreenSize', {
                width: compositorDiv.clientWidth,
                height: compositorDiv.clientHeight,
            })
        })
        resizeObserver.observe(compositorDiv)
        // Set Compositor Ready
        setCompositorReady(true)
        return () => {
            compositorCanvas.remove()
            compositorMainThreadWorkerClient.cleanup()
            resizeObserver.disconnect()
            setCompositorReady(false)
        }
    }, [compositorDiv])
    return compositorReady
}