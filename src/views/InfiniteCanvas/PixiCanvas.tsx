import { NodeComponentIndex } from "../../NodeComponentIndex"
import { usePixiPointerActions } from "./hooks/usePixiPointerActions"
import { usePixiViewportStage } from "./hooks/usePixiViewportStage"
import { memo } from "react"
import { useStorageComponentArray } from "../../hooks/liveblocks/useStorageComponentArray"
import { usePixiWheelActions } from "./hooks/usePixiWheelActions"

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
    usePixiViewportStage()
    usePixiPointerActions()
    usePixiWheelActions()
    // Render Components
    const componentArray = useStorageComponentArray()
    return (
        <ComponentArrayMemo componentArray={componentArray}/>
    )
}