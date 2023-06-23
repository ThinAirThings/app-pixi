import classNames from "classnames"
import styles from "./SelectionBoundingBox.module.scss"
import { useStorageContainerStateMap } from "../../hooks/liveblocks/useStorageContainerStateMap"
import { useStorageMySelectedNodeIds } from "../../hooks/liveblocks/useStorageMySelectedNodeIds"
import { useViewportStateContext } from "../../context/SpaceContext"
import { getSelectionBoundingBox } from "@thinairthings/zoom-utils"
import { transformTargetTypes } from "../../hooks/pointerActions/usePointerActions"
import { TransformZone } from "../TransformZone/TransformZone"


export const SelectionBoundingBox = () => {
    const [viewportState] = useViewportStateContext()
    const selectedContainerStateMap = useStorageContainerStateMap(
        useStorageMySelectedNodeIds()
    )

    const boxBounds = selectedContainerStateMap.size > 0
    ? getSelectionBoundingBox(viewportState, selectedContainerStateMap)
    : null
    return (
        <>
            {boxBounds && <div className={classNames(styles.selectionBoundingBox)}
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