import { FC, useState } from "react";
import { Modal } from "../../../../components-dashboard/Modal/Modal";
import styles from './CreateSpaceModal.module.scss';
import classNames from "classnames";
import { Button } from "../../../../components-dashboard/Button/Button";
import { useThinAirClient } from "../../../../clients/ThinAirClient/useThinAirClient";
import { CreateSpaceCommand } from "../../../../clients/ThinAirClient/commands/liveblocks/CreateSpaceCommand";



export const CreateSpaceModal: FC<Pick<Parameters<typeof Modal>[0], 
    "showModal" | "setShowModal"
>> = ({
    ...props
}) => {
    // Refs
    const thinAirClient = useThinAirClient();
    // State
    const [spaceName, setSpaceName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    return <Modal
        title="Create Space"
        {...props}
    >
        <form className={classNames(styles.createSpaceForm)}
            onSubmit={async (event) => {
                if (spaceName.length === 0) return;
                event.preventDefault();
                setIsLoading(true)
                await thinAirClient.send(new CreateSpaceCommand({
                    spaceDisplayName: spaceName,
                }));
                setSpaceName('')
                setIsLoading(false)
                props.setShowModal(false);
            }}
        >
            <input placeholder="Space Name"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
            />
            <Button
                label="Create"
                className={
                    classNames({
                        ['disabled']: spaceName.length === 0,
                        ['loading']: isLoading,
                    })
                }
            />
        </form>
    </Modal>
}