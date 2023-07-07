import classNames from "classnames"
import styles from "./TopLeftTag.module.scss"
import { useSpaceDetailsContext } from "../../context/SpaceContext"
import { useNavigate } from "react-router-dom"

export const TopLeftTag = () => {
    const [spaceDetailsContext] = useSpaceDetailsContext()
    const navigate = useNavigate()
    return (
        <div 
            className={classNames(styles.topLeftTag)}
            onClick={() => {
                navigate("/dashboard")
            }}
        >
            <div><img src="/logos/thinair-white.svg" alt="logo"/></div>
            <span>{spaceDetailsContext.spaceDisplayName}</span>
        </div>
    )
}