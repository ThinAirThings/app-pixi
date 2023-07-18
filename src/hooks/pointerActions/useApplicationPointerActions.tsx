import { DisplayObject } from "pixi.js";
import { useViewportStateContext } from "../../context/SpaceContext";
import { useStorageMyFocusedNodeId } from "../liveblocks/useStorageMyFocusedNodeId";
import { MutableRefObject, useEffect, useRef } from "react";
import { fromEvent } from "rxjs";
import { WorkerClient } from "@thinairthings/worker-client";
import { MouseButton, mouseButton } from "@thinairthings/mouse-utils";
import { mouseEventToApplicationTranslation } from "@thinairthings/zoom-utils";
import { useStorageContainerState } from "@thinairthings/liveblocks-model";
import { useStorage } from "../../context/LiveblocksContext";

export const useApplicationPointerActions = (
    nodeId: string, 
    targetRef: HTMLElement | DisplayObject, 
    workerClientRef: MutableRefObject<WorkerClient | null>,
) => {
    // Refs
    const clickCount = useRef(0)
    const clickTimeout = useRef<NodeJS.Timeout | null>(null)
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
            runClickCounter(clickCount, clickTimeout)
            workerClientRef.current?.sendMessage('txMouseInput', {
                type: 'mouseDown',
                ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                button: mouseButton(event) === MouseButton.Left ? 'left' : 'right',
                clickCount: clickCount.current
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

const runClickCounter = (clickCount: MutableRefObject<number>, clickTimeout: MutableRefObject<NodeJS.Timeout | null>) => {
    clickCount.current++
    clearTimeout(clickTimeout.current!)
    clickTimeout.current = setTimeout(() => {
        clickCount.current = 0
    }, 500)
}