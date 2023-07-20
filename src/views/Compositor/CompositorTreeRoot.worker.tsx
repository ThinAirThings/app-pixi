import { useImmer } from "use-immer"
import { useRootRxCreateNode } from "./hooks/useRootRxCreateNode.worker"
import { useRootRxDeleteNode } from "./hooks/useRootRxDeleteNode.worker"
import { RenderTextureSprite } from "./RenderTextureImplementation/RenderTextureSprite.worker"
import { useRootRxViewportState } from "./hooks/useRootRxViewportState"
import { ContainerState } from "@thinairthings/zoom-utils"
import { BackbufferSprite } from "./BackbufferImplementation/BackbufferSprite.worker"
export type CompositorNode = {
    nodeId: string,
    containerState: ContainerState
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
                <BackbufferSprite
                    key={nodeId}
                    nodeId={nodeId}
                    initialContainerState={node.containerState}
                />
            )
        })}
    </>)
}