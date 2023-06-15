import classNames from "classnames";
import styles from './CreateSpaceModal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useThinAirClient } from "../../clients/ThinAirClient/useThinAirClient";
import { CreateSpaceCommand } from "../../clients/ThinAirClient/commands/CreateSpaceCommand";
import { useState } from "react";
import { Modal } from "../../components-dashboard/Modal/Modal";

export const CreateSpaceModal = ({
    showModal,
    setShowModal,
    getAndSetSpaces
}: {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    getAndSetSpaces: () => Promise<void>;
}) => {
    const thinAirClient = useThinAirClient();
    const [spaceName, setSpaceName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    return(
        <Modal title="Create Space" showModal={showModal} setShowModal={setShowModal}>
            <form className={classNames(styles.formWrapper)}
                onSubmit={async (event) => {
                    if (spaceName.length === 0) return;
                    event.preventDefault();
                    setIsLoading(true)
                    await thinAirClient.send(new CreateSpaceCommand({
                        spaceDisplayName: spaceName,
                    }));
                    await getAndSetSpaces()
                    setSpaceName('')
                    setIsLoading(false)
                    setShowModal(false);
                }}
            >
                <input
                    placeholder="Space Name"
                    value={spaceName} 
                    onChange={(e) => setSpaceName(e.target.value)}
                />
                <button 
                    className={
                        classNames({
                            ['disabled']: spaceName.length === 0,
                            ['loading']: isLoading,
                        })
                    } 
                >   
                    <span/>
                    Create
                </button>
            </form>
        </Modal>
    )
}