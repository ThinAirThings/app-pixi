import classnames from 'classnames';
import styles from './Dashboard.module.scss';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CreateSpaceModal } from './CreateSpaceModal';
import { useThinAirClient } from '../../clients/ThinAirClient/useThinAirClient';
import { GetSpacesCommand } from '../../clients/ThinAirClient/commands/GetSpacesCommand';
import { useUserDetailsContext } from '../../context/UserContext';

const headerTags = [
    'Space Name',
    'Creation Time',
    'Last Accessed',
    'Shared With'
]
export const Dashboard = () => {
    // Refs
    const dashboardRef = useRef(null)
    // State
    const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false)
    const thinAirClient = useThinAirClient()
    const [userDetails] = useUserDetailsContext()
    const [spaces, setSpaces] = useState<Array<{
        spaceId: string;
        spaceDisplayName: string;
        creationTime: string;
        lastAccessedTime: string;
    }>>([])
    // Effects
    useEffect(() => {
        (async () => {
            const output = await thinAirClient.send(new GetSpacesCommand({
                userId: userDetails.userId!,
            }))
            setSpaces(output.rooms.map(room => ({
                spaceId: room.id,
                spaceDisplayName: room.metadata.spaceDisplayName,
                creationTime: room.createdAt,
                lastAccessedTime: room.lastConnectionAt,
            })))
        })()
    }, [])
    return (
        <div ref={dashboardRef} className={classnames(styles.dashboard)}>
            <div className={classnames(styles.box)}>
                <img src="/logos/thinair-full-white.svg" className={classnames(styles.logo)}/>
                <div className={classnames(styles.table)}>
                    {headerTags.map(tag => <span key={tag} className={classnames(styles.tableHeaderItem)}>{tag}</span>)}
                    {spaces.map(space => {return (
                        <Fragment key={space.spaceId}>
                            <span className={classnames(styles.tableItem)}>{space.spaceDisplayName}</span>
                            <span className={classnames(styles.tableItem)}>{space.creationTime}</span>
                            <span className={classnames(styles.tableItem)}>{space.lastAccessedTime}</span>
                            <span className={classnames(styles.tableItem)}>None</span>
                        </Fragment>
                    )})}
                </div>
                <button 
                    className={classnames(styles.btn)}
                    onClick={() => setShowCreateSpaceModal(true)}
                >Create Space
                </button> 
            </div>
            {showCreateSpaceModal && createPortal(<CreateSpaceModal
                setShowCreateSpaceModal={setShowCreateSpaceModal}
            />, dashboardRef.current!)}
        </div>
    )
}