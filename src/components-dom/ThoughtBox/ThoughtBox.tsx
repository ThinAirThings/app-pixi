import { FC } from "react";
import { DomContainer } from "../DomContainer/DomContainer";



export const ThoughtBox: FC<{nodeId: string}> = ({ 
    nodeId 
}) => {
    return (
        <DomContainer nodeId={nodeId}>
            
        </DomContainer>
    )
}