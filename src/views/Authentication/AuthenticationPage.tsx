import classnames from 'classnames';
import styles from './AuthenticationPage.module.scss';

export const AuthenticationPage = () => {
    return (
        <div className={classnames(styles.authenticationPage)}>
            <img src="/logos/thinair-full-white.svg" className={classnames(styles.logo)}/>
            <div className={classnames(styles.buttonRow)}>
                <a className={classnames(styles.btn)}>Login</a>
                <a className={classnames(styles.btn)}>Sign Up</a>
            </div>
        </div>
    )
}