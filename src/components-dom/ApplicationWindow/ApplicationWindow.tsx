import { useRef } from "react"
import { DomContainer } from "../DomContainer/DomContainer"
import { DivTarget } from "../DivTarget/DivTarget"
import { useApplicationCanvasWorker } from "./hooks/useApplicationCanvasWorker"
import { useApplicationPointerActions } from "../../hooks/pointerActions/useApplicationPointerActions"
import classNames from "classnames"
import styles from "./ApplicationWindow.module.scss"
import { useStorageNodeState } from "@thinairthings/liveblocks-model"
import { useStorage } from "../../context/LiveblocksContext"
import { useApplicationKeyboardEvents } from "../../hooks/useApplicationKeyboardEvents"

export const ApplicationWindow = ({nodeId}: {
    nodeId: string
}) => {
    // Refs
    const canvasContainerRef = useRef<HTMLDivElement | null>(null)
    const workerClientRef = useApplicationCanvasWorker(nodeId, canvasContainerRef)
    // State
    const cursor = useStorageNodeState<'browser', 'cursor'>(useStorage, nodeId, "cursor")
    // Effects
    useApplicationPointerActions(
        nodeId, 
        canvasContainerRef.current,
        workerClientRef
    )
    useApplicationKeyboardEvents(nodeId, workerClientRef)
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