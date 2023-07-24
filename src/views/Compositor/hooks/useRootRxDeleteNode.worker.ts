import { Updater } from "use-immer"
import { useNodeSignal } from "../../../hooks/useNodeSignal"
import { CompositorNode } from "../CompositorTreeRoot.worker"

export const useRootRxDeleteNode = (
    setCompositorNodeMap: Updater<Map<string, CompositorNode>>
) => {
    useNodeSignal<{
        nodeId: string
    }>("worker", "root", "rxDeleteNode", ({
        nodeId,
    }) => {
        setCompositorNodeMap((draft) => {
            draft.delete(nodeId)
        })
    })
}