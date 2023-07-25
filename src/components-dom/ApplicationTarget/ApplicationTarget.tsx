import { FC, useRef } from "react";
import { DomContainer } from "../DomContainer/DomContainer";
import { DivTarget } from "../DivTarget/DivTarget";
import classNames from "classnames";
import { useStorageContainerState } from "@thinairthings/liveblocks-model";
import { useStorage } from "../../context/LiveblocksContext";
import styles from "./ApplicationTarget.module.scss";
import { useCompositorNodeUpdateContainerState } from "./hooks/useCompositorNodeUpdateContainerState";
import { useApplicationTargetPointerActions } from "../../hooks/useApplicationTargetPointerActions";
import { useApplicationKeyboardEvents } from "../../hooks/useApplicationKeyboardEvents";
import { useStorageMyFocusedNodeId } from "../../hooks/liveblocks/useStorageMyFocusedNodeId";
import { useCompositorNode } from "./hooks/useCompositorNode";
export const ApplicationTarget: FC<{nodeId: string}> = ({
    nodeId
}) => {
    // Refs
    const pointerTargetRef = useRef<HTMLDivElement | null>(null)
    // State
    const containerState = useStorageContainerState(useStorage, nodeId)
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    
    // Effects
    const {
        remoteCursorType,
        compositorNodePairWorkerClientRef
    } = useCompositorNode(nodeId, containerState)
    useCompositorNodeUpdateContainerState(nodeId, containerState)
    useApplicationTargetPointerActions(nodeId, pointerTargetRef.current, compositorNodePairWorkerClientRef)
    useApplicationKeyboardEvents(nodeId, compositorNodePairWorkerClientRef)
    
    return(
        <DomContainer nodeId={nodeId}>
            <DivTarget 
                ref={pointerTargetRef}
                nodeId={nodeId}
                isApplicationTarget={true}
                className={classNames(styles.applicationTarget)}
                style={{
                    cursor: myFocusedNodeId === nodeId 
                        ? remoteCursorType 
                        : "pointer"
                }}
            />
        </DomContainer>
    )
}