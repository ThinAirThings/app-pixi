import { NodeComponentIndex } from "../../NodeComponentIndex"
import { usePixiPointerActions } from "./hooks/usePixiPointerActions"
import { usePixiInitializeStage } from "./hooks/usePixiInitializeStage"
import { memo } from "react"
import { useStorageComponentArray } from "../../hooks/liveblocks/useStorageComponentArray"
export type ViewportState = {
    x: number
    y: number
    scale: number
}

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
    usePixiInitializeStage()
    usePixiPointerActions()
    // Render Components
    const componentArray = useStorageComponentArray()
    return (
        <ComponentArrayMemo componentArray={componentArray}/>
    )
}