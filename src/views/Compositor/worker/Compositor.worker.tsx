import { WorkerClient } from "@thinairthings/worker-client";
import { ContainerState, ViewportState } from "@thinairthings/zoom-utils";
import { Application } from "@pixi/webworker";
import { AppProvider, ReactPixiRoot, createRoot} from '@pixi/react';
import { enableMapSet } from 'immer'
import { CompositorTreeRoot } from "./CompositorTreeRoot.worker";
import { sendNodeSignal } from "../../../hooks/useNodeSignal";
enableMapSet()
let app: Application
let root: ReactPixiRoot
export const mainThreadClient = new WorkerClient(self as unknown as Worker, {
    'initialize': async ({compositorCanvas}: {
        compositorCanvas: OffscreenCanvas
    }) => {
        app = new Application({
            view: compositorCanvas,
            backgroundAlpha: 0,
        });
        root = createRoot(app.stage);
        root.render(
            <AppProvider value={app}>
                <CompositorTreeRoot/>
            </AppProvider>
        )
    },
    'rxScreenSize': async ({width, height}: {
        width: number,
        height: number
    }) => {
        app.renderer.resize(width, height)
    },
    'rxViewportState': async ({viewportState}: {
        viewportState: ViewportState
    }) => {
        sendNodeSignal("worker", 'root', 'txViewportState', {
            viewportState
        })
    },
    'rxCreateNode': async ({nodeId, containerState, messagePort}: {
        nodeId: string, 
        containerState: ContainerState,
        messagePort: MessagePort
    }) => {
        sendNodeSignal("worker", 'root', 'txCreateNode', {
            nodeId,
            containerState,
            messagePort
        })
    },
    'rxDeleteNode': async ({nodeId}: {
        nodeId: string
    }) => {
        sendNodeSignal("worker", 'root', 'txDeleteNode', {
            nodeId
        })
    },
    'rxContainerState': async ({nodeId, containerState}: {
        nodeId: string,
        containerState: ContainerState
    }) => {
        sendNodeSignal("worker", nodeId, 'txContainerState', {
            nodeId,
            containerState
        })
    }
})