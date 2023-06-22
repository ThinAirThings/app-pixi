import { useApp } from "@pixi/react"
import { useEffect } from "react"
import { fromEvent } from "rxjs"
import { useStorageMySelectedNodeIds } from "../../../hooks/liveblocks/useStorageMySelectedNodeIds"
import { useStorageMyFocusedNodeId } from "../../../hooks/liveblocks/useStorageMyFocusedNodeId"
import { TxPxContainer } from "../../../components-pixi/_ext/TxPxContainer"
import { useMutationMySelectedNodeIds } from "../../../hooks/liveblocks/useMutationMySelectedNodeIds"
import { useMutationContainerState } from "../../../hooks/liveblocks/useMutationContainerState"
import { handleStageTarget } from "./handleStageTarget"
import { handleSelectionTarget } from "./handleSelectionTarget"
import { useViewportStateContext } from "../../../context/SpaceContext"
import { useStorageContainerStateMap } from "../../../hooks/liveblocks/useStorageContainerStateMap"
import { useMutationMyMouseSelectionState } from "../../../hooks/liveblocks/useMutationMyMouseSelectionState"
import { handleRightClickPan } from "./handleRightClickPan"

export const usePixiPointerActions = () => {
    // Get Pixi App Handle
    const app = useApp()
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
        const subscription = fromEvent<PointerEvent>(app.stage, 'pointerdown')
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
            if (target.parent === null){
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
            if ((!target.selectionTarget) || target.nodeId === myFocusedNodeId) return

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