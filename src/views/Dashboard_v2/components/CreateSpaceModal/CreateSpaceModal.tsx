import { FC } from "react";
import { Modal } from "../../../../components-dashboard/Modal/Modal";



export const CreateSpaceModal: FC<Pick<Parameters<typeof Modal>[0], 
    "showModal" | "setShowModal"
>> = ({
    ...props
}) => {
    return <Modal
        title="Create Space"
        {...props}
    >
        <></>
    </Modal>
}