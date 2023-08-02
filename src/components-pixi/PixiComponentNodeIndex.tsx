import { FilterNodeKeysByProperty, NodeDataTypeIndex } from "@thinairthings/liveblocks-model"
import { Rectangle } from "./Rectangle/Rectangle"


export const PixiComponentNodeIndex: {
    [Key in FilterNodeKeysByProperty<{renderer: 'pixi'}>]: {
        PixiComponent: ({nodeId}: {nodeId: string}) => JSX.Element
    } & typeof NodeDataTypeIndex[Key]
} = {
    "rectangle": {
        PixiComponent: ({nodeId}) => <Rectangle nodeId={nodeId} />,
        ...NodeDataTypeIndex.rectangle
    }, 
}