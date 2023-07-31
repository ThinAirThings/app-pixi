import { FC, Fragment, useContext, useRef } from "react";
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
import { PopupReferencePointContext } from "../../views/SpaceMain/SpaceMain";
import { createPortal } from "react-dom";
import { ApplicationPopup } from "../ApplicationPopup/ApplicationPopup";
export const ApplicationTarget: FC<{nodeId: string}> = ({
    nodeId
}) => {
    // Refs
    const pointerTargetRef = useRef<HTMLDivElement | null>(null)
    const popupReferencePointRef = useContext(PopupReferencePointContext)
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
                    return <Fragment key={pixmapId}>
                        {createPortal(<ApplicationPopup
                            nodeId={nodeId}
                            pixmapId={pixmapId}
                            screenState={screenState}
                            remoteCursorType={remoteCursorType}
                            compositorNodePairWorkerClientRef={compositorNodePairWorkerClientRef}
                        />, popupReferencePointRef)}
                    </Fragment>
                })}
            </DivTarget>
        </DomContainer>
    )
}