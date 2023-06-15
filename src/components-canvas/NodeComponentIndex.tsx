import { Box } from "./Box/Box"

export type NodeTypeIndex = {
    box: {
        type: 'box'
        typeDisplayName: string
        defaultProps: {}
        Component: typeof Box
    }
}


export const NodeComponentIndex: {
    [Key in keyof NodeTypeIndex]: {
        type: Key
        typeDisplayName: string
        defaultProps: NodeTypeIndex[Key]['defaultProps']
        defaultBoxSize: {
            width: number
            height: number
        }
        Component: NodeTypeIndex[Key]['Component']
    }
}= {
    box: {
        type: 'box',
        typeDisplayName: "Box",
        defaultProps: {},
        defaultBoxSize: {
            width: 836,
            height: 536
        },
        Component: ({nodeRef}) => <Box nodeRef={nodeRef} />
    }
}