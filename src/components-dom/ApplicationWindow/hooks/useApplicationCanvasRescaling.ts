import { WorkerClient } from "@thinairthings/worker-client";
import { useViewportStateContext } from "../../../context/SpaceContext";
import { useStorageContainerState } from "@thinairthings/liveblocks-model";
import { useStorage } from "../../../context/LiveblocksContext";
import { useEffect } from "react";


export const useApplicationCanvasRescaling = (
    nodeId: string,
    workerClientRef: React.MutableRefObject<WorkerClient | null>,
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
) => {
    // State
    const [viewportState] = useViewportStateContext();
    const containerState = useStorageContainerState(useStorage, nodeId);
    // Effects
    useEffect(() => {
        if (!workerClientRef.current) return;
        // canvasRef.current.style.transform = `scale(${viewportState.scale})`
        workerClientRef.current.sendMessage('txRescaleCanvas', {
            containerScale: containerState.scale,
            viewportScale: viewportState.scale,
        })
    }, [viewportState.scale, containerState.scale])
}