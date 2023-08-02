import { NodeDataTypeIndex } from "@thinairthings/liveblocks-model";


export const UserCreatedNodeIndex: {
    [Key in keyof typeof NodeDataTypeIndex]: {
        displayName: string,
        displayIcon: string,
    } & typeof NodeDataTypeIndex[Key]
} = {
    'chrome': {
        displayName: 'Chrome',
        displayIcon: '/icons/icon-rectangle.svg',
        ...NodeDataTypeIndex.chrome,
    },
    'vsCode': {
        displayName: 'VSCode',
        displayIcon: '/icons/icon-rectangle.svg',
        ...NodeDataTypeIndex.vsCode,
    },
    'rectangle': {
        displayName: 'Rectangle',
        displayIcon: '/icons/icon-rectangle.svg',
        ...NodeDataTypeIndex.rectangle,
    },
    'textBox': {
        displayName: 'Text Box',
        displayIcon: '/icons/icon-rectangle.svg',
        ...NodeDataTypeIndex.textBox,
    }
}