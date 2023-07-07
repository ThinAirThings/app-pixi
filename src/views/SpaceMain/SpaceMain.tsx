import { memo, useEffect, useRef } from "react"
import { DomPixiContextBridge } from "../../context/DomPixiContextBridge"
import { useLanguageInterfaceActiveContext, useSpaceDetailsContext } from "../../context/SpaceContext"
import { useMainKeyboardEvents } from "../../hooks/useMainKeyboardEvents"
import { PixiCanvas } from "../InfiniteCanvas/PixiCanvas"
import { LanguageInterface } from "../LanguageInterface/LanguageInterface"
import { SelectionBoundingBox } from "../../components-dom/SelectionBoundingBox/SelectionBoundingBox"
import { SelectionBox } from "../../components-dom/SelectionBox/SelectionBox"
import classNames from "classnames"
import styles from "./SpaceMain.module.scss"
import { usePointerActions } from "../../hooks/pointerActions/usePointerActions"
import { TopLeftTag } from "../../components-dom/TopLeftTag/TopLeftTag"
// Keep the Pixi component from rendering when the language interface toggle runs
const PixiMemo = memo(() => {
    return (
        <DomPixiContextBridge>
            <PixiCanvas/>
        </DomPixiContextBridge>
    )
})
export const SpaceMain = () => {
    // Refs
    const spaceMainRef = useRef<HTMLDivElement>(null)
    // State
    const [languageInterfaceActive] = useLanguageInterfaceActiveContext()
    // Effects
    usePointerActions(spaceMainRef.current!)
    useMainKeyboardEvents()

    return (
        <div ref={spaceMainRef} className={classNames(styles.spaceMain)}>
            <TopLeftTag/>
            {languageInterfaceActive && <LanguageInterface/>}
            <SelectionBox/>
            <SelectionBoundingBox/>

            <PixiMemo/>
        </div>
    )
}
