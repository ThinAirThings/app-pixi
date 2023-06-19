import classNames from "classnames";
import { Modal } from "../../components-dashboard/Modal/Modal";
import styles from './EditSpaceModal.module.scss';
import { useThinAirClient } from "../../clients/ThinAirClient/useThinAirClient";
import { useEffect, useRef, useState } from "react";
import { DeleteSpaceCommand } from "../../clients/ThinAirClient/commands/liveblocks/DeleteSpaceCommand";
import { UpdateSpaceCommand } from "../../clients/ThinAirClient/commands/liveblocks/UpdateSpaceCommand";
export const EditSpaceModal = ({
    showModal, 
    setShowModal, 
    spaceData, 
    getAndSetSpaces
}: {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    spaceData: {
        spaceId: string;
        spaceDisplayName: string;
        creationTime: string;
        lastAccessedTime: string;
    } | null | undefined
    getAndSetSpaces: () => Promise<void>
}) => {
    // Clients
    const thinAirClient = useThinAirClient();
    // Refs
    const modalRef = useRef<HTMLDivElement>(null);
    // State
    const [spaceName, setSpaceName] = useState(spaceData?.spaceDisplayName || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    // Effects
    useEffect(() => {
        setSpaceName(spaceData?.spaceDisplayName || '') 
    }, [spaceData])
    
    return (
        <Modal ref={modalRef} title="Edit Space" showModal={showModal} setShowModal={setShowModal}>
            <h5 className={classNames("tabSizeMargin")}>Rename Space</h5>
            <form className={classNames(styles.formWrapper)}
                onSubmit={async (event) => {
                    if (!spaceData) return;
                    event.preventDefault();
                    setIsUpdating(true)
                    await thinAirClient.send(new UpdateSpaceCommand({
                        spaceId: spaceData.spaceId,
                        spaceDisplayName: spaceName,
                    }))
                    await getAndSetSpaces()
                    setIsUpdating(false)
                    setShowModal(false)
                }}
            >
                <input 
                    type="text" 
                    placeholder="Space Name" 
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                />
                <button className={classNames(styles.saveButton, {
                    ['loading']: isUpdating,
                })}>   
                    <span/>
                    Save
                </button>    
            </form> 
            <button className={classNames(styles.deleteButton)}
                onClick={async () => {
                    setShowDeleteConfirmation(true)
                }}
            >
                <span/>
                Delete Space
            </button>
            <Modal title="Delete Space" showModal={showDeleteConfirmation} setShowModal={setShowDeleteConfirmation}>
                <h5>Are you sure you want to delete this space?</h5>
                <button className={classNames(styles.deleteButton, {
                        ['loading']: isDeleting,
                })}
                    onClick={async () => {
                        if (!spaceData) return;
                        setIsDeleting(true)
                        await thinAirClient.send(new DeleteSpaceCommand({
                            spaceId: spaceData.spaceId
                        }))
                        await getAndSetSpaces()
                        setShowDeleteConfirmation(false)
                        setIsDeleting(false)
                        setShowModal(false)
                    }}
                >
                    <span/>
                    Delete
                </button>
            </Modal>
        </Modal>
    )
}