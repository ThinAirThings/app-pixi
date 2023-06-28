import { ApplicationWindow } from "./components-pixi/ApplicationWindow/ApplicationWindow"
import { Rectangle } from "./components-pixi/Rectangle/Rectangle"
import {NodeTypeIndex} from "@thinairthings/liveblocks-model"

export const NodeComponentIndex: {
    [Key in keyof NodeTypeIndex]: {
        type: Key
        typeDisplayName: string
        typeDisplayIcon: string
        defaultProps: NodeTypeIndex[Key]['defaultProps']
        defaultBoxSize: {
            width: number
            height: number
        }
        Component: ({nodeId}: {nodeId: string}) => JSX.Element
    }
}= {
    browser: {
        type: 'browser',
        typeDisplayName: "Browser",
        typeDisplayIcon: "/icons/icon-earth.svg",
        defaultProps: {
            url: "https://www.youtube.com/watch?v=gxxqdrrpgZc&t=326s"
        },
        defaultBoxSize: {
            width: 836,
            height: 536
        },
        Component: ({nodeId}) => <ApplicationWindow nodeId={nodeId} />
    },
    rectangle: {
        type: 'rectangle',
        typeDisplayName: "Rectangle",
        typeDisplayIcon: "/icons/icon-rectangle.svg",
        defaultProps: {},
        defaultBoxSize: {
            width: 100,
            height: 100
        },
        Component: ({nodeId}) => <Rectangle nodeId={nodeId} />
    }
}