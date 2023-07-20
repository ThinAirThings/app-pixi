import { FC, useRef } from "react";
import { DomContainer } from "../DomContainer/DomContainer";
import { DivTarget } from "../DivTarget/DivTarget";
import classNames from "classnames";
import { useStorageContainerState, useStorageNodeState } from "@thinairthings/liveblocks-model";
import { useStorage } from "../../context/LiveblocksContext";
import styles from "./ApplicationTarget.module.scss";
import { useCompositorNodeLifecycle } from "./hooks/useCompositorNodeLifecycle";
import { useCompositorNodeUpdateContainerState } from "./hooks/useCompositorNodeUpdateContainerState";
import { useApplicationTargetPointerActions } from "../../hooks/applicationPointerActions/useApplicationTargetPointerActions";
import { compositorWorkerClient } from "../../views/Compositor/hooks/useInitializeCompositor";
export const ApplicationTarget: FC<{nodeId: string}> = ({
    nodeId
}) => {
    // Refs
    const pointerTargetRef = useRef<HTMLDivElement | null>(null)
    // State
    const cursor = useStorageNodeState<'browser', 'cursor'>(useStorage, nodeId, "cursor")
    const containerState = useStorageContainerState(useStorage, nodeId)
    // Effects
    useCompositorNodeLifecycle(nodeId, containerState)
    useCompositorNodeUpdateContainerState(nodeId, containerState)
    useApplicationTargetPointerActions(nodeId, pointerTargetRef.current, compositorWorkerClient)
    return(
        <DomContainer nodeId={nodeId}>
            <DivTarget 
                ref={pointerTargetRef}
                nodeId={nodeId}
                isApplicationTarget={true}
                className={classNames(styles.applicationTarget)}
                style={{
                    cursor
                }}
            />
        </DomContainer>
    )
}