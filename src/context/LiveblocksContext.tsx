
import { ReactNode, Suspense } from 'react';
import { LiveMap, createClient} from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'
import { ThinAirClient } from '../clients/ThinAirClient/ThinAirClient';
import { GetLiveblocksTokenCommand } from '../clients/ThinAirClient/commands/liveblocks/GetLiveblocksTokenCommand';
import { useParams } from 'react-router-dom';
import { useUserDetailsContext } from './UserContext';
import { Point, ScreenState, ViewportState } from '@thinairthings/zoom-utils';
import { LiveblocksStorageModel} from "@thinairthings/liveblocks-model"

export type LiveblocksPresence = {
    displayName: string
    absoluteCursorState: Point | null
    viewportState: ViewportState
    mouseSelectionState: {
        selectionActive: boolean
        absoluteSelectionBounds: ScreenState | null
    }
    selectedNodes: string[]
    focusedNode: string | null
}

let _userId: string
let _accessToken: string
let spaceId: string
export const {
    suspense: {
        useRoom,
        useMyPresence,
        useUpdateMyPresence,
        useOthersMapped,
        useStorage,
        RoomProvider,
        useMutation,
        useSelf,
        RoomContext
    }
} = createRoomContext<LiveblocksPresence, LiveblocksStorageModel, {id: string}>(createClient({
        authEndpoint: async (): Promise<{token: string}> => {
            const thinAirClient = new ThinAirClient(import.meta.env.VITE_ROOT_DOMAIN, {
                accessToken: _accessToken,
                userId: _userId
            })
            const token = await thinAirClient.send(new GetLiveblocksTokenCommand({
                spaceId
            }))
            return token
        },
    }
))

export const LiveblocksRoomProvider = ({
    children
}: {
     children: ReactNode
}) => {
    const [userDetails] = useUserDetailsContext()
    const params = useParams() 
    _userId = userDetails.userId! // This is set in the auth background. Read createRoomContext docs for more info
    _accessToken = userDetails.accessToken!
    return (
        <RoomProvider
            id={params.spaceId as string}
            initialPresence={{
                displayName: '', 
                absoluteCursorState: {x: 0, y: 0},
                viewportState: {
                    x: 0,
                    y: 0,
                    scale: 1
                },
                mouseSelectionState: {
                    selectionActive: false,
                    absoluteSelectionBounds: null
                },
                selectedNodes: [],
                focusedNode: null
            }}
            initialStorage={{
                nodeMap: new LiveMap([
                    //[initialNode.get("nodeId"), initialNode]
                ])
            }}
        >
            <Suspense>
                {children}
            </Suspense> 
        </RoomProvider>
    )
}