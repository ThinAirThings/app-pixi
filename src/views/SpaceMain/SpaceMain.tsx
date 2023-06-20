import { memo } from "react"
import { PixiContextProvider } from "../../context/PixiContext"
import { useLanguageInterfaceActiveContext } from "../../context/SpaceContext"
import { useMainKeyboardEvents } from "../../hooks/useMainKeyboardEvents"
import { PixiCanvas } from "../InfiniteCanvas/PixiCanvas"
import { LanguageInterface } from "../LanguageInterface/LanguageInterface"

// Keep the Pixi component from rendering when the language interface toggle runs
const PixiMemo = memo(() => {
    return (
        <PixiContextProvider>
            <PixiCanvas/>
        </PixiContextProvider>
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
            <PixiMemo/>
        </>
    )
}
