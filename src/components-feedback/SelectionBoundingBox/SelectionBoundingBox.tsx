import classNames from "classnames"
import styles from "./SelectionBoundingBox.module.scss"
import { useStorageContainerStateMap } from "../../hooks/liveblocks/useStorageContainerStateMap"
import { useStorageMySelectedNodeIds } from "../../hooks/liveblocks/useStorageMySelectedNodeIds"
import { useViewportStateContext } from "../../context/SpaceContext"
import { getSelectionBoundingBox } from "@thinairthings/zoom-utils"

export const SelectionBoundingBox = () => {
    const [viewportState] = useViewportStateContext()
    const selectedContainerStateMap = useStorageContainerStateMap(
        useStorageMySelectedNodeIds()
    )
    // const boxSetBounds = selectedContainerStateMap.size > 0
    // ? {
    //     x: 1/viewportState.scale*(Math.min(...[...selectedContainerStateMap].map(([_, containerState]) => containerState.x)) + viewportState.x),
    //     y: 1/viewportState.scale*(Math.min(...[...selectedContainerStateMap].map(([_, containerState]) => containerState.y)) + viewportState.y),
    //     width: 1/viewportState.scale*(Math.max(...[...selectedContainerStateMap].map(([_, containerState]) => containerState.x + containerState.width)) 
    //         - Math.min(...[...selectedContainerStateMap].map(([_, containerState]) => containerState.x))),
    //     height: 1/viewportState.scale*(Math.max(...[...selectedContainerStateMap].map(([_, containerState]) => containerState.y + containerState.height))
    //         - Math.min(...[...selectedContainerStateMap].map(([_, containerState]) => containerState.y))),
    // }
    // : null
    const boxSetBounds = selectedContainerStateMap.size > 0
    ? getSelectionBoundingBox(viewportState, selectedContainerStateMap)
    : null
    return (
        <>
            {boxSetBounds && <div className={classNames(styles.selectionBoundingBox)}
                style={{
                    left: boxSetBounds?.x,
                    top: boxSetBounds?.y,
                    width: boxSetBounds?.width,
                    height: boxSetBounds?.height
                }}    
            />}
        </>

    )
}