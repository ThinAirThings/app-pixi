import { FC, ReactNode, useRef } from "react"
import { useInitializeCompositor } from "./hooks/useInitializeCompositor"
import classNames from "classnames"
import styles from "./Compositor.module.scss"

export const Compositor:FC<{children: ReactNode}> = ({children}) => {
    // Refs
    const compositorContainerRef = useRef<HTMLDivElement>(null)
    // Effects
    const compositorReady = useInitializeCompositor(compositorContainerRef.current)
    return (
        <>
            <div ref={compositorContainerRef} className={classNames(styles.compositor)}/>
            {compositorReady && children}
        </>
        
    )
}