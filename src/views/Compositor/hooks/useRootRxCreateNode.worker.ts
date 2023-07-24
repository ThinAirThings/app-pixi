import { Updater } from "use-immer"
import { CompositorNode } from "../CompositorTreeRoot.worker"
import { ContainerState } from "@thinairthings/zoom-utils"
import { useNodeSignal } from "../../../hooks/useNodeSignal"

export const useRootRxCreateNode = (
    setCompositorNodeMap: Updater<Map<string, CompositorNode>>
) => {
    useNodeSignal<{
        nodeId: string
        containerState: ContainerState
    }>("worker", "root", "rxCreateNode", ({
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