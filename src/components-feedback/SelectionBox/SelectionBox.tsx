import classNames from "classnames"
import styles from "./SelectionBox.module.scss"
import { useViewportStateContext } from "../../context/SpaceContext"
import { useStorageMyMouseSelectionState } from "../../hooks/liveblocks/useStorageMyMouseSelectionState"
import { absoluteStateToScreenState } from "@thinairthings/zoom-utils"

export const SelectionBox = () => {
    const myMouseSelectionState = useStorageMyMouseSelectionState()
    const [viewportState] = useViewportStateContext()
    const myScreenStateSelectionBounds = myMouseSelectionState.absoluteSelectionBounds 
    && absoluteStateToScreenState(viewportState, myMouseSelectionState.absoluteSelectionBounds)
    return (
        <>
            {myMouseSelectionState.selectionActive && myScreenStateSelectionBounds && (
                <div className={classNames(styles.selectionBox)}
                    style={{
                        left: myScreenStateSelectionBounds.x,
                        top: myScreenStateSelectionBounds.y,
                        width: myScreenStateSelectionBounds.width,
                        height: myScreenStateSelectionBounds.height
                    }}
                />
            )}
        </>
    )
}