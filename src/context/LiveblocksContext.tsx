
import { ReactNode, Suspense, useEffect } from 'react';
import { LiveMap, createClient} from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'
import { ThinAirClient } from '../clients/ThinAirClient/ThinAirClient';
import { GetLiveblocksTokenCommand } from '../clients/ThinAirClient/commands/liveblocks/GetLiveblocksTokenCommand';
import { useParams } from 'react-router-dom';
import { useUserDetailsContext } from './UserContext';
import { LiveblocksPresence, LiveblocksStorageModel} from "@thinairthings/liveblocks-model"
import { useThinAirClient } from '../clients/ThinAirClient/useThinAirClient';
import { GetSpaceCommand } from '../clients/ThinAirClient/commands/liveblocks/GetSpaceCommand';
import { useSpaceDetailsContext } from './SpaceContext';


let _userId: string
let _accessToken: string
let _spaceId: string
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
        RoomContext,
        useHistory,
        useCanUndo,
        useUndo,
        useCanRedo,
        useRedo,
    }
} = createRoomContext<LiveblocksPresence, LiveblocksStorageModel, {id: string}>(createClient({
        authEndpoint: async (): Promise<{token: string}> => {
            const thinAirClient = new ThinAirClient(import.meta.env.VITE_ROOT_DOMAIN, {
                accessToken: _accessToken,
                userId: _userId
            })
            const token = await thinAirClient.send(new GetLiveblocksTokenCommand({
                spaceId: _spaceId
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
    const [_, setSpaceDetailsContext] = useSpaceDetailsContext() // This is set in the auth background. Read createRoomContext docs for more info
    const thinAirClient = useThinAirClient()
    const params = useParams() 
    _spaceId = params.spaceId as string
    _userId = userDetails.userId! // This is set in the auth background. Read createRoomContext docs for more info
    _accessToken = userDetails.accessToken!
    useEffect(() => {
        (async () => {
            const result = await thinAirClient.send(new GetSpaceCommand({
                spaceId: params.spaceId as string,
            })); 
            setSpaceDetailsContext(draft => {
                draft.spaceDisplayName = result.spaceDisplayName
                draft.spaceId = params.spaceId!
                draft.initialized = true
            }) 
        })()
    }, [])
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
                selectedNodeIds: [],
                focusedNodeId: null
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