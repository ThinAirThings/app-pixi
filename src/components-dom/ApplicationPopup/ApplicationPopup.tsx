import { FC, MutableRefObject, useMemo, useRef } from "react";
import { DivTarget } from "../DivTarget/DivTarget";
import styles from "./ApplicationPopup.module.scss";
import { useApplicationTargetPointerActions } from "../../hooks/useApplicationTargetPointerActions";
import { WorkerClient } from "@thinairthings/worker-client";
import { Point, ScreenState, screenStateToAbsoluteState } from "@thinairthings/zoom-utils";
import { useStorageContainerState } from "@thinairthings/liveblocks-model";
import { useStorage } from "../../context/LiveblocksContext";
import { useRxNodeSignal } from "@thinairthings/react-utils";
import { useViewportStateContext } from "../../context/SpaceContext";

export const ApplicationPopup: FC<{
    nodeId: string
    pixmapId: number
    screenState: ScreenState
    remoteCursorType: string
    compositorNodePairWorkerClientRef: MutableRefObject<WorkerClient>
}> = ({nodeId, pixmapId, screenState, remoteCursorType, compositorNodePairWorkerClientRef}) => {
    // Refs 
    const pointerTargetRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    // State
    const containerState = useStorageContainerState(useStorage, nodeId)
    const [viewportState] = useViewportStateContext()
    const popupState = useMemo<ScreenState>(() => ({
        x: screenState.x,
        y: screenState.y,
        width: screenState.width,
        height: screenState.height,
    }), [screenState, viewportState])
    // Effects
    useApplicationTargetPointerActions(nodeId, pointerTargetRef.current, compositorNodePairWorkerClientRef)
    useRxNodeSignal<{
        pixmapId: number
        dirtyRect: ScreenState
        dirtyBitmap: ImageBitmap
    }>('main', pixmapId.toString(), 'rxPopupDamage', ({dirtyRect, dirtyBitmap}) => {
        if (canvasRef.current.width !== screenState.width) {
            canvasRef.current.width = screenState.width
        }
        if (canvasRef.current.height !== screenState.height) {
            canvasRef.current.height = screenState.height
        }
        const ctx = canvasRef.current.getContext('2d')!
        ctx.drawImage(dirtyBitmap, dirtyRect.x, dirtyRect.y)
    })
    return (
        <DivTarget
            ref={pointerTargetRef}
            nodeId={nodeId}
            isApplicationTarget={true}
            className={styles.applicationPopup}
            style={{
                cursor: remoteCursorType,
                transform: `translate(
                    ${containerState.x + screenState.x}px,
                    ${containerState.y + screenState.y}px
                )`,
                width: screenState.width,
                height: screenState.height
            }}
        >
            <canvas ref={canvasRef}></canvas>
        </DivTarget>
    )
}