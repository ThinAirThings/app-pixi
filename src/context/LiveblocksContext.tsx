
import { ReactNode, Suspense } from 'react';
import { LiveMap, LiveObject, LsonObject, createClient} from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'
import {v4 as uuidv4} from 'uuid'
import { NodeTypeIndex } from '../components-canvas/NodeComponentIndex';
import { ThinAirClient } from '../clients/ThinAirClient/ThinAirClient';
import { GetLiveblocksTokenCommand } from '../clients/ThinAirClient/commands/liveblocks/GetLiveblocksTokenCommand';
import { useParams } from 'react-router-dom';
import { useUserDetailsContext } from './UserContext';

export type NodeId = string
export type AirNode<T extends {[key: string]: any}={}> = LiveObject<{
    nodeId: string
    type: keyof NodeTypeIndex
    state: LiveObject<T&
        {containerState: LiveObject<ContainerState>
    }>
    children: LiveMap<string, AirNode<any>>
}>
export type ImmutableAirNode<T extends {[key: string]: any}={}> = ReturnType<AirNode<T>["toImmutable"]>

export type ContainerState = {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
}
export const createAirNode = <T extends LsonObject={}> ({
    type,
    state
}: {
    type: keyof NodeTypeIndex
    state: T&{containerState: ContainerState}
}): AirNode<T> => new LiveObject({
    nodeId: uuidv4(),
    type,
    state: new LiveObject({
        ...state,
        containerState: new LiveObject(state.containerState)
    }),
    children: new LiveMap()
})
export type LiveblocksPresence = {
    displayName: string
    cursor: {x: number, y: number} | null
    viewportState: {
        x: number
        y: number
        scale: number
    }
    selectedNodes: string[]
    focusedNode: string | null
}
export type LiveblocksStorage = {
    nodeMap: LiveMap<string, AirNode<any>>
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
} = createRoomContext<LiveblocksPresence, LiveblocksStorage, {id: string}>(createClient({
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
                cursor: {x: 0, y: 0},
                viewportState: {
                    x: 0,
                    y: 0,
                    scale: 1
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