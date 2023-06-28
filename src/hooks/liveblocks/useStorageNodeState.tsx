import {  useStorage } from "../../context/LiveblocksContext"
import {ImmutableAirNode} from "@thinairthings/liveblocks-model"

export const useNodeState = <
    T extends Record<string, any>, 
    Key extends keyof ImmutableAirNode<T>['state']
>(
    nodeId: string, 
    key: Key
): ImmutableAirNode<T>['state'][Key] => {
    return useStorage(root => (root.nodeMap.get(nodeId) as ImmutableAirNode<T>)?.state[key])
}