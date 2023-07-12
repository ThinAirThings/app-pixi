import { createContext, memo, useRef, useState } from "react"
import { DomPixiContextBridge } from "../../context/DomPixiContextBridge"
import { useLanguageInterfaceActiveContext } from "../../context/SpaceContext"
import { useMainKeyboardEvents } from "../../hooks/useMainKeyboardEvents"
import { PixiCanvas } from "../InfiniteCanvas/PixiCanvas"
import { LanguageInterface } from "../LanguageInterface/LanguageInterface"
import { SelectionBoundingBox } from "../../components-dom/SelectionBoundingBox/SelectionBoundingBox"
import { SelectionBox } from "../../components-dom/SelectionBox/SelectionBox"
import classNames from "classnames"
import styles from "./SpaceMain.module.scss"
import { usePointerActions } from "../../hooks/pointerActions/usePointerActions"
import { TopLeftTag } from "../../components-dom/TopLeftTag/TopLeftTag"
import { DomComponentReferencePoint } from "../InfiniteCanvas/DomComponentReferencePoint"
import { useWheelActions } from "../../hooks/pointerActions/useWheelActions"
// Keep the Pixi component from rendering when the language interface toggle runs
const PixiMemo = memo(() => {
    return (
        <DomPixiContextBridge>
            <PixiCanvas/>
        </DomPixiContextBridge>
    )
})

export const MainDivContext = createContext<HTMLDivElement | null>(null)
export const SpaceMain = () => {
    // Refs
    const mainDivRef = useRef<HTMLDivElement>(null)
    // State
    const [languageInterfaceActive] = useLanguageInterfaceActiveContext()
    // Effects
    usePointerActions(mainDivRef.current!)
    useWheelActions(mainDivRef.current!)
    useMainKeyboardEvents()

    return (
        <div ref={mainDivRef} className={classNames(styles.spaceMain)}>
            <MainDivContext.Provider value={mainDivRef.current}>
                <TopLeftTag/>
                {languageInterfaceActive && <LanguageInterface/>}
                <SelectionBox/>
                <SelectionBoundingBox/>
                <DomComponentReferencePoint/>
                <PixiMemo/>
            </MainDivContext.Provider>
        </div>
    )
}
