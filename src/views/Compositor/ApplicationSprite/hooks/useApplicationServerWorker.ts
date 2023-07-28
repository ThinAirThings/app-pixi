import { WorkerClient } from "@thinairthings/worker-client"
import { MutableRefObject, useEffect, useRef } from "react"
import ApplicationServerWorker from "../ApplicationServerWorker.worker?worker"
import { ContainerState, ScreenState } from "@thinairthings/zoom-utils"
import { Texture } from "@pixi/webworker"
import { ApplicationTextureResource } from "../webgl/ApplicationTextureResource"
import { Updater } from "use-immer"
import {txNodeSignal} from "@thinairthings/react-utils"
export const useApplicationServerWorker = (
    nodeId: string,
    containerState: ContainerState,
    applicationTextureRef: MutableRefObject<Texture<ApplicationTextureResource>>,
    messagePort: MessagePort,
    setPopupWindows: Updater<Map<number, {
        pixmapId: number;
        screenState: ScreenState;
    }>>
) => {
    // Refs
    const applicationTextureWorkerClientRef = useRef<WorkerClient>(null)
    // Effects
    useEffect(() => {
        applicationTextureWorkerClientRef.current = new WorkerClient(new ApplicationServerWorker(), {
            'rxFrameDamage': async ({dirtyBitmap, dirtyRect}: {
                dirtyBitmap: ImageBitmap
                dirtyRect: ScreenState
            }) => {
                applicationTextureRef.current.baseTexture.resource.uploadDirtyFrame(
                    dirtyRect,
                    dirtyBitmap
                )
            },
            'rxCreatePopupWindow': async ({pixmapId, screenState}: {
                pixmapId: number
                screenState: ScreenState
            }) => {
                setPopupWindows((popupWindows) => {
                    popupWindows.set(pixmapId, {
                        pixmapId,
                        screenState
                    })
                })
            },
            "rxPopupDamage": async (payload: {
                pixmapId: number
                dirtyRect: ScreenState
                dirtyBitmap: ImageBitmap
            }) => {
                const {pixmapId, dirtyRect, dirtyBitmap} = payload
                txNodeSignal("worker", pixmapId.toString(), "txPopupDamage", {
                    dirtyRect,
                    dirtyBitmap
                })
            },
            "rxDeletePopupWindow": async ({pixmapId}: {
                pixmapId: number
            }) => {
                setPopupWindows((popupWindows) => {
                    popupWindows.delete(pixmapId)
                })
            }
        })
        applicationTextureWorkerClientRef.current.sendMessage('initialize', {
            serverUrl: `http://${import.meta.env.VITE_SERVER_HOST}:3000`,
            nodeId: nodeId,
            containerState,
            mainThreadPairMessagePort: messagePort
        }, [messagePort])
        return () => {
            applicationTextureWorkerClientRef.current?.cleanup()
        }
    }, [])

}