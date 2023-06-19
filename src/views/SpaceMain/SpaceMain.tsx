import { LiveblocksRoomProvider } from "../../context/LiveblocksContext"
import { PixiProvider } from "../../context/PixiContext"
import { PixiCanvas } from "../InfiniteCanvas/PixiCanvas"
import { LanguageInterface } from "../LanguageInterface/LanguageInterface"


export const SpaceMain = () => {
    return (
        <LiveblocksRoomProvider>
            <LanguageInterface/>
            <PixiProvider>
                <PixiCanvas/>
            </PixiProvider>
        </LiveblocksRoomProvider>
    )
}