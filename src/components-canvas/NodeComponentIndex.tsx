import { Browser } from "./Browser/Browser"
import { Rectangle } from "./Rectangle/Rectangle"
export type NodeTypeIndex = {
    browser: {
        type: 'browser'
        typeDisplayName: string
        typeDisplayIcon: string
        defaultProps: {}
        Component: typeof Browser
    }
    rectangle: {
        type: 'rectangle'
        typeDisplayName: string
        typeDisplayIcon: string
        defaultProps: {}
        Component: typeof Rectangle
    }
}


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
        Component: NodeTypeIndex[Key]['Component']
    }
}= {
    browser: {
        type: 'browser',
        typeDisplayName: "Browser",
        typeDisplayIcon: "/icons/icon-earth.svg",
        defaultProps: {},
        defaultBoxSize: {
            width: 836,
            height: 536
        },
        Component: ({nodeRef}) => <Browser nodeRef={nodeRef} />
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
        Component: ({nodeRef}) => <Rectangle nodeRef={nodeRef} />
    }
}