import { Updater } from "use-immer"
import { useWorkerNodeSignal } from "./useWorkerNodeSignal.worker"
import { CompositorNode } from "../../CompositorTreeRoot.worker"

export const useRootRxDeleteNode = (
    setCompositorNodeMap: Updater<Map<string, CompositorNode>>
) => {
    useWorkerNodeSignal<{
        nodeId: string
    }>("root", "rxDeleteNode", ({
        nodeId,
    }) => {
        setCompositorNodeMap((draft) => {
            draft.delete(nodeId)
        })
    })
}