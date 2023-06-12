
import { ReactNode, Suspense } from 'react';
import { useSpaceDetailsContext } from './SpaceContext';
import { LiveMap, LiveObject, LsonObject, createClient} from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'
import {v4 as uuidv4} from 'uuid'
import { websocketFetch } from '@thinairthings/websocket-client';
import { NodeTypeIndex } from '../components/NodeComponentIndex';

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

let userId: string
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
        useSelf
    }
} = createRoomContext<LiveblocksPresence, LiveblocksStorage, {id: string}>(createClient({
        authEndpoint: async (): Promise<{token: string}> => {
            const token = await websocketFetch({
                url: 'wss://devliveblocks.api.thinair.cloud', 
                action: "get-token",
                payload:{
                    userId,
                    spaceId
                }
            }) as {
                token: string
            }
            return token
        },
    }
))

export const LiveblocksRoomProvider = ({children, _userId}: {children: ReactNode, _userId?: string}) => {
    const [spaceDetails] = useSpaceDetailsContext()

    userId = userId??_userId??uuidv4()  // This is set in the auth background. Read createRoomContext docs for more info
    spaceId = spaceDetails.id
    return (
        <RoomProvider
            id={spaceDetails.id}
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
            <Suspense fallback={<div>loading...</div>}>
                {children}
            </Suspense> 
        </RoomProvider>
    )
}