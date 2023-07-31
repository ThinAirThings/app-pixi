import { WorkerClient } from "@thinairthings/worker-client"
import { DisplayObject } from "pixi.js"
import {  MutableRefObject, useEffect, useRef } from "react"
import { useStorageMyFocusedNodeId } from "./liveblocks/useStorageMyFocusedNodeId"
import { useViewportStateContext } from "../context/SpaceContext"
import { useStorageContainerState } from "@thinairthings/liveblocks-model"
import { useStorage } from "../context/LiveblocksContext"
import { fromEvent, takeUntil } from "rxjs"
import { MouseButton, mouseButton, mousePoint, updateClickCounter } from "@thinairthings/mouse-utils"
import { mouseEventToApplicationTranslation } from "@thinairthings/zoom-utils"
import { useRerender } from "@thinairthings/react-utils"

export const useApplicationTargetPointerActions = (
    nodeId: string, 
    targetRef: HTMLElement | DisplayObject, 
    compositorNodePairWorkerClientRef: MutableRefObject<WorkerClient>,
) => {
    // Refs
    const clickCounter = useRef({
        count: 0,
        timeout: null as NodeJS.Timeout | null
    })
    const pointerIsDownRef = useRef(false)
    // State
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    const [viewportState] = useViewportStateContext()
    const containerState = useStorageContainerState(useStorage, nodeId)
    // Effects
    const rerender = useRerender()
    // PointerDown
    useEffect(() => {
        if (!targetRef) {
            rerender()
            return
        }
        const subscription = fromEvent<PointerEvent>(targetRef, 'pointerdown')
        .subscribe((event) => {
            if (!(myFocusedNodeId === nodeId)) return
            updateClickCounter(clickCounter.current)
            const pointerDownPoint = mousePoint(event)
            document.body.setPointerCapture(event.pointerId)
            const buttonDown = mouseButton(event)
            pointerIsDownRef.current = true
            let ignoreRightClick = false
            if (buttonDown === MouseButton.Left) {
                // If left click, send message to worker immediately
                compositorNodePairWorkerClientRef.current.sendMessage('txMouseInput', {
                    type: 'mouseDown',
                    ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                    button: 'left',
                    clickCount: clickCounter.current.count
                })
            }
            // Pointer Move
            fromEvent<PointerEvent>(document.body, 'pointermove')
            .pipe(
                takeUntil(fromEvent<PointerEvent, void>(document.body, 'pointerup', {}, (event) => {
                    document.body.releasePointerCapture(event.pointerId)
                    if (!ignoreRightClick && mouseButton(event) === MouseButton.Right){
                        compositorNodePairWorkerClientRef.current.sendMessage('txMouseInput', {
                            type: 'mouseDown',
                            ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                            button: 'right',
                            clickCount: clickCounter.current.count
                        })
                    }
                    pointerIsDownRef.current = false
                    compositorNodePairWorkerClientRef.current.sendMessage('txMouseInput', {
                        type: 'mouseUp',
                        ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                        button: mouseButton(event) === MouseButton.Left ? 'left' : 'right',
                        clickCount: clickCounter.current.count
                    })
                }))
            )
            .subscribe((event) => {
                const pointerMovePoint = mousePoint(event)
                const distance = Math.sqrt(
                    Math.pow(pointerMovePoint.x - pointerDownPoint.x, 2) +
                    Math.pow(pointerMovePoint.y - pointerDownPoint.y, 2)
                )
                if (distance > 5) ignoreRightClick = true
                compositorNodePairWorkerClientRef.current.sendMessage('txMouseInput', {
                    type: 'mouseMove',
                    ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                    button: mouseButton(event) === MouseButton.Left ? 'left' : 'right',
                    clickCount: 1
                })
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId, viewportState, containerState, targetRef])
    // Pointer (Hover Control)
    useEffect(() => {
        if (!targetRef) {
            rerender()
            return
        }
        const subscription = fromEvent<PointerEvent>(targetRef, 'pointermove')
        .subscribe((event) => {
            if (!(myFocusedNodeId === nodeId) || pointerIsDownRef.current) return
            compositorNodePairWorkerClientRef.current.sendMessage('txMouseInput', {
                type: 'mouseMove',
                ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                button: mouseButton(event) === MouseButton.Left ? 'left' : 'right',
                clickCount: 1
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId, viewportState, containerState, targetRef])
    // PointerWheel
    useEffect(() => {
        if (!targetRef) {
            rerender()
            return
        }
        const subscription = fromEvent<WheelEvent>(targetRef, 'wheel')
        .subscribe((event) => {
            if (!(myFocusedNodeId === nodeId) || !(event.altKey)) return
            compositorNodePairWorkerClientRef.current.sendMessage('txWheelInput', {
                nodeId,
                ...mouseEventToApplicationTranslation(event, viewportState, containerState),
                wheelX: -event.deltaX, wheelY: -event.deltaY
            })
        })
        return () => subscription.unsubscribe()
    }, [myFocusedNodeId, viewportState, containerState, targetRef])
}