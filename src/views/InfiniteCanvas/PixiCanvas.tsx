import { NodeComponentIndex } from "../../NodeComponentIndex"
import { usePixiViewportStage } from "./hooks/usePixiViewportStage"
import { memo } from "react"
import { useStorageComponentsArray } from "../../hooks/liveblocks/useStorageComponentsArray"
import { useWheelActions } from "../../hooks/pointerActions/useWheelActions"
import { useMainPointerActions } from "../../hooks/pointerActions/useMainPointerActions"
import { useApp } from "@pixi/react"

export const ComponentArrayMemo = memo(({componentArray}: {componentArray: ReturnType<typeof useStorageComponentsArray>}) => {
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
    useMainPointerActions(app.stage)
    useWheelActions(app.stage)
    // Render Components
    const componentArray = useStorageComponentsArray('pixi')
    return (
        <ComponentArrayMemo componentArray={componentArray}/>
    )
}