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
import { useImmer } from "use-immer";
import { ScreenState } from "@thinairthings/zoom-utils";
export const ApplicationTarget: FC<{nodeId: string}> = ({
    nodeId
}) => {
    // Refs
    const pointerTargetRef = useRef<HTMLDivElement | null>(null)
    // State
    const containerState = useStorageContainerState(useStorage, nodeId)
    const myFocusedNodeId = useStorageMyFocusedNodeId()
    const [popupWindows, setPopupWindows] = useImmer<Map<number, {
        pixmapId: number,
        screenState: ScreenState
    }>>(new Map()) 
    // Effects
    const {
        remoteCursorType,
        compositorNodePairWorkerClientRef
    } = useCompositorNode(nodeId, containerState, setPopupWindows)
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
            >
                {[...popupWindows].map(([pixmapId, {screenState}]) => {
                    return <DivTarget
                        key={pixmapId}
                        nodeId={nodeId}
                        isApplicationTarget={true}
                        className={classNames(styles.applicationTarget)}
                        style={{
                            position: "absolute",
                            left: screenState.x,
                            top: screenState.y,
                            width: screenState.width,
                            height: screenState.height
                        }}
                    />
                })}
            </DivTarget>
        </DomContainer>
    )
}