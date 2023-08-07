import classNames from "classnames";
import { FC, useRef, useState } from "react";
import styles from "./Dashboard.module.scss";
import { ControlHeader } from "./components/ControlHeader/ControlHeader";
import { SpacesTableGrid } from "./components/SpacesTableGrid/SpacesTableGrid";
import { CreateSpaceModal } from "./components/CreateSpaceModal/CreateSpaceModal";

export const Dashboard: FC<{}> = () => {
    // State
    const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false)
    const [showManageSpaceModal, setShowManageSpaceModal] = useState(false)
    return (
        <div className={classNames(styles.dashboard)}>
            <div>
                <img src="/logos/thinair-black.svg"/>
                <span>Space Management</span>
            </div>
            <div>
                <ControlHeader setShowCreateSpaceModal={setShowCreateSpaceModal}/>
                <SpacesTableGrid showCreateSpaceModal={showCreateSpaceModal}/>
            </div>
            <CreateSpaceModal
                showModal={showCreateSpaceModal}
                setShowModal={setShowCreateSpaceModal}
            />
        </div>
    )
}