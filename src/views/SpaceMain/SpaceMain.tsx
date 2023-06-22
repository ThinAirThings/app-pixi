import { memo } from "react"
import { DomPixiContextBridge } from "../../context/DomPixiContextBridge"
import { useLanguageInterfaceActiveContext } from "../../context/SpaceContext"
import { useMainKeyboardEvents } from "../../hooks/useMainKeyboardEvents"
import { PixiCanvas } from "../InfiniteCanvas/PixiCanvas"
import { LanguageInterface } from "../LanguageInterface/LanguageInterface"
import { SelectionBoundingBox } from "../../components-feedback/SelectionBoundingBox/SelectionBoundingBox"
import { SelectionBox } from "../../components-feedback/SelectionBox/SelectionBox"

// Keep the Pixi component from rendering when the language interface toggle runs
const PixiMemo = memo(() => {
    return (
        <DomPixiContextBridge>
            <PixiCanvas/>
        </DomPixiContextBridge>
    )
})
export const SpaceMain = () => {
    // State
    const [languageInterfaceActive] = useLanguageInterfaceActiveContext()
    // Effects
    useMainKeyboardEvents()
    return (
        <>
            {languageInterfaceActive && <LanguageInterface/>}
            <SelectionBox/>
            <SelectionBoundingBox/>
            <PixiMemo/>
        </>
    )
}
