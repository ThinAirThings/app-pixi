import classNames from 'classnames';
import styles from './Loading.module.scss';

export const Loading = () => {
    return (
        <div className={classNames(styles.loadingContainer)}>
            <span className={classNames(styles.loadingSpinner)}></span>
            <img className={classNames(styles.logo)} src="/logos/thinair-white.svg" alt="logo" />
        </div>
    )
}