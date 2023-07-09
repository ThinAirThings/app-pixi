import classNames from "classnames"
import { DomContainer } from "../DomContainer/DomContainer"
import styles from "./DomBox.module.scss"

export const DomBox = ({nodeId}: {
    nodeId: string
}) => {
    return (
        <DomContainer nodeId={nodeId}>
            <div 
                data-nodeid={nodeId}
                data-isdomtarget={true}
                data-isselectiontarget={true}
                className={classNames(styles.domBox)}
            />
        </DomContainer>
    )
}