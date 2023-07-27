import { FilterNodeKeysByProperty, NodeDataTypeIndex } from "@thinairthings/liveblocks-model"
import { TextBox } from "./TextBox/TextBox"
import { ApplicationTarget } from "./ApplicationTarget/ApplicationTarget"


export const DomComponentNodeIndex: {
    [Key in FilterNodeKeysByProperty<{type: 'dom'}>]: {
        DomComponent: ({nodeId}: {nodeId: string}) => JSX.Element
    } & typeof NodeDataTypeIndex[Key]
} = {
    "chrome": {
        DomComponent: ({nodeId}) => <ApplicationTarget nodeId={nodeId} />,
        ...NodeDataTypeIndex.chrome
    },
    "vsCode": {
        DomComponent: ({nodeId}) => <ApplicationTarget nodeId={nodeId} />,
        ...NodeDataTypeIndex.vsCode
    },
    "textBox": {
        DomComponent: ({nodeId}) => <TextBox nodeId={nodeId} />,
        ...NodeDataTypeIndex.textBox
    }, 
}