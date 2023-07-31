import { WorkerClient } from "@thinairthings/worker-client"
import { MutableRefObject, useEffect, useRef } from "react"
import ApplicationServerWorker from "../worker/ApplicationServerWorker.worker?worker"
import { ContainerState, ScreenState } from "@thinairthings/zoom-utils"
import { Texture } from "@pixi/webworker"
import { ApplicationTextureResource } from "../webgl/ApplicationTextureResource"
export const useApplicationServerWorker = (
    nodeId: string,
    containerState: ContainerState,
    applicationTextureRef: MutableRefObject<Texture<ApplicationTextureResource>>,
    messagePort: MessagePort
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