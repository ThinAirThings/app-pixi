import { useEffect, useRef, useState } from "react"
import { compositorMainThreadWorkerClient } from "../../../views/Compositor/hooks/useInitializeCompositor"
import { ContainerState, ScreenState } from "@thinairthings/zoom-utils"
import { WorkerClient } from "@thinairthings/worker-client"
import { Updater } from "use-immer"
import { txNodeSignal } from "@thinairthings/react-utils"


export const useCompositorNode = (
    nodeId: string,
    containerState: ContainerState,
    setPopupWindows: Updater<Map<number, {
        pixmapId: number;
        screenState: ScreenState;
    }>>
) => {
    const [remoteCursorType, setRemoteCursorType] = useState<string>('default')
    const compositorNodePairWorkerClientRef = useRef<WorkerClient>()
    useEffect(() => {
        const messageChannel = new MessageChannel()
        compositorNodePairWorkerClientRef.current = new WorkerClient(messageChannel.port1, {
            "rxCursorType": (payload: {
                cursorType: string
            }) => {
                setRemoteCursorType(payload.cursorType)
            },
            "rxCreatePopupWindow": (payload: {
                pixmapId: number
                screenState: ScreenState
            }) => {
                setPopupWindows((popupWindows) => {
                    popupWindows.set(payload.pixmapId, {
                        pixmapId: payload.pixmapId,
                        screenState: payload.screenState
                    })
                })
            },
            "rxDeletePopupWindow": (payload: {
                pixmapId: number
            }) => {
                setPopupWindows((popupWindows) => {
                    popupWindows.delete(payload.pixmapId)
                })
            },
            "rxPopupDamage": (payload: {
                pixmapId: number
                dirtyRect: ScreenState
                dirtyBitmap: ImageBitmap
            }) => {
                txNodeSignal('main', payload.pixmapId.toString(), 'txPopupDamage', payload)
            }
        })
        compositorMainThreadWorkerClient.sendMessage("txCreateNode", {
            nodeId,
            containerState,
            messagePort: messageChannel.port2
        }, [messageChannel.port2])
        return () => {
            compositorMainThreadWorkerClient.sendMessage("txDeleteNode", {
                nodeId
            })
            compositorNodePairWorkerClientRef.current.cleanup()
        }
    }, [])
    return {
        remoteCursorType,
        compositorNodePairWorkerClientRef
    }
}