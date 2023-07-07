import { Stage } from "@pixi/react"
import { ReactNode, Suspense } from "react"
import { RoomContext, useRoom } from "./LiveblocksContext";
import { SpaceMainContext, SpaceMetaContext, useSpaceDetailsContext, useViewportStateContext } from "./SpaceContext";
import { UserContext, useUserDetailsContext } from "./UserContext";

const rootElement = document.getElementById('root')!

const ViewportStateContext = SpaceMainContext.viewportStateContext[2]
const UserDetailsContext = UserContext.userDetailsContext[2]
const SpaceDetailsContext = SpaceMetaContext.spaceDetailsContext[2]
export const DomPixiContextBridge = ({ children }: { children: ReactNode }) => { 
    const room = useRoom()
    const viewportStateContext = useViewportStateContext()
    const userDetailsContext = useUserDetailsContext()
    const spaceDetailsContext = useSpaceDetailsContext()
    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            options={{
                resizeTo: rootElement,
                background: '#2e2f30', 
            }} 
        >
            <RoomContext.Provider value={room}>
                <UserDetailsContext.Provider value={userDetailsContext}>
                    <SpaceDetailsContext.Provider value={spaceDetailsContext}>
                        <ViewportStateContext.Provider value={viewportStateContext}>
                            <Suspense>
                                {children}
                            </Suspense>
                        </ViewportStateContext.Provider>
                    </SpaceDetailsContext.Provider>
                </UserDetailsContext.Provider>
            </RoomContext.Provider>
        </Stage>
    )
}