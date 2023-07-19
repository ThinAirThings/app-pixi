import { useRef } from "react"
import { DomContainer } from "../DomContainer/DomContainer"
import { DivTarget } from "../DivTarget/DivTarget"
import { useApplicationCanvasWorker } from "./hooks/useApplicationCanvasWorker"
import classNames from "classnames"
import styles from "./ApplicationWindow.module.scss"
import { useStorageNodeState } from "@thinairthings/liveblocks-model"
import { useStorage } from "../../context/LiveblocksContext"
import { useApplicationKeyboardEvents } from "../../hooks/useApplicationKeyboardEvents"
import { useApplicationPointerActions } from "../../hooks/applicationPointerActions/useApplicationPointerActionsv2"
import { useApplicationCanvasRescaling } from "./hooks/useApplicationCanvasRescaling"
import { useApplicationCanvasResizing } from "./hooks/useApplicationCanvasResizing"

export const ApplicationWindow = ({nodeId}: {
    nodeId: string
}) => {
    // Refs
    const canvasContainerRef = useRef<HTMLDivElement | null>(null)
    const {
        workerClientRef,
        canvasRef
    } = useApplicationCanvasWorker(nodeId, canvasContainerRef)
    // State
    const cursor = useStorageNodeState<'browser', 'cursor'>(useStorage, nodeId, "cursor")
    // Effects
    useApplicationPointerActions(
        nodeId, 
        canvasContainerRef.current,
        workerClientRef
    )
    useApplicationKeyboardEvents(nodeId, workerClientRef)
    useApplicationCanvasRescaling(nodeId, workerClientRef, canvasRef)
    useApplicationCanvasResizing(nodeId, workerClientRef)
    return (
        <DomContainer nodeId={nodeId}>
            <DivTarget ref={canvasContainerRef} nodeId={nodeId}
                isApplicationTarget={true}
                className={classNames(styles.applicationWindow)}
                style={{
                    cursor
                }}
            />
        </DomContainer>
    )
}