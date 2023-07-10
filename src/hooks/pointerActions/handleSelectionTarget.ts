import { ContainerState, ViewportState } from "@thinairthings/zoom-utils"
import { mousePoint } from "@thinairthings/mouse-utils"
import { fromEvent, takeUntil } from "rxjs"
import { useStorageContainerStateMap } from "../liveblocks/useStorageContainerStateMap"
import { useMutationContainerState } from "../liveblocks/useMutationContainerState"
import { TxPxContainer } from "../../components-pixi/_ext/MixinThinAirTargetingDataset"
import { useHistory } from "../../context/LiveblocksContext"
export const handleSelectionTarget = (event: PointerEvent, {
    viewportState,
    mySelectedNodeIds,
    allContainerStatesMap,
    updateMySelectedNodeIds,
    updateContainerState,
    historyControl
}: {
    viewportState: ViewportState
    mySelectedNodeIds: string[] 
    allContainerStatesMap: ReturnType<typeof useStorageContainerStateMap>
    updateMySelectedNodeIds: (mySelectedNodeIds: string[]) => void
    updateContainerState: ReturnType<typeof useMutationContainerState>
    historyControl: ReturnType<typeof useHistory>
}) => {
    // Get target
    const target = event.target as TxPxContainer
    // Get selections 
    if ((!event.shiftKey) && (!event.altKey) && (mySelectedNodeIds.length < 2)){
        mySelectedNodeIds.length = 0 // Clear selection
    }
    // Add target to selection
    mySelectedNodeIds.push(target.dataset.nodeid!)
    updateMySelectedNodeIds([...mySelectedNodeIds]) // Set react state to update ui
    // Get Initial Container States Map
    const initialContainerStatesMap = new Map<string, ContainerState>(
        mySelectedNodeIds.map(nodeId => [nodeId, allContainerStatesMap.get(nodeId)!])
    )
    const pointerDownPoint = mousePoint(event) // Get Initial Pointer Position
    document.body.setPointerCapture(event.pointerId)
    // Pause History
    historyControl.pause()
    // Pointer Move
    fromEvent<PointerEvent>(document.body, 'pointermove')
    .pipe (
        takeUntil(fromEvent<PointerEvent, void>(document.body, 'pointerup', {}, (event) => {
            document.body.releasePointerCapture(event.pointerId)
            // Resume History
            historyControl.resume()
        }))
    )
    .subscribe((event) => {
        const pointerMovePoint = mousePoint(event);
        // Update Container States
        [...initialContainerStatesMap].forEach(([nodeId, containerState]) => {
            updateContainerState(nodeId, {
                x: containerState.x + viewportState.scale*(pointerMovePoint.x - pointerDownPoint.x),
                y: containerState.y + viewportState.scale*(pointerMovePoint.y - pointerDownPoint.y),
            })
        })
    })
}