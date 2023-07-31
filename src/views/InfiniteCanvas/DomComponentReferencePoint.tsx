import classNames from "classnames"
import styles from "./DomComponentReferencePoint.module.scss"
import { useStorageComponentsArray } from "../../hooks/liveblocks/useStorageComponentsArray"
import { createContext, memo, useRef } from "react"
import { useDomSmoothZooming } from "./hooks/useDomSmoothZooming"
import { useGhostContainersContext } from "../../context/SpaceContext"
import { GhostContainer } from "../../components-dom/GhostContainer/GhostContainer"
import { DomComponentNodeIndex } from "../../components-dom/DomComponentNodeIndex"

const DomComponentArrayMemo = memo(({componentArray}: {componentArray: ReturnType<typeof useStorageComponentsArray<'dom'>>}) => {
    return (
        <>  
            {componentArray.map((componentSpec) => {
                const Component = DomComponentNodeIndex[componentSpec.key].DomComponent
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

export const DomComponentReferencePointContext = createContext<HTMLDivElement>(null)
export const DomComponentReferencePoint = () => {
    // Refs
    const referencePointRef = useRef<HTMLDivElement>(null)
    // State
    const componentsArray = useStorageComponentsArray('dom')
    const [ghostContainers] = useGhostContainersContext()
    // Effects
    useDomSmoothZooming(referencePointRef)
    // Render
    return (
        <div ref={referencePointRef} className={classNames(styles.referencePoint)}>
            <DomComponentReferencePointContext.Provider value={referencePointRef.current}>
                <DomComponentArrayMemo componentArray={componentsArray}/>
                {ghostContainers.map(({nodeId, containerState}) => <GhostContainer
                    key={nodeId}
                    nodeId={nodeId}
                    containerState={containerState}
                />)}
            </DomComponentReferencePointContext.Provider>
        </div>
    )
}