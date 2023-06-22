import { Stage } from "@pixi/react"
import { ReactNode, Suspense } from "react"
import { RoomContext, useRoom } from "./LiveblocksContext";
import { SpaceMainContext, useViewportStateContext } from "./SpaceContext";

const rootElement = document.getElementById('root')!

const ViewportStateContext = SpaceMainContext.viewportStateContext[2]
export const DomPixiContextBridge = ({ children }: { children: ReactNode }) => { 
    const room = useRoom()
    const viewportStateContext = useViewportStateContext()
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
                <ViewportStateContext.Provider value={viewportStateContext}>
                    <Suspense>
                        {children}
                    </Suspense>
                </ViewportStateContext.Provider>
            </RoomContext.Provider>
        </Stage>
    )
}