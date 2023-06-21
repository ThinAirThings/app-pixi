import { useStorage } from "../../context/LiveblocksContext"

export const useStorageNodeMap = () => {
    return useStorage(root => root.nodeMap)
}