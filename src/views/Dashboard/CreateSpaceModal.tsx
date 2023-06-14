import classnames from "classnames";
import styles from './CreateSpaceModal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useThinAirClient } from "../../clients/ThinAirClient/useThinAirClient";
import { CreateSpaceCommand } from "../../clients/ThinAirClient/commands/CreateSpaceCommand";

export const CreateSpaceModal = ({
    setShowCreateSpaceModal,
}: {
    setShowCreateSpaceModal: (show: boolean) => void;
}) => {
    const thinAirClient = useThinAirClient();
    return(
        <div className={classnames(styles.createSpaceModal)}>
            <div className={classnames(styles.modal)}>
                <FontAwesomeIcon size="xl" icon={faXmark} className={classnames(styles.closeButton)} 
                    onClick={() => setShowCreateSpaceModal(false)}
                />
                <span className={classnames(styles.inputHeader)}>Create Space</span>
                <input className={classnames(styles.input)} placeholder="Space Name"/>
                <button className={classnames(styles.btn)}
                    onClick={async () => {
                        await thinAirClient.send(new CreateSpaceCommand({
                            spaceDisplayName: 'test',
                        }));
                        setShowCreateSpaceModal(false);
                    }}
                >Create</button>
            </div>
        </div>
    )
}