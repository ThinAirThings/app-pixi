import { ContainerState, Point, ViewportState } from "@thinairthings/zoom-utils"
import { TxPxContainer } from "../../components-pixi/_ext/MixinThinAirTargetingDataset"
import { useStorageContainerStateMap } from "../liveblocks/useStorageContainerStateMap"
import { useMutationContainerState } from "../liveblocks/useMutationContainerState"
import { mousePoint } from "@thinairthings/mouse-utils"
import { fromEvent, takeUntil } from "rxjs"


export const handleTransformTarget = (event: PointerEvent, {
    viewportState,
    mySelectedNodeIds,
    containerStateMap,
    updateContainerState
} : {
    viewportState: ViewportState
    mySelectedNodeIds: string[]
    containerStateMap: ReturnType<typeof useStorageContainerStateMap>
    updateContainerState: ReturnType<typeof useMutationContainerState>
}) => {
    // Get target
    const target = event.target as TxPxContainer
    const transformTargetType = target.dataset.transformtargettype
    // Get Initial Container States Map
    const initialContainerStatesMap = new Map<string, ContainerState>(
        mySelectedNodeIds.map(nodeId => [nodeId, containerStateMap.get(nodeId)!])
    )
    const pointerDownPoint = mousePoint(event) // Get Initial Pointer Position
    document.body.setPointerCapture(event.pointerId)

    // Pointer Move
    fromEvent<PointerEvent>(document.body, 'pointermove')
    .pipe(
        takeUntil(fromEvent<PointerEvent, void>(document.body, 'pointerup', {}, (event) => {
            document.body.releasePointerCapture(event.pointerId)
        }))
    )
}

const resizeCalculation = (type: NonNullable<TxPxContainer['dataset']['transformtargettype']>, {
    initialContainerState,
    recursiveScale,
    mouseDownPoint,
    mouseMovePoint
}:{
    initialContainerState: ContainerState
    recursiveScale: number  
    mouseDownPoint: Point
    mouseMovePoint: Point
}): ContainerState=> {
    const dWidth = recursiveScale*(mouseMovePoint.x - mouseDownPoint.x)
    const dHeight = recursiveScale*(mouseMovePoint.y - mouseDownPoint.y)
    switch(type) {
        case('topLeft'): return {
            ...initialContainerState,
            x: initialContainerState.x + dWidth,
            y: initialContainerState.y + dHeight,
            width: initialContainerState.width - (1/initialContainerState.scale*dWidth),
            height: initialContainerState.height - (1/initialContainerState.scale*dHeight)
        }
        case('topMiddle'): return {
            ...initialContainerState,
            y: initialContainerState.y + dHeight,
            height: initialContainerState.height - (1/initialContainerState.scale*dHeight)
        }
        case('topRight'): return {
            ...initialContainerState,
            y: initialContainerState.y + dHeight,
            width: initialContainerState.width + (1/initialContainerState.scale*dWidth),
            height: initialContainerState.height - (1/initialContainerState.scale*dHeight)
        }
        case('middleRight'): return {
            ...initialContainerState,
            width: initialContainerState.width + (1/initialContainerState.scale*dWidth),
        }
        case('bottomRight'): return {
            ...initialContainerState,
            width: initialContainerState.width + (1/initialContainerState.scale*dWidth),
            height: initialContainerState.height + (1/initialContainerState.scale*dHeight)
        }
        case('bottomMiddle'): return {
            ...initialContainerState,
            height: initialContainerState.height + (1/initialContainerState.scale*dHeight)
        }
        case('bottomLeft'): return {
            ...initialContainerState,
            x: initialContainerState.x + dWidth,
            width: initialContainerState.width - (1/initialContainerState.scale*dWidth),
            height: initialContainerState.height + (1/initialContainerState.scale*dHeight)
        }
        case('middleLeft'): return {
            ...initialContainerState,
            x: initialContainerState.x + dWidth,
            width: initialContainerState.width - (1/initialContainerState.scale*dWidth),
        }
    }
}
