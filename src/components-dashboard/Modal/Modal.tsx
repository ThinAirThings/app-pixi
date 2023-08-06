import classNames from "classnames"
import { ReactNode, forwardRef } from "react"
import styles from './Modal.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
export const Modal = forwardRef<
    HTMLDivElement, {
        title: string
        showModal: boolean
        setShowModal: (show: boolean) => void
        children: ReactNode
    }
>(({
    title,
    showModal,
    setShowModal,
    children
}, ref) => {
    return (
        <div ref={ref} className={classNames(styles.background,{
            [styles.show]: showModal
        })}>
            <div className={classNames(styles.modal, {
                [styles.show]: showModal,
            })} >
                <FontAwesomeIcon size="xl" icon={faXmark} className={classNames(styles.closeButton)} 
                    onClick={() => setShowModal(false)}
                />
                <span className={classNames(styles.title)}>{title}</span>
                <div className={classNames(styles.content)}>
                    {children}
                </div> 
            </div>
        </div>
    )
})