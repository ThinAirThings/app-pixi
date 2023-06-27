import { ApplicationWindow } from "../ApplicationWindow/ApplicationWindow"


export const Browser = ({nodeId}: {
    nodeId: string
}) => {
    return <ApplicationWindow nodeId={nodeId}/>
}