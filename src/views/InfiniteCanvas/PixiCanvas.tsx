import { NodeComponentIndex } from "../../NodeComponentIndex"
import { usePixiViewportStage } from "./hooks/usePixiViewportStage"
import { memo } from "react"
import { useStorageComponentArray } from "../../hooks/liveblocks/useStorageComponentArray"
import { useWheelActions } from "../../hooks/pointerActions/useWheelActions"
import { usePointerActions } from "../../hooks/pointerActions/usePointerActions"
import { useApp } from "@pixi/react"

export const ComponentArrayMemo = memo(({componentArray}: {componentArray: ReturnType<typeof useStorageComponentArray>}) => {
    return (
        <>
            {componentArray.map((componentSpec) => {
                const Component = NodeComponentIndex[componentSpec.type].Component
                return (
                    <Component
                        key={componentSpec.nodeId}
                        nodeId={componentSpec.nodeId}
                    />
                )
            })}
        </>
    )
})
export const PixiCanvas = () => { 
    // Initialize App 
    const app = useApp()
    usePixiViewportStage()
    usePointerActions(app.stage)
    useWheelActions(app.stage)
    // Render Components
    const componentArray = useStorageComponentArray()
    return (
        <ComponentArrayMemo componentArray={componentArray}/>
    )
}