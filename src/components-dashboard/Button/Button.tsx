import classNames from "classnames";
import { ButtonHTMLAttributes, FC } from "react";
import styles from "./Button.module.scss";

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string
}> = ({label, ...props}) => {
    return (
        <button className={classNames(styles.button)}
            {...props}
        >
            <span>{label}</span>
        </button>
    )   
}