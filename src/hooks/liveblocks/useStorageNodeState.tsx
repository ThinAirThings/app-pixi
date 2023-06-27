import { ImmutableAirNode, useStorage } from "../../context/LiveblocksContext"


export const useNodeState = <
    T extends Record<string, any>, 
    Key extends keyof ImmutableAirNode<T>['state']
>(
    nodeId: string, 
    key: Key
): ImmutableAirNode<T>['state'][Key] => {
    return useStorage(root => (root.nodeMap.get(nodeId) as ImmutableAirNode<T>)?.state[key])
}