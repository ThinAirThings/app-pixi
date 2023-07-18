import classNames from "classnames"
import styles from "./SelectionBoundingBox.module.scss"
import { useStorageMySelectedNodeIds } from "../../hooks/liveblocks/useStorageMySelectedNodeIds"
import { useViewportStateContext } from "../../context/SpaceContext"
import { getSelectionBoundingBox } from "@thinairthings/zoom-utils"
import { transformTargetTypes } from "../../hooks/pointerActions/useMainPointerActions"
import { TransformZone } from "../TransformZone/TransformZone"
import { useMemo, useRef } from "react"
import { useStorageContainerStateMap } from "@thinairthings/liveblocks-model"
import { useStorage } from "../../context/LiveblocksContext"


export const SelectionBoundingBox = () => {
    // Refs
    const selectionBoundingBoxRef = useRef<HTMLDivElement>(null)
    const [viewportState] = useViewportStateContext()
    const selectedContainerStateMap = useStorageContainerStateMap(
        useStorage,
        useStorageMySelectedNodeIds()
    )

    const boxBounds = useMemo(() => selectedContainerStateMap.size > 0
    ? getSelectionBoundingBox(viewportState, selectedContainerStateMap)
    : null, [selectedContainerStateMap, viewportState])
    const boxBoundsFrameRef = useRef(boxBounds)
    // useEffect(() => {
    //     let handle: number | null = null
    //     const tick = () => {
    //         if (boxBounds && selectionBoundingBoxRef.current) {
    //             if (!boxBoundsFrameRef.current) {
    //                 boxBoundsFrameRef.current = {...boxBounds}
    //             }
                
    //             const {dx, dy, dWidth, dHeight} = {
    //                 dx: boxBounds.x - boxBoundsFrameRef.current.x,
    //                 dy: boxBounds.y - boxBoundsFrameRef.current.y,
    //                 dWidth: boxBounds.width - boxBoundsFrameRef.current.width,
    //                 dHeight: boxBounds.height - boxBoundsFrameRef.current.height
    //             }
    //             boxBoundsFrameRef.current = {
    //                 ...boxBoundsFrameRef.current,
    //                 x: boxBoundsFrameRef.current.x + dx * zoomSpeed,
    //                 y: boxBoundsFrameRef.current.y + dy * zoomSpeed,
    //                 width: boxBoundsFrameRef.current.width + dWidth * zoomSpeed,
    //                 height: boxBoundsFrameRef.current.height + dHeight * zoomSpeed
    //             }
    //             selectionBoundingBoxRef.current!.style.left = boxBoundsFrameRef.current.x + "px"
    //             selectionBoundingBoxRef.current!.style.top = boxBoundsFrameRef.current.y + "px"
    //             selectionBoundingBoxRef.current!.style.width = `${boxBoundsFrameRef.current.width}px`
    //             selectionBoundingBoxRef.current!.style.height = `${boxBoundsFrameRef.current.height}px`
    //         }
    //         handle = window.requestAnimationFrame(tick)
    //     }
    //     handle = window.requestAnimationFrame(tick)
    //     return () => {
    //         handle && window.cancelAnimationFrame(handle)
    //     }
    // }, [boxBounds])

    return (
        <>
            {boxBounds && <div ref={selectionBoundingBoxRef} className={classNames(styles.selectionBoundingBox)}
                style={{
                    left: boxBounds?.x,
                    top: boxBounds?.y,
                    width: boxBounds?.width,
                    height: boxBounds?.height
                }}    
            />}
            {boxBounds && transformTargetTypes.map(transformTargetType => (
                <TransformZone
                    key={transformTargetType}
                    transformTargetType={transformTargetType}
                    boxBounds={boxBounds}
                />
            ))}
        </>

    )
}