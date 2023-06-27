import classNames from "classnames"
import styles from "./ColorBar.module.scss"

export const ColorBar = ({
    visible
}: {
    visible: boolean
}) => {
    return (
        <div className={classNames(styles.colorbar, {
            [styles.visible]: visible
        })}/>
    )
}