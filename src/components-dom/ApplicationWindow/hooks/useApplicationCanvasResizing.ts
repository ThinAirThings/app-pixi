import { WorkerClient } from "@thinairthings/worker-client";
import { useStorageContainerState } from "@thinairthings/liveblocks-model";
import { useStorage } from "../../../context/LiveblocksContext";
import { useEffect } from "react";


export const useApplicationCanvasResizing = (
    nodeId: string,
    workerClientRef: React.MutableRefObject<WorkerClient | null>,
) => {
    // State
    const containerState = useStorageContainerState(useStorage, nodeId);
    // Effects
    useEffect(() => {
        if (!workerClientRef.current) return;
        workerClientRef.current.sendMessage('txResizeCanvas', {
            width: containerState.width,
            height: containerState.height
        })
    }, [containerState.width, containerState.height])
}