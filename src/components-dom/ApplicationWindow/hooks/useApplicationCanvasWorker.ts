import { useStorageContainerState, useStorageNodeState } from "@thinairthings/liveblocks-model";
import { WorkerClient } from "@thinairthings/worker-client";
import { MutableRefObject, useEffect, useRef } from "react";
import { useStorage } from "../../../context/LiveblocksContext";
import RenderWorker from "../renderWorker?worker"

export const useApplicationCanvasWorker = (
    nodeId: string, 
    canvasContainerRef: MutableRefObject<HTMLDivElement>
) => {
    // Refs
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const workerClientRef = useRef<WorkerClient | null>(null);
    // State
    const readyToConnect = useStorageNodeState<'browser', 'readyToConnect'>(
        useStorage, 
        nodeId, 
        'readyToConnect'
    )
    const containerState = useStorageContainerState(useStorage, nodeId)
    // Effects
    useEffect(() => {
        if (!readyToConnect) return;
        // Create Worker Client
        workerClientRef.current = new WorkerClient(new RenderWorker(), {})
        // Initialize Canvas
        canvasRef.current = document.createElement('canvas')
        canvasRef.current.width = containerState.width
        canvasRef.current.height = containerState.height
        canvasContainerRef.current.appendChild(canvasRef.current)
        const offscreenCanvasTransfer = canvasRef.current.transferControlToOffscreen()
        // Initialize Worker Client
        workerClientRef.current.sendMessage('initialize', {
            nodeId,
            serverUrl: `http://${import.meta.env.VITE_SERVER_HOST}:3000`,
            canvas: offscreenCanvasTransfer
        }, [offscreenCanvasTransfer])
        return () => {
            workerClientRef.current?.worker.terminate()
        }
    }, [readyToConnect])
    
    useEffect(() => {
        // You need to do some math here
        if (!canvasRef.current) return;
        workerClientRef.current.sendMessage('txResizeCanvas', {
            width: containerState.width,
            height: containerState.height
        })
    }, [containerState.width, containerState.height])
    return workerClientRef
}