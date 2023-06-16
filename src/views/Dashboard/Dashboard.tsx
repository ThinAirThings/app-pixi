import classNames from 'classnames';
import styles from './Dashboard.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CreateSpaceModal } from './CreateSpaceModal';
import { useThinAirClient } from '../../clients/ThinAirClient/useThinAirClient';
import { GetSpacesCommand } from '../../clients/ThinAirClient/commands/GetSpacesCommand';
import { EditSpaceModal } from './EditSpaceModal';
import { useImmer } from 'use-immer';
import { useNavigate } from 'react-router-dom';
import { useSpaceDetailsContext } from '../../context/SpaceContext';
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
    const [spaces, setSpaces] = useImmer<Map<string, {
        spaceId: string;
        spaceDisplayName: string;
        creationTime: string;
        lastAccessedTime: string;
    }>>(new Map())
    const [showEditSpaceModal, setShowEditSpaceModal] = useState(false)
    const [selectedSpaceData, setSelectedSpaceData] = useState<ReturnType<typeof spaces.get>|null>(null)
    const [_, setSpaceDetails] = useSpaceDetailsContext()
    // Callbacks
    const getAndSetSpaces = useCallback(async () => {
        const output = await thinAirClient.send(new GetSpacesCommand())
        setSpaces(draft => {
            draft.clear()
            output.rooms.forEach(space => { 
                draft.set(space.id, {
                    spaceId: space.id,
                    spaceDisplayName: space.metadata.spaceDisplayName,
                    creationTime: convertDate(space.createdAt),
                    lastAccessedTime: convertDate(space.lastConnectionAt),
                })
            })
        })
    }, [])
    const navigate = useNavigate()
    // Effects
    useEffect(() => {
        (async () => {
            await getAndSetSpaces()
        })()
    }, [])
    return (
        <div ref={dashboardRef} className={classNames(styles.dashboard)}>
            <div className={classNames(styles.box)}>
                <div className={classNames(styles.topCover)}>
                    <img src="/logos/thinair-full-white.svg" className={classNames(styles.logo)}/>
                </div>
                
                <div className={classNames(styles.table)}>
                    <div className={classNames(styles.headerRow)}>
                        {headerTags.map(tag => <span key={tag} className={classNames(styles.item)}>{tag}</span>)}
                    </div>
                        {[...spaces.values()].map(space => {return (
                            <div key={space.spaceId} className={classNames(styles.dataRow)}
                                onClick={() => {
                                    // Enter Space
                                    setSpaceDetails(draft => {
                                        draft.spaceId = space.spaceId
                                        draft.spaceDisplayName = space.spaceDisplayName
                                    })
                                    navigate(`/space/${space.spaceId}`)
                                }}
                            >
                                <span className={classNames(styles.item)}>{space.spaceDisplayName}</span>
                                <span className={classNames(styles.item)}>{space.creationTime}</span>
                                <span className={classNames(styles.item)}>{space.lastAccessedTime}</span>
                                <span className={classNames(styles.item)}>None</span>
                                <button className={classNames(styles.editButton)}
                                    onClick={() => {
                                        setSelectedSpaceData(space)
                                        setShowEditSpaceModal(true)
                                    }}
                                >Edit</button>
                            </div>
                        )})}
                </div>
                <button 
                    className={classNames(styles.createSpaceBtn)}
                    onClick={() => setShowCreateSpaceModal(true)}
                >
                    Create Space
                </button> 
            </div>
            {dashboardRef.current && createPortal(
                <CreateSpaceModal
                    showModal={showCreateSpaceModal}
                    setShowModal={setShowCreateSpaceModal}
                    getAndSetSpaces={getAndSetSpaces}
                />, 
                dashboardRef.current
            )}
            {dashboardRef.current && createPortal(
                <EditSpaceModal 
                    showModal={showEditSpaceModal}
                    setShowModal={setShowEditSpaceModal}
                    spaceData={selectedSpaceData}
                    getAndSetSpaces={getAndSetSpaces}
                />,
                dashboardRef.current
            )}

        </div>
    )
}

const convertDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}