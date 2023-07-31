import { forwardRef, useImperativeHandle, useRef } from "react";
import { useDomSmoothZooming } from "./hooks/useDomSmoothZooming";
import styles from "./PopupReferencePoint.module.scss";


export const PopupReferencePoint = forwardRef<HTMLDivElement>(({}, ref) => {
    // Refs
    const referencePointRef = useRef<HTMLDivElement>(null)
    // Forward Ref
    useImperativeHandle(ref, () => referencePointRef.current)
    // Effects
    useDomSmoothZooming(referencePointRef)
    return (
        <div ref={referencePointRef} className={styles.popupReferencePoint}/>
    )
})