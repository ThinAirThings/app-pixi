import { ReactNode } from "react"
import { useStorageContainerState } from "../../hooks/liveblocks/useStorageContainerState"

export const DomContainer = ({nodeId, children}: {
    nodeId: string
    children?: ReactNode
}) => {
    const containerState = useStorageContainerState(nodeId)
    return (
        <div
            data-nodeid={nodeId}
            data-isdomtarget={true}
            data-isselectiontarget={true}
            style={{
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