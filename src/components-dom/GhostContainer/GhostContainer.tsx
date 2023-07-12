import classNames from "classnames"
import styles from "./GhostContainer.module.scss"
import { ContainerState } from "@thinairthings/zoom-utils"

export const GhostContainer = ({nodeId, containerState}: {
    nodeId: string
    containerState: ContainerState
}) => {
    return (
        <div className={classNames(styles.ghostContainer)}
            style={{
                width: (1/containerState.scale) * containerState.width,
                height: (1/containerState.scale) * containerState.height,
                transform: `
                    translate(${containerState.x}px, ${containerState.y}px) 
                    scale(${containerState.scale})
                `
            }}
        >
            <img src="/logos/thinair-white.svg"/>
        </div>
    )
}