import { ContainerState } from "@thinairthings/zoom-utils"
import { TxPxContainer } from "../../../components-pixi/_ext/TxPxContainer"
import { mousePoint } from "@thinairthings/mouse-utils"
import { fromEvent, takeUntil } from "rxjs"
import {Container as PxContainer} from 'pixi.js'
import { useMutationContainerState } from "../../../hooks/liveblocks/useMutationContainerState"
import { useStorageContainerStateMap } from "../../../hooks/liveblocks/useStorageContainerStateMap"

export const handleSelectionTarget = (event: PointerEvent, {
    stage,
    mySelectedNodeIds,
    setMySelectedNodeIds,
    containerStateMap,
    updateContainerState,
}: {
    stage: PxContainer
    mySelectedNodeIds: string[]
    setMySelectedNodeIds: (mySelectedNodeIds: string[]) => void
    containerStateMap: ReturnType<typeof useStorageContainerStateMap>
    updateContainerState: ReturnType<typeof useMutationContainerState>
}) => {
    // Get target
    const target = event.target as TxPxContainer
    // Get selections 
    if ((!event.shiftKey) && (!event.altKey) && (mySelectedNodeIds.length < 2)){
        mySelectedNodeIds.length = 0 // Clear selection
    }
    // Add target to selection
    mySelectedNodeIds.push(target.nodeId)
    setMySelectedNodeIds([...mySelectedNodeIds]) // Set react state to update ui
    // Get Initial Container States Map
    const initialContainerStatesMap = new Map<string, ContainerState>(
        mySelectedNodeIds.map(nodeId => [nodeId, containerStateMap.get(nodeId)!])
    )
    const pointerDownPoint = mousePoint(event) // Get Initial Pointer Position
    // Pointer Move
    fromEvent<PointerEvent>(stage, 'pointermove')
    .pipe (
        takeUntil(fromEvent<PointerEvent>(stage, 'pointerup'))
    )
    .subscribe((event) => {
        const pointerMovePoint = mousePoint(event);
        // Update Container States
        [...initialContainerStatesMap].forEach(([nodeId, containerState]) => {
            updateContainerState(nodeId, {
                x: containerState.x + pointerMovePoint.x - pointerDownPoint.x,
                y: containerState.y + pointerMovePoint.y - pointerDownPoint.y,
            })
        })
    })
}