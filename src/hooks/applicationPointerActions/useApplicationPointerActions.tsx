import { DisplayObject } from "pixi.js";
import { useViewportStateContext } from "../../context/SpaceContext";
import { useStorageMyFocusedNodeId } from "../liveblocks/useStorageMyFocusedNodeId";
import { MutableRefObject, useEffect, useRef } from "react";
import { fromEvent } from "rxjs";
import { WorkerClient } from "@thinairthings/worker-client";
import { MouseButton, mouseButton, updateClickCounter } from "@thinairthings/mouse-utils";
import { mouseEventToApplicationTranslation } from "@thinairthings/zoom-utils";
import { useStorageContainerState } from "@thinairthings/liveblocks-model";
import { useStorage } from "../../context/LiveblocksContext";

export const useApplicationPointerActions = (
    nodeId: string, 
    targetRef: HTMLElement | DisplayObject, 
    workerClientRef: MutableRefObject<WorkerClient | null>,
) => {
    // Refs
    const clickCounter = useRef({
        count: 0,
        timeout: null as NodeJS.Timeout | null
    })
    // State
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    const [viewportState] = useViewportStateContext()
    const containerState = useStorageContainerState(useStorage, nodeId)
    // Effects
    // PointerDown
    useEffect(() => {
        if (!targetRef) return
        const subscription = fromEvent<PointerEvent>(targetRef, 'pointerdown')
        .subscribe((event) => {
            if (!(myFocusedNodeId === nodeId)) return
            updateClickCounter(clickCounter.current)
            workerClientRef.current?.sendMessage('txMouseInput', {
                type: 'mouseDown',
                ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                button: mouseButton(event) === MouseButton.Left ? 'left' : 'right',
                clickCount: clickCounter.current.count
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId, viewportState, containerState])
    // PointerMove
    useEffect(() => {
        if (!targetRef) return
        const subscription = fromEvent<PointerEvent>(targetRef, 'pointermove')
        .subscribe((event) => {
            if (!(myFocusedNodeId === nodeId)) return
            workerClientRef.current?.sendMessage('txMouseInput', {
                type: 'mouseMove',
                ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                button: mouseButton(event) === MouseButton.Left ? 'left' : 'right',
                clickCount: 1
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId, viewportState, containerState])
    // PointerUp
    useEffect(() => {
        if (!targetRef) return
        const subscription = fromEvent<PointerEvent>(targetRef, 'pointerup')
        .subscribe((event) => {
            if (!(myFocusedNodeId === nodeId)) return
            workerClientRef.current?.sendMessage('txMouseInput', {
                type: 'mouseUp',
                ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                button: mouseButton(event) === MouseButton.Left ? 'left' : 'right',
                clickCount: 1
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId, viewportState, containerState])
    // PointerWheel
    useEffect(() => {
        if (!targetRef) return
        const subscription = fromEvent<WheelEvent>(targetRef, 'wheel')
        .subscribe((event) => {
            if (!(myFocusedNodeId === nodeId) || !(event.altKey)) return
            workerClientRef.current?.sendMessage('txMouseWheel', {
                ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                wheelX: -event.deltaX, wheelY: -event.deltaY
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId, viewportState, containerState])
}