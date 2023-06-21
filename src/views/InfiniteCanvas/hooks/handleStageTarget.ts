import { Container as PxContainer } from 'pixi.js'
import { fromEvent, takeUntil } from 'rxjs'
import { SelectionBox } from '../../../webcomponents/SelectionBox'
import { mousePoint, mouseRect } from '@thinairthings/mouse-utils'
import { ContainerState, ScreenState, ViewportState, screenStateToAbsoluteState } from '@thinairthings/zoom-utils'
import { useStorageContainerStateMap } from '../../../hooks/liveblocks/useStorageContainerStateMap'

export const handleStageTarget = (event: PointerEvent, {
    stage,
    mySelectedNodeIds,
    setMySelectedNodeIds,
    viewportState,
    containerStateMap,
}: {
    stage: PxContainer
    mySelectedNodeIds: string[]
    setMySelectedNodeIds: (mySelectedNodeIds: string[]) => void
    viewportState: ViewportState
    containerStateMap: ReturnType<typeof useStorageContainerStateMap>
}) => {
    // If the shift key is not pressed, clear the selection
    if ((!event.shiftKey)) {
        mySelectedNodeIds.length = 0
    } 
    const initialSelectedNodeIds = [...mySelectedNodeIds]
    const pointerDownPoint = mousePoint(event)
    const selectionBox = new SelectionBox(pointerDownPoint)
    document.getElementById('root')!.append(selectionBox)
    fromEvent<PointerEvent>(stage, 'pointermove')
    .pipe (
        takeUntil(
            fromEvent<PointerEvent, void>(stage, 'pointerup', {}, (event) => {
                selectionBox.remove()
            })
        )
    )
    .subscribe((event) => {
        const pointerMovePoint = mousePoint(event)
        selectionBox.update(mousePoint(event))
        const absoluteSelectionBounds = screenStateToAbsoluteState(viewportState, mouseRect(pointerDownPoint, pointerMovePoint))
        // Check all nodes container states to see if they are in the selection bounds
        const nodeIdsWithinSelectionBounds = [...containerStateMap].filter(
            ([_, containerState]) => isNodeInSelectionBounds(absoluteSelectionBounds, containerState)
        ).map(([nodeId]) => nodeId)
        // Get the nodes that are outside the selection bounds but were previously selected due to shift key (You can probably simplify this with set operations)
        const nodesToAddBack = initialSelectedNodeIds.filter(nodeId => !nodeIdsWithinSelectionBounds.includes(nodeId))
        // Remove the nodes that were in the selection bounds but were previously selected due to shift key
        const nodeIdsWithinSelectionBoundsFiltered = nodeIdsWithinSelectionBounds.filter(nodeId => !initialSelectedNodeIds.includes(nodeId))
        setMySelectedNodeIds([...nodesToAddBack, ...nodeIdsWithinSelectionBoundsFiltered])
    })
}

const isNodeInSelectionBounds = (selectionBounds: ScreenState, containerState: ContainerState) => {
    return !(selectionBounds.x > containerState.x + containerState.width ||
             selectionBounds.x + selectionBounds.width < containerState.x ||
             selectionBounds.y > containerState.y + containerState.height ||
             selectionBounds.y + selectionBounds.height < containerState.y)
}