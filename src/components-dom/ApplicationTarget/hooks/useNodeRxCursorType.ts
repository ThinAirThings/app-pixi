import { useState } from "react";
import { useNodeSignal } from "../../../hooks/useNodeSignal";


export const useNodeRxCursorType = (
    nodeId: string,
    targetRef: React.MutableRefObject<HTMLDivElement | null>,
) => {
    const [cursorState, setCursorState] = useState<string>('default') 
    useNodeSignal<{
        cursorType: string
    }>('main', nodeId, 'rxCursorType', ({
        cursorType
    }) => {
        if (!targetRef.current) return
        setCursorState(cursorType)
    })
    return cursorState
}