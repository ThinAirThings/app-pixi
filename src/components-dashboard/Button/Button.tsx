import classNames from "classnames";
import { ButtonHTMLAttributes, FC } from "react";
import styles from "./Button.module.scss";

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string
}> = ({label, ...props}) => {
    return (
        <button {...props}
            className={ classNames(props.className, styles.button)}
        >
            <span>{label}</span>
        </button>
    )   
}