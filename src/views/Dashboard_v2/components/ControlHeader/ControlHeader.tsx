import { FC } from "react";
import styles from "./ControlHeader.module.scss";
import classNames from "classnames";
import { Button } from "../../../../components-dashboard/Button/Button";

export const ControlHeader: FC<{
    setShowCreateSpaceModal: (showModal: boolean) => void
}> = ({setShowCreateSpaceModal}) => {
    return (
        <div className={classNames(styles.controlHeader)}>
            <span>Your Spaces</span>
            <Button label="+ Create Space"
                onClick={() => setShowCreateSpaceModal(true)}
            />
        </div>
    )
}