import { Dispatch, RefObject,  SetStateAction, useEffect } from "react"
import { fromEvent } from "rxjs"
import { NodeOption } from "./LanguageInterface"
import { NodeComponentIndex } from "../../NodeComponentIndex"
import { useMutationCreateNode } from "../../hooks/liveblocks/useMutationCreateNode"


export const useArrowKeyNavigation = (
    searchbarInputRef: RefObject<HTMLInputElement>,
    options: Array<NodeOption>,
    selectionOptionIndex: number,
    setSelectedOptionIndex: Dispatch<SetStateAction<number>> 
) => {
    // Get Mutations
    const createNodeComponent = useMutationCreateNode()
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
                    const nodeComponentEntry = NodeComponentIndex[options[selectionOptionIndex].type]
                    createNodeComponent(({
                        type: options[selectionOptionIndex].type,
                        state: {
                            containerState: {
                                x: 200,
                                y: 200,
                                width: nodeComponentEntry.defaultBoxSize.width,
                                height: nodeComponentEntry.defaultBoxSize.height,
                                scale: 1
                            }
                        }
                    }))
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