import { WorkerClient } from "@thinairthings/worker-client";
import { ContainerState, ViewportState } from "@thinairthings/zoom-utils";
import { Application } from "@pixi/webworker";
import {TextureSystem} from "@pixi/core"
import { AppProvider, ReactPixiRoot, createRoot} from '@pixi/react';
import { enableMapSet } from 'immer'
import { sendWorkerNodeSignal } from "./hooks/useWorkerNodeSignal.worker";
import { CompositorTreeRoot } from "./CompositorTreeRoot.worker";
enableMapSet()
let app: Application
let root: ReactPixiRoot
const mainThreadClient = new WorkerClient(self as unknown as Worker, {
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
        sendWorkerNodeSignal('root', 'txViewportState', {
            viewportState
        })
    },
    'rxCreateNode': async ({nodeId, containerState}: {
        nodeId: string, 
        containerState: ContainerState
    }) => {
        sendWorkerNodeSignal('root', 'txCreateNode', {
            nodeId,
            containerState
        })
    },
    'rxDeleteNode': async ({nodeId}: {
        nodeId: string
    }) => {
        sendWorkerNodeSignal('root', 'txDeleteNode', {
            nodeId
        })
    },
    'rxContainerState': async ({nodeId, containerState}: {
        nodeId: string,
        containerState: ContainerState
    }) => {
        sendWorkerNodeSignal(nodeId, 'txContainerState', {
            nodeId,
            containerState
        })
    },
    'rxMouseInput': ({
        nodeId,
        type,
        x, y,
        button,
        clickCount
    }: {
        nodeId: string,
        type: 'mouseDown'|'mouseUp'|'mouseMove'
        x: number, y: number
        button: 'left'|'right'
        clickCount: number
    }) => {
        sendWorkerNodeSignal(nodeId, 'txMouseInput', {
            type,
            x: Math.round(x), y: Math.round(y),
            button,
            clickCount
        })
    },
    'rxMouseWheel': ({
        nodeId,
        x, y,
        wheelX, wheelY
    }: {
        nodeId: string,
        x: number, y: number
        wheelX: number, wheelY: number
    }) => {
        sendWorkerNodeSignal(nodeId, 'txMouseWheel', {
            x, y,
            wheelX, wheelY
        })
    },
    'rxKeyboardInput': ({
        nodeId,
        type, keyCode
    }: {
        nodeId: string,
        type: 'keyDown'|'keyUp', 
        keyCode: string
    }) => {
        sendWorkerNodeSignal(nodeId, 'txKeyboardInput', {
            type, keyCode
        })
    }
})