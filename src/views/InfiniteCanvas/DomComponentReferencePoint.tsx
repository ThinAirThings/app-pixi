import classNames from "classnames"
import styles from "./DomComponentReferencePoint.module.scss"
import { useStorageComponentsArray } from "../../hooks/liveblocks/useStorageComponentsArray"
import { NodeComponentIndex } from "../../NodeComponentIndex"
import { memo, useRef } from "react"
import { useDomSmoothZooming } from "./hooks/useDomSmoothZooming"

const DomComponentArrayMemo = memo(({componentArray}: {componentArray: ReturnType<typeof useStorageComponentsArray>}) => {
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

export const DomComponentReferencePoint = () => {
    // Refs
    const referencePointRef = useRef<HTMLDivElement>(null)
    // State
    const componentsArray = useStorageComponentsArray('dom')
    // Effects
    useDomSmoothZooming(referencePointRef)
    // Render
    return (
        <div ref={referencePointRef} className={classNames(styles.referencePoint)}>
            <DomComponentArrayMemo componentArray={componentsArray}/>
        </div>
    )
}