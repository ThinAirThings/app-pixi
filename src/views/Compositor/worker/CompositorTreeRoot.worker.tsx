import { Updater, useImmer } from "use-immer"
import { useRootRxCreateNode } from "../hooks/useRootRxCreateNode.worker"
import { useRootRxDeleteNode } from "../hooks/useRootRxDeleteNode.worker"
import { useRootRxViewportState } from "../hooks/useRootRxViewportState"
import { ContainerState } from "@thinairthings/zoom-utils"
import { ApplicationSprite } from "./ApplicationSprite/ApplicationSprite.worker"
export type CompositorNode = {
    nodeId: string,
    containerState: ContainerState,
    messagePort: MessagePort
}

export const CompositorTreeRoot = () => {
    // State
    const [
        compositorNodeMap, 
        setCompositorNodeMap
    ] = useImmer<Map<string, CompositorNode>>(new Map())
    // Effects
    useRootRxCreateNode(setCompositorNodeMap)
    useRootRxDeleteNode(setCompositorNodeMap)
    useRootRxViewportState()
    return (<>
        {Array.from(compositorNodeMap).map(([nodeId, node]) => {
            return (
                <ApplicationSprite
                    key={nodeId}
                    nodeId={nodeId}
                    initialContainerState={node.containerState}
                    messagePort={node.messagePort}
                />
            )
        })}
    </>)
}