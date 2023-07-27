import { ContainerState, ViewportState } from "@thinairthings/zoom-utils"
import { mousePoint } from "@thinairthings/mouse-utils"
import { fromEvent, takeUntil } from "rxjs"
import { TxPxContainer } from "../../components-pixi/_ext/MixinThinAirTargetingDataset"
import { useHistory } from "../../context/LiveblocksContext"
import { useMutationContainerState, useMutationCreateNode, useStorageContainerStateMap, useStorageNodeMap } from "@thinairthings/liveblocks-model"
import { useGhostContainersContext } from "../../context/SpaceContext"
export const handleSelectionTarget = (event: PointerEvent, {
    viewportState,
    mySelectedNodeIds,
    nodeMap,
    allContainerStatesMap,
    setGhostContainers,
    createNode,
    updateMySelectedNodeIds,
    updateContainerState,
    historyControl
}: {
    viewportState: ViewportState
    mySelectedNodeIds: string[]
    nodeMap: ReturnType<typeof useStorageNodeMap>
    allContainerStatesMap: ReturnType<typeof useStorageContainerStateMap>
    setGhostContainers: ReturnType<typeof useGhostContainersContext>[1]
    createNode: ReturnType<typeof useMutationCreateNode>
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
    let finalContainerStatesMap: Map<string, ContainerState>
    const pointerDownPoint = mousePoint(event) // Get Initial Pointer Position
    document.body.setPointerCapture(event.pointerId)
    // Pause History
    historyControl.pause()
    // Pointer Move
    fromEvent<PointerEvent>(document.body, 'pointermove')
    .pipe (
        takeUntil(fromEvent<PointerEvent, void>(document.body, 'pointerup', {}, (event) => {
            document.body.releasePointerCapture(event.pointerId)
            // If alt key, Duplicate
            if (event.altKey) {
                [...finalContainerStatesMap].forEach(([nodeId, containerState]) => {
                    const immutableNodeData = nodeMap.get(nodeId)!
                    // Check for application window for process duplication
                    createNode({
                        key: immutableNodeData.key,
                        type: immutableNodeData.type,
                        state: {
                            ...immutableNodeData.state,
                            containerState: {
                                ...containerState,
                            }
                        }
                    })
                })
            }
            // Clear Ghost Containers
            setGhostContainers([])
            // Resume History
            historyControl.resume()
        }))
    )
    .subscribe((event) => {
        const pointerMovePoint = mousePoint(event);
        finalContainerStatesMap = new Map<string, ContainerState>(
            [...initialContainerStatesMap].map(([nodeId, containerState]) => {
                return [nodeId, {
                    ...containerState,
                    x: containerState.x + viewportState.scale*(pointerMovePoint.x - pointerDownPoint.x),
                    y: containerState.y + viewportState.scale*(pointerMovePoint.y - pointerDownPoint.y),
                }]
            })
        )
        // Handle Alt Drag
        if (event.altKey) {
            // Update Ghost Containers
            setGhostContainers([...finalContainerStatesMap].map(([nodeId, containerState]) => ({
                nodeId,
                containerState
            })))
            return
        }
        setGhostContainers([]); // Clear Ghost Containers
        // Update Container States
        [...finalContainerStatesMap].forEach(([nodeId, containerState]) => {
            updateContainerState(nodeId, {
                x: containerState.x, y: containerState.y,
            })
        })
    })
}