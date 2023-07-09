import { ReactNode } from "react"
import { useStorageContainerState } from "../../hooks/liveblocks/useStorageContainerState"
import style from "./DomContainer.module.scss"
import classNames from "classnames"

export const DomContainer = ({nodeId, children}: {
    nodeId: string
    children?: ReactNode
}) => {
    const containerState = useStorageContainerState(nodeId)
    console.log(containerState)
    return (
        <div
            className={classNames(style.domContainer)}
            data-nodeid={nodeId}
            data-isdomtarget={true}
            data-isselectiontarget={true}
            style={{
                width: containerState.width,
                height: containerState.height,
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