import { ContainerState, useMutation } from "../../context/LiveblocksContext"


export const useMutationContainerState = () => {
    return useMutation(({storage}, nodeId: string, containerState: Partial<ContainerState>) => {
        storage.get("nodeMap")!.get(nodeId)?.get("state").get("containerState").update(containerState)
    }, [])
}