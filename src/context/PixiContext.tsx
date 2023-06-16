import { Stage } from "@pixi/react"
import { ReactNode } from "react"
import { LiveblocksRoomProvider } from "./LiveblocksContext";
import { useUserDetailsContext } from "./UserContext";
import { useParams } from "react-router-dom";

const rootElement = document.getElementById('root')!

export const PixiProvider = ({ children }: { children: ReactNode }) => { 
    const [userDetails] = useUserDetailsContext()
    const params = useParams()
    console.log(userDetails)
    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            options={{
                resizeTo: rootElement,
                background: '#1c1c1c',
            }}
        >
            <LiveblocksRoomProvider
                spaceId={params.spaceId as string}
                accessToken={userDetails?.accessToken!}
                userId={userDetails?.userId!}
            >
                {children}
            </LiveblocksRoomProvider>
        </Stage>
    )
}