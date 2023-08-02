import { Dispatch, RefObject,  SetStateAction, useEffect } from "react"
import { fromEvent } from "rxjs"
import { NodeOption } from "./LanguageInterface"
import { useLanguageInterfaceActiveContext, useViewportStateContext } from "../../context/SpaceContext"
import { screenStateToAbsoluteState } from "@thinairthings/zoom-utils"
import { useMutationMySelectedNodeIds } from "../../hooks/liveblocks/useMutationMySelectedNodeIds"
import { useStorageMySelectedNodeIds } from "../../hooks/liveblocks/useStorageMySelectedNodeIds"
import { useMutationCreateNode } from "@thinairthings/liveblocks-model"
import { useMutation } from "../../context/LiveblocksContext"
import { UserCreatedNodeIndex } from "../../UserCreatedNodeIndex"


export const useArrowKeyNavigation = (
    searchbarInputRef: RefObject<HTMLInputElement>,
    options: Array<NodeOption>,
    selectionOptionIndex: number,
    setSelectedOptionIndex: Dispatch<SetStateAction<number>> 
) => {
    // State
    const [_, setLanguageInterfaceActive] = useLanguageInterfaceActiveContext()
    const [viewportState] = useViewportStateContext()
    const mySelectedNodeIds = useStorageMySelectedNodeIds()
    // Get Mutations
    const createNode = useMutationCreateNode(useMutation)
    const updateMySelectedNodeIds = useMutationMySelectedNodeIds()
    useEffect(() => {
        const subscription = fromEvent<KeyboardEvent>(window, 'keydown')
        .subscribe((event) => {
            if (event.key === 'ArrowUp') {
                setSelectedOptionIndex(prev => (prev > -1 ? prev - 1 : options.length - 1))
            }
            if (event.key === 'ArrowDown') {
                setSelectedOptionIndex(prev => (prev < options.length - 1 ? prev + 1 : -1))
            }
            if (selectionOptionIndex !== -1){
                if (event.key === 'Enter') {
                    const nodeComponentEntry = UserCreatedNodeIndex[options[selectionOptionIndex].key]
                    const absoluteScreenDims = screenStateToAbsoluteState(viewportState, {
                        width: window.innerWidth,
                        height: window.innerHeight
                    })
                    const newNodeId = createNode(({
                        key: options[selectionOptionIndex].key,
                        state: {
                            ...nodeComponentEntry.defaultProps,
                            containerState: {
                                x: absoluteScreenDims.width/2 - viewportState.x - nodeComponentEntry.defaultBoxSize.width / 2,
                                y: absoluteScreenDims.height/2 - viewportState.y - nodeComponentEntry.defaultBoxSize.height / 2,
                                width: nodeComponentEntry.defaultBoxSize.width,
                                height: nodeComponentEntry.defaultBoxSize.height,
                                scale: 1
                            }
                        }
                    }))
                    console.log('newNodeId', newNodeId)
                    updateMySelectedNodeIds([...mySelectedNodeIds, newNodeId])
                    setLanguageInterfaceActive(false)
                }
            }
        })
        return () => subscription?.unsubscribe()
    }, [selectionOptionIndex])
    useEffect(() => {
        if (selectionOptionIndex === -1) {
            searchbarInputRef.current!.focus()
        } else {
            searchbarInputRef.current!.blur()
        }
    }, [selectionOptionIndex])
}