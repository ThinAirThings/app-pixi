import { useEffect } from "react"
import { fromEvent } from "rxjs"
import { handleStageTarget } from "./handleStageTarget"
import { handleSelectionTarget } from "./handleSelectionTarget"
import { handleRightClickPan } from "./handleRightClickPan"
import { useViewportStateContext } from "../../context/SpaceContext"
import { useStorageMySelectedNodeIds } from "../liveblocks/useStorageMySelectedNodeIds"
import { useStorageMyFocusedNodeId } from "../liveblocks/useStorageMyFocusedNodeId"
import { useStorageContainerStateMap } from "../liveblocks/useStorageContainerStateMap"
import { useMutationMyMouseSelectionState } from "../liveblocks/useMutationMyMouseSelectionState"
import { useMutationMySelectedNodeIds } from "../liveblocks/useMutationMySelectedNodeIds"
import { useMutationContainerState } from "../liveblocks/useMutationContainerState"
import { DisplayObject } from "pixi.js"
import { TxPxContainer } from "../../components-pixi/_ext/MixinThinAirTargetingDataset"

export const usePointerActions = (targetRef: HTMLElement | DisplayObject) => {
    // States
    const [viewportState, setViewportState] = useViewportStateContext() 
    const mySelectedNodeIds = useStorageMySelectedNodeIds()
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    const containerStateMap = useStorageContainerStateMap()
    // Mutations
    const updateMyMouseSelectionState = useMutationMyMouseSelectionState()
    const updateMySelectedNodeIds = useMutationMySelectedNodeIds()
    const updateContainerState = useMutationContainerState()
    // Compound Pointer Actions
    useEffect(() => {
        const subscription = fromEvent<PointerEvent>(targetRef, 'pointerdown')
        .subscribe((event) => {
            const target = event.target as TxPxContainer
            // Check if click was right click
            if (event.button === 2) {
                // Right click
                handleRightClickPan(event, {
                    viewportState,
                    setViewportState
                })
                return
            }
            // Check if target is the Stage
            if (target.dataset.isviewport){
                // Target is Stage
                handleStageTarget(event, {
                    viewportState,
                    containerStateMap,
                    mySelectedNodeIds,
                    updateMySelectedNodeIds,
                    updateMyMouseSelectionState
                })
                return
            }
            // Implies target is a button or some other ui component. Ignore.
            if ((!target.dataset.isselectiontarget) || target.dataset.nodeid === myFocusedNodeId) return

            // Target is a selectionTarget
            handleSelectionTarget(event, {
                mySelectedNodeIds,
                containerStateMap,
                viewportState,
                updateMySelectedNodeIds,
                updateContainerState
            })
        })
        return () => subscription.unsubscribe()
    }, [mySelectedNodeIds, myFocusedNodeId, containerStateMap, viewportState])
}