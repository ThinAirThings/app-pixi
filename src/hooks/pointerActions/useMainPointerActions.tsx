import { useEffect, useRef } from "react"
import { fromEvent } from "rxjs"
import { handleSelectionTarget } from "./handleSelectionTarget"
import { handleRightClickPan } from "./handleRightClickPan"
import { useGhostContainersContext, useViewportStateContext } from "../../context/SpaceContext"
import { useStorageMySelectedNodeIds } from "../liveblocks/useStorageMySelectedNodeIds"
import { useStorageMyFocusedNodeId } from "../liveblocks/useStorageMyFocusedNodeId"
import { useMutationMyMouseSelectionState } from "../liveblocks/useMutationMyMouseSelectionState"
import { useMutationMySelectedNodeIds } from "../liveblocks/useMutationMySelectedNodeIds"
import { DisplayObject } from "pixi.js"
import { TxPxContainer } from "../../components-pixi/_ext/MixinThinAirTargetingDataset"
import { handleViewportTarget } from "./handleViewportTarget"
import { handleTransformTarget } from "./handleTransformTarget"
import { ContainerState } from "@thinairthings/zoom-utils"
import { useMutationMyFocusedNodeId } from "../liveblocks/useMutationMyFocusedNodeId"
import { useHistory, useMutation, useStorage } from "../../context/LiveblocksContext"
import { useMutationContainerState, useMutationCreateNode, useStorageContainerStateMap, useStorageNodeMap } from "@thinairthings/liveblocks-model"

export const transformTargetTypes = ["topLeft", "topMiddle" , "topRight" , "middleLeft" , "middleRight" , "bottomLeft" ,"bottomMiddle" , "bottomRight" ] as const;
export type TransformTargetType = typeof transformTargetTypes[number];

export const useMainPointerActions = (targetRef: HTMLElement | DisplayObject) => {
    // Refs
    const clickCount = useRef(0)
    const clickTimeout = useRef<NodeJS.Timeout | null>(null)
    // States
    const [viewportState, setViewportState] = useViewportStateContext() 
    const mySelectedNodeIds = useStorageMySelectedNodeIds()
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    const allContainerStatesMap = useStorageContainerStateMap(useStorage)
    const nodeMap = useStorageNodeMap(useStorage)
    const [ghostContainers, setGhostContainers] = useGhostContainersContext()
    // Mutations
    const createNode = useMutationCreateNode(useMutation)
    const updateMyMouseSelectionState = useMutationMyMouseSelectionState()
    const updateMySelectedNodeIds = useMutationMySelectedNodeIds()
    const updateContainerState = useMutationContainerState(useMutation)
    const updateMyFocusedNodeId = useMutationMyFocusedNodeId()
    // History Controls
    const historyControl = useHistory()
    // Compound Pointer Actions
    useEffect(() => {
        if (!targetRef) return  // React Suspense with Liveblocks sort of breaks the react timeline
        const subscription = fromEvent<PointerEvent>(targetRef, 'pointerdown')
        .subscribe((event) => {
            const target = event.target as TxPxContainer
            // Check if click was right click
            if (event.button === 2) {
                // Right click
                handleRightClickPan(event, {
                    viewportState,
                    setViewportState,
                })
                return
            }
            // Switch on target (DOM or Pixi)
            if (!target.dataset?.ispixitarget && !target.dataset?.isdomtarget) return // If neither pixi or dom target, ignore. This is for general ui components
            if (target instanceof HTMLElement && target.dataset?.ispixitarget) return
            if (target instanceof DisplayObject && target.dataset?.isdomtarget) return
            // Check if target is application target
            if (target.dataset?.isapplicationtarget){
                // Target is an application target
                if (myFocusedNodeId === target.dataset.nodeid!) {
                    return  // Pass control off to application event listeners
                }
                clickCount.current += 1
                clearTimeout(clickTimeout.current!)
                clickTimeout.current = setTimeout(() => clickCount.current = 0, 400)
                if (clickCount.current > 1) {
                    updateMyFocusedNodeId(target.dataset.nodeid!)
                }
            } else {
                updateMyFocusedNodeId(null)
            }
            // Check if target is a transform target
            if (target.dataset?.istransformtarget && target.dataset?.transformtargettype) {
                // Target is a transform target
                handleTransformTarget(event, {
                    viewportState,
                    initialSelectedContainerStatesMap: new Map<string, ContainerState>(
                        mySelectedNodeIds.map(nodeId => [nodeId, allContainerStatesMap.get(nodeId)!])
                    ), 
                    updateContainerState,
                    historyControl
                })
                return
            }
            // Check if target is a viewport
            if (target.dataset?.isviewport){
                // Target is a Viewport
                handleViewportTarget(event, {
                    viewportState,
                    allContainerStatesMap,
                    mySelectedNodeIds,
                    updateMySelectedNodeIds,
                    updateMyMouseSelectionState
                })
                return
            }

            // Implies target is a button or some other ui component. Ignore.
            if ((!target.dataset?.isselectiontarget) || target.dataset?.nodeid === myFocusedNodeId) return

            // Target is a selectionTarget
            handleSelectionTarget(event, {
                mySelectedNodeIds,
                nodeMap,
                allContainerStatesMap,
                setGhostContainers,
                viewportState,
                createNode,
                updateMySelectedNodeIds,
                updateContainerState,
                historyControl
            })
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [mySelectedNodeIds, myFocusedNodeId, allContainerStatesMap, viewportState, targetRef])
}