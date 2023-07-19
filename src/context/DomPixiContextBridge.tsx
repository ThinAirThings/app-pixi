import { Stage } from "@pixi/react"
import { ReactNode, Suspense } from "react"
import { RoomContext, useRoom } from "./LiveblocksContext";
import { SpaceMainContext, SpaceMetaContext, useGhostContainersContext, useSpaceDetailsContext, useViewportStateContext } from "./SpaceContext";
import { UserContext, useUserDetailsContext } from "./UserContext";

const rootElement = document.getElementById('root')!

const ViewportStateContext = SpaceMainContext.viewportStateContext[2]
const GhostContainersContext = SpaceMainContext.ghostContainersContext[2]
const UserDetailsContext = UserContext.userDetailsContext[2]
const SpaceDetailsContext = SpaceMetaContext.spaceDetailsContext[2]
export const DomPixiContextBridge = ({ children }: { children: ReactNode }) => { 
    const room = useRoom()
    const viewportStateContext = useViewportStateContext()
    const ghostContainersContext = useGhostContainersContext()
    const userDetailsContext = useUserDetailsContext()
    const spaceDetailsContext = useSpaceDetailsContext()
    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            options={{
                resizeTo: rootElement,
                backgroundAlpha: 0
            }} 
        >
            <RoomContext.Provider value={room}>
                <UserDetailsContext.Provider value={userDetailsContext}>
                    <SpaceDetailsContext.Provider value={spaceDetailsContext}>
                        <ViewportStateContext.Provider value={viewportStateContext}>
                            <GhostContainersContext.Provider value={ghostContainersContext}>
                                <Suspense>
                                    {children}
                                </Suspense>
                            </GhostContainersContext.Provider>
                        </ViewportStateContext.Provider>
                    </SpaceDetailsContext.Provider>
                </UserDetailsContext.Provider>
            </RoomContext.Provider>
        </Stage>
    )
}