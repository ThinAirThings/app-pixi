import { DisplayObject } from "pixi.js";
import { useViewportStateContext } from "../../../context/SpaceContext";
import { useStorageMyFocusedNodeId } from "../../../hooks/liveblocks/useStorageMyFocusedNodeId";
import { MutableRefObject, useEffect } from "react";
import { fromEvent } from "rxjs";
import { WorkerClient } from "@thinairthings/worker-client";


export const useApplicationPointerEvents = (
    nodeId: string,
    targetRef: DisplayObject,
    workerClientRef: MutableRefObject<WorkerClient | null>
) => {
    // State
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    const [viewportState] = useViewportStateContext()

    // Effects
    useEffect(() => {
        const subscription = fromEvent<PointerEvent>(targetRef, 'pointerdown')
        .subscribe((event) => {
            if (!(myFocusedNodeId === nodeId)) return
            workerClientRef.current?.sendMessage('txMouseInput', {
                //  LEFT OFF HERE
            })
        })
        return () => subscription.unsubscribe()
    }, [])
}