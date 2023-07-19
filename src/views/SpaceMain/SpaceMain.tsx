import { createContext, memo, useRef } from "react"
import { DomPixiContextBridge } from "../../context/DomPixiContextBridge"
import { useLanguageInterfaceActiveContext } from "../../context/SpaceContext"
import { useMainKeyboardEvents } from "../../hooks/useMainKeyboardEvents"
import { PixiCanvas } from "../InfiniteCanvas/PixiCanvas"
import { LanguageInterface } from "../LanguageInterface/LanguageInterface"
import { SelectionBoundingBox } from "../../components-dom/SelectionBoundingBox/SelectionBoundingBox"
import { SelectionBox } from "../../components-dom/SelectionBox/SelectionBox"
import classNames from "classnames"
import styles from "./SpaceMain.module.scss"
import { useMainPointerActions } from "../../hooks/mainPointerActions/useMainPointerActions"
import { TopLeftTag } from "../../components-dom/TopLeftTag/TopLeftTag"
import { DomComponentReferencePoint } from "../InfiniteCanvas/DomComponentReferencePoint"
import { useMainWheelActions } from "../../hooks/mainPointerActions/useMainWheelActions"
import { LeftToolbar } from "../../components-dom/LeftToolbar/LeftToolbar"
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
    useMainPointerActions(mainDivRef.current!)
    useMainWheelActions(mainDivRef.current!)
    useMainKeyboardEvents()

    return (
        <div ref={mainDivRef} className={classNames(styles.spaceMain)}>
            <MainDivContext.Provider value={mainDivRef.current}>
                <DomComponentReferencePoint/>
                <PixiMemo/>
                <SelectionBoundingBox/>
                <SelectionBox/>
                {languageInterfaceActive && <LanguageInterface/>}
                {/* <TopLeftTag/> */}
                <LeftToolbar/>
            </MainDivContext.Provider>
        </div>
    )
}
