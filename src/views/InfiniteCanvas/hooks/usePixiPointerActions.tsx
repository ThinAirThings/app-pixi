import { useApp } from "@pixi/react"
import { useEffect } from "react"
import { fromEvent } from "rxjs"
import { useStorageMySelectedNodeIds } from "../../../hooks/liveblocks/useStorageMySelectedNodeIds"
import { useStorageMyFocusedNodeId } from "../../../hooks/liveblocks/useStorageMyFocusedNodeId"
import { TxPxContainer } from "../../../components-pixi/_ext/TxPxContainer"
import { useStorageNodeMap } from "../../../hooks/liveblocks/useStorageNodeMap"
import { useMutationMySelectedNodeIds } from "../../../hooks/liveblocks/useMutationMySelectedNodeIds"
import { useMutationContainerState } from "../../../hooks/liveblocks/useMutationContainerState"
import { handleStageTarget } from "./handleStageTarget"
import { handleSelectionTarget } from "./handleSelectionTarget"
import { useViewportStateContext } from "../../../context/SpaceContext"
import { useStorageContainerStateMap } from "../../../hooks/liveblocks/useStorageContainerStateMap"

export const usePixiPointerActions = () => {
    // Get Pixi App Handle
    const app = useApp()
    // States
    const [viewportState] = useViewportStateContext()
    const mySelectedNodeIds = useStorageMySelectedNodeIds()
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    const containerStateMap = useStorageContainerStateMap()
    // Mutations
    const setMySelectedNodeIds = useMutationMySelectedNodeIds()
    const updateContainerState = useMutationContainerState()
    // Compound Pointer Actions
    useEffect(() => {
        const subscription = fromEvent<PointerEvent>(app.stage, 'pointerdown')
        .subscribe((event) => {
            const target = event.target as TxPxContainer
            // Check if target is the Stage
            if (target.parent === null){
                // Target is Stage
                handleStageTarget(event, {
                    stage: app.stage,
                    mySelectedNodeIds,
                    setMySelectedNodeIds,
                    viewportState,
                    containerStateMap,
                })
                return
            }
            // Implies target is a button or some other ui component. Ignore.
            if ((!target.selectionTarget) || target.nodeId === myFocusedNodeId) return

            // Target is a selectionTarget
            handleSelectionTarget(event, {
                stage: app.stage,
                mySelectedNodeIds,
                setMySelectedNodeIds,
                containerStateMap,
                updateContainerState
            })
        })
        return () => subscription.unsubscribe()
    }, [mySelectedNodeIds, myFocusedNodeId, containerStateMap])
}