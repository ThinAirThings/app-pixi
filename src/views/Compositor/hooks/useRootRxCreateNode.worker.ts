import { useWorkerNodeSignal } from "./useWorkerNodeSignal.worker"
import { Updater } from "use-immer"
import { CompositorNode } from "../CompositorTreeRoot.worker"
import { ContainerState } from "@thinairthings/zoom-utils"

export const useRootRxCreateNode = (
    setCompositorNodeMap: Updater<Map<string, CompositorNode>>
) => {
    useWorkerNodeSignal<{
        nodeId: string
        containerState: ContainerState
    }>("root", "rxCreateNode", ({
        nodeId,
        containerState,
    }) => {
        setCompositorNodeMap((draft) => {
            draft.set(nodeId, {
                nodeId,
                containerState
            })
        })
    })
}