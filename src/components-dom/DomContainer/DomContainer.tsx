import { ReactNode } from "react"
import style from "./DomContainer.module.scss"
import classNames from "classnames"
import { useStorage } from "../../context/LiveblocksContext"
import { useStorageContainerState } from "@thinairthings/liveblocks-model"

export const DomContainer = ({nodeId, children}: {
    nodeId: string
    children?: ReactNode
}) => {
    const containerState = useStorageContainerState(useStorage, nodeId)
    return (
        <div
            className={classNames(style.domContainer)}
            data-nodeid={nodeId}
            data-isdomtarget={true}
            data-isselectiontarget={true}
            style={{
                width: (1/containerState.scale) * containerState.width,
                height: (1/containerState.scale) * containerState.height,
                transform: `
                    translate(
                        ${containerState.x}px, 
                        ${containerState.y}px
                    )
                    scale(${containerState.scale})
                `,
            }}
        >
            {children}
        </div>
    )
}