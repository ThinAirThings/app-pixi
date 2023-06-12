import { useStorage } from "../../context/LiveblocksContext"
import { useCanvasInitialization } from "./useCanvasInitialization"
import { NodeComponentIndex } from "../../components/NodeComponentIndex"

export type ViewportState = {
    x: number
    y: number
    scale: number
}

export const InfiniteCanvas = () => { 
    // Initialize App 
    useCanvasInitialization()
    // Render Components
    const nodeMap = useStorage(root => root.nodeMap)
    return (
        <>
            {nodeMap&& [...nodeMap].map(([nodeId, nodeRef]) => {
                const Component = NodeComponentIndex[nodeRef.type].Component
                return (
                    <Component
                        key={nodeId}
                        nodeRef={nodeRef}
                    />
                )
            })}
        </>
    )

}