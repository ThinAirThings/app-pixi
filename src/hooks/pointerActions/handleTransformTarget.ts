import { ContainerState, Point, ScreenState, ViewportState, getSelectionBoundingBox, screenLengthToAbsoluteLength, screenStateToAbsoluteState } from "@thinairthings/zoom-utils"
import { TxPxContainer } from "../../components-pixi/_ext/MixinThinAirTargetingDataset"
import { useStorageContainerStateMap } from "../liveblocks/useStorageContainerStateMap"
import { useMutationContainerState } from "../liveblocks/useMutationContainerState"
import { mousePoint } from "@thinairthings/mouse-utils"
import { fromEvent, takeUntil } from "rxjs"
import { useMutationMyMouseSelectionState } from "../liveblocks/useMutationMyMouseSelectionState"
import { useHistory } from "../../context/LiveblocksContext"


export const handleTransformTarget = (event: PointerEvent, {
    viewportState,
    initialSelectedContainerStatesMap,
    updateContainerState,
    historyControl
} : {
    viewportState: ViewportState
    initialSelectedContainerStatesMap: ReturnType<typeof useStorageContainerStateMap>
    updateContainerState: ReturnType<typeof useMutationContainerState>
    historyControl: ReturnType<typeof useHistory>
}) => {
    // Get target
    const target = event.target as TxPxContainer
    const transformTargetType = target.dataset.transformtargettype
    
    // Get initial bounding box state
    const initialBoundingBoxState = getSelectionBoundingBox(viewportState, initialSelectedContainerStatesMap)
    const pointerDownPoint = mousePoint(event) // Get Initial Pointer Position

    document.body.setPointerCapture(event.pointerId)
    // Pause History
    historyControl.pause()
    // Pointer Move
    fromEvent<PointerEvent>(document.body, 'pointermove')
    .pipe(
        takeUntil(fromEvent<PointerEvent, void>(document.body, 'pointerup', {}, (event) => {
            document.body.releasePointerCapture(event.pointerId)
            // Resume History
            historyControl.resume()
        }))
    )
    .subscribe((event) => {
        const pointerMovePoint = mousePoint(event);
        // Get new bounding box state
        const finalBoundingBoxState = getNewBoundingBoxState(transformTargetType!, {
            initialBoundingBoxState,
            pointerDownPoint,
            pointerMovePoint
        });
        // GOOD UP TO HERE!!!
        // Update Container States
        [...initialSelectedContainerStatesMap].forEach(([nodeId, containerState]) => {
            updateContainerState(nodeId, applyTransformation(
                viewportState,
                initialBoundingBoxState,
                finalBoundingBoxState,
                containerState
            ))
        })
    })
}

const applyTransformation = (
    viewportState: ViewportState,
    initialScreenBoundingBoxState: ScreenState, 
    finalScreenBoundingBoxState: ScreenState,
    containerState: ContainerState
): ContainerState => {
    // Get initial distance from origin
    const initialAbsoluteBoundingBoxState = screenStateToAbsoluteState(viewportState, initialScreenBoundingBoxState)
    const {
        absoluteXDistanceFromBoundingBoxOrigin, 
        absoluteYDistanceFromBoundingBoxOrigin
    } = {
        absoluteXDistanceFromBoundingBoxOrigin: containerState.x - initialAbsoluteBoundingBoxState.x,
        absoluteYDistanceFromBoundingBoxOrigin: containerState.y - initialAbsoluteBoundingBoxState.y
    }

    const transformationScreenValues = getScreenTransformationValues(finalScreenBoundingBoxState, initialScreenBoundingBoxState)
    // Apply transformation
    return {
        ...containerState,
        x: containerState.x 
            + absoluteXDistanceFromBoundingBoxOrigin*(transformationScreenValues.xScale - 1) 
            + screenLengthToAbsoluteLength(viewportState, transformationScreenValues.xScreenTranslate),
        y: containerState.y 
            + absoluteYDistanceFromBoundingBoxOrigin*(transformationScreenValues.yScale - 1) 
            + screenLengthToAbsoluteLength(viewportState, transformationScreenValues.yScreenTranslate),
        width: containerState.width * transformationScreenValues.xScale,
        height: containerState.height * transformationScreenValues.yScale
    }
}
const getScreenTransformationValues = (newBoundingBoxState: ScreenState, initialBoundingBoxState: ScreenState): {
    xScale: number
    yScale: number
    xScreenTranslate: number
    yScreenTranslate: number
} => {
    return {
        xScale: newBoundingBoxState.width / initialBoundingBoxState.width,
        yScale: newBoundingBoxState.height / initialBoundingBoxState.height,
        xScreenTranslate: newBoundingBoxState.x - initialBoundingBoxState.x,
        yScreenTranslate: newBoundingBoxState.y - initialBoundingBoxState.y
    }
}

const getNewBoundingBoxState = (type: NonNullable<TxPxContainer['dataset']['transformtargettype']>, {
    initialBoundingBoxState,
    pointerDownPoint,
    pointerMovePoint
}:{
    initialBoundingBoxState: ScreenState 
    pointerDownPoint: Point
    pointerMovePoint: Point
}): ScreenState=> {
    const dWidth = (pointerMovePoint.x - pointerDownPoint.x)
    const dHeight = (pointerMovePoint.y - pointerDownPoint.y)
    switch(type) {
        case('topLeft'): return {
            ...initialBoundingBoxState,
            x: initialBoundingBoxState.x + dWidth,
            y: initialBoundingBoxState.y + dHeight,
            width: initialBoundingBoxState.width - dWidth,
            height: initialBoundingBoxState.height - dHeight
        }
        case('topMiddle'): return {
            ...initialBoundingBoxState,
            y: initialBoundingBoxState.y + dHeight,
            height: initialBoundingBoxState.height - dHeight
        }
        case('topRight'): return {
            ...initialBoundingBoxState,
            y: initialBoundingBoxState.y + dHeight,
            width: initialBoundingBoxState.width + dWidth,
            height: initialBoundingBoxState.height - dHeight
        }
        case('middleRight'): return {
            ...initialBoundingBoxState,
            width: initialBoundingBoxState.width + dWidth,
        }
        case('bottomRight'): return {
            ...initialBoundingBoxState,
            width: initialBoundingBoxState.width + dWidth,
            height: initialBoundingBoxState.height + dHeight
        }
        case('bottomMiddle'): return {
            ...initialBoundingBoxState,
            height: initialBoundingBoxState.height + dHeight
        }
        case('bottomLeft'): return {
            ...initialBoundingBoxState,
            x: initialBoundingBoxState.x + dWidth,
            width: initialBoundingBoxState.width - dWidth,
            height: initialBoundingBoxState.height + dHeight
        }
        case('middleLeft'): return {
            ...initialBoundingBoxState,
            x: initialBoundingBoxState.x + dWidth,
            width: initialBoundingBoxState.width - dWidth,
        }
    }
}
