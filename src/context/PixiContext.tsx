import { Stage } from "@pixi/react"
import { ReactNode, Suspense } from "react"
import { RoomContext, useRoom } from "./LiveblocksContext";

const rootElement = document.getElementById('root')!

export const PixiContextProvider = ({ children }: { children: ReactNode }) => { 
    const room = useRoom()
    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            options={{
                resizeTo: rootElement,
                background: '#111111',
                
            }} 
        >
            <RoomContext.Provider value={room}>
                <Suspense>
                    {children}
                </Suspense>
            </RoomContext.Provider>
        </Stage>
    )
}