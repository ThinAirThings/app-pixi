import { fromEvent, takeUntil } from 'rxjs'
import { mousePoint, mouseRect } from '@thinairthings/mouse-utils'
import { ContainerState, ScreenState, ViewportState, screenStateToAbsoluteState } from '@thinairthings/zoom-utils'
import { useStorageContainerStateMap } from '../liveblocks/useStorageContainerStateMap'
import { useMutationMyMouseSelectionState } from '../liveblocks/useMutationMyMouseSelectionState'

export const handleViewportTarget = (event: PointerEvent, {
    mySelectedNodeIds,
    updateMySelectedNodeIds,
    viewportState,
    allContainerStatesMap,
    updateMyMouseSelectionState
}: {
    mySelectedNodeIds: string[]
    updateMySelectedNodeIds: (mySelectedNodeIds: string[]) => void
    viewportState: ViewportState
    allContainerStatesMap: ReturnType<typeof useStorageContainerStateMap>
    updateMyMouseSelectionState: ReturnType<typeof useMutationMyMouseSelectionState>
}) => {
    // If the shift key is not pressed, clear the selection
    if ((!event.shiftKey)) {
        mySelectedNodeIds.length = 0
        updateMySelectedNodeIds([])
    } 
    const initialSelectedNodeIds = [...mySelectedNodeIds]
    const pointerDownPoint = mousePoint(event)
    document.body.setPointerCapture(event.pointerId)
    fromEvent<PointerEvent>(document.body, 'pointermove')
    .pipe (
        takeUntil(
            fromEvent<PointerEvent, void>(document.body, 'pointerup', {}, (event) => {
                updateMyMouseSelectionState({
                    selectionActive: false,
                    absoluteSelectionBounds: null
                })
                document.body.releasePointerCapture(event.pointerId)
            })
        )
    )
    .subscribe((event) => {
        const pointerMovePoint = mousePoint(event)
        updateMyMouseSelectionState({
            selectionActive: true,
            absoluteSelectionBounds: screenStateToAbsoluteState(viewportState, mouseRect(pointerDownPoint, pointerMovePoint))
        })
        const absoluteSelectionBounds = screenStateToAbsoluteState(viewportState, mouseRect(pointerDownPoint, pointerMovePoint))
        // Check all nodes container states to see if they are in the selection bounds
        const nodeIdsWithinSelectionBounds = [...allContainerStatesMap].filter(
            ([_, containerState]) => isNodeInSelectionBounds(absoluteSelectionBounds, containerState)
        ).map(([nodeId]) => nodeId)
        // Get the nodes that are outside the selection bounds but were previously selected due to shift key (You can probably simplify this with set operations)
        const nodesToAddBack = initialSelectedNodeIds.filter(nodeId => !nodeIdsWithinSelectionBounds.includes(nodeId))
        // Remove the nodes that were in the selection bounds but were previously selected due to shift key
        const nodeIdsWithinSelectionBoundsFiltered = nodeIdsWithinSelectionBounds.filter(nodeId => !initialSelectedNodeIds.includes(nodeId))
        updateMySelectedNodeIds([...nodesToAddBack, ...nodeIdsWithinSelectionBoundsFiltered])
    })
}
const isNodeInSelectionBounds = (selectionBounds: ScreenState, containerState: ContainerState) => {
    return !(selectionBounds.x > containerState.x + containerState.width ||
             selectionBounds.x + selectionBounds.width < containerState.x ||
             selectionBounds.y > containerState.y + containerState.height ||
             selectionBounds.y + selectionBounds.height < containerState.y)
}