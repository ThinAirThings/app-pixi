import {  useApp } from "@pixi/react"
import {  useEffect } from "react"
import { Rectangle } from "pixi.js"
import { useStorage } from "../../context/LiveblocksContext"
import { NodeComponentIndex } from "../../components-canvas/NodeComponentIndex"

export type ViewportState = {
    x: number
    y: number
    scale: number
}
export const PixiCanvas = () => { 
    // Initialize App 
    const app = useApp()
    useEffect(() => {
        // Run all stage initialization code
        app.stage.eventMode = 'auto'
        app.stage.hitArea = new Rectangle(-1e+6, -1e+6, 1e+6, 1e+6) // Oversize the hit area for scaling
    }, [])
    // Render Components
    const nodeMap = useStorage(root => root.nodeMap)
    console.log(nodeMap)
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