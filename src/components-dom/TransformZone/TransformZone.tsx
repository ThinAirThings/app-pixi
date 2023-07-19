import { ScreenState } from "@thinairthings/zoom-utils"
import { TransformTargetType } from "../../hooks/mainPointerActions/useMainPointerActions"
import styles from "./TransformZone.module.scss"
import classNames from "classnames"

const transformZoneSize = 10
export const TransformZone = ({
    transformTargetType,
    boxBounds
}: {
    transformTargetType: TransformTargetType
    boxBounds: ScreenState
}) => {
    return (
        <div
            data-isdomtarget={true}
            data-istransformtarget={true}
            data-transformtargettype={transformTargetType}
            className={classNames(styles.transformZone, styles[transformTargetType])}
            style={{
                top: `-${transformZoneSize/2}px`,
                left: `-${transformZoneSize/2}px`,
                width: `${(() => {
                    switch(true) {
                        case transformTargetType === "topMiddle"  
                        || transformTargetType === "bottomMiddle":  return `${boxBounds.width - transformZoneSize}px`
                        default: return `${transformZoneSize}px`
                    }
                })()}`,
                height: `${(() => {
                    switch(true) {
                        case transformTargetType === "middleLeft"
                        || transformTargetType === "middleRight": return `${boxBounds.height - transformZoneSize}px`
                        default: return `${transformZoneSize}px`
                    }
                })()}`,
                transform: `translate(
                    ${(() => {
                        switch(transformTargetType) {
                            case "topLeft": return `${boxBounds.x}px, ${boxBounds.y}px`
                            case "topMiddle": return `${boxBounds.x + transformZoneSize}px, ${boxBounds.y}px`
                            case "topRight": return `${boxBounds.x + boxBounds.width}px, ${boxBounds.y}px`
                            case "middleRight": return `${boxBounds.x + boxBounds.width}px, ${boxBounds.y+transformZoneSize}px`
                            case "bottomRight": return `${boxBounds.x + boxBounds.width}px, ${boxBounds.y + boxBounds.height}px`
                            case "bottomMiddle": return `${boxBounds.x + transformZoneSize}px, ${boxBounds.y + boxBounds.height}px`
                            case "bottomLeft": return `${boxBounds.x}px, ${boxBounds.y + boxBounds.height}px`
                            case "middleLeft": return `${boxBounds.x}px, ${boxBounds.y + transformZoneSize}px`
                        }
                    })()}
                )`
            }}
        />


    )
}