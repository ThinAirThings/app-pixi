import { ApplicationTarget } from "./components-dom/ApplicationTarget/ApplicationTarget"
import { ApplicationWindow } from "./components-dom/ApplicationWindow/ApplicationWindow"
import { DomBox } from "./components-dom/DomBox/DomBox"
import { TextBox } from "./components-dom/TextBox/TextBox"
import { Rectangle } from "./components-pixi/Rectangle/Rectangle"
import {NodeTypeIndex} from "@thinairthings/liveblocks-model"

export const NodeComponentIndex: {
    [Key in keyof NodeTypeIndex]: {
        type: Key
        renderer: 'dom' | 'pixi'
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
        renderer: 'dom',
        typeDisplayName: "Browser",
        typeDisplayIcon: "/icons/icon-earth.svg",
        defaultProps: {
            url: "https://www.google.com",
            cursor: "pointer",
            readyToConnect: false
        },
        defaultBoxSize: {
            width: 836,
            height: 536
        },
        Component: ({nodeId}) => <ApplicationTarget nodeId={nodeId} />
    },
    rectangle: {
        type: 'rectangle',
        renderer: 'pixi',
        typeDisplayName: "Rectangle",
        typeDisplayIcon: "/icons/icon-rectangle.svg",
        defaultProps: {},
        defaultBoxSize: {
            width: 100,
            height: 100
        },
        Component: ({nodeId}) => <Rectangle nodeId={nodeId} />
    },
    vsCode: {
        type: 'vsCode',
        renderer: 'dom',
        typeDisplayName: "VS Code",
        typeDisplayIcon: "/icons/icon-rectangle.svg",
        defaultProps: {
            cursor: "pointer",
            readyToConnect: false
        },
        defaultBoxSize: {
            width: 836,
            height: 536
        },
        Component: ({nodeId}) => <ApplicationTarget nodeId={nodeId} />
    },
    textBox: {
        type: 'textBox',
        renderer: 'dom',
        typeDisplayName: "Text Box",
        typeDisplayIcon: "/icons/icon-rectangle.svg",
        defaultProps: {
            content: "Hello World"
        },
        defaultBoxSize: {
            width: 200,
            height: 50
        },
        Component: ({nodeId}) => <TextBox nodeId={nodeId}/>
    },
    domBox: {
        type: 'domBox',
        renderer: 'dom',
        typeDisplayName: "Dom Box",
        typeDisplayIcon: "/icons/icon-rectangle.svg",
        defaultProps: {},
        defaultBoxSize: {
            width: 200,
            height: 50
        },
        Component: ({nodeId}) => <DomBox nodeId={nodeId}/>
    }

}