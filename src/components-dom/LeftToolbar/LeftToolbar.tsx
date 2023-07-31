
import classNames from 'classnames';
import styles from './LeftToolbar.module.scss';
export const LeftToolbar = (

) => {
    return (
        <>
            <div className={classNames(styles.backgroundGradient)}/>     
            <div className={classNames(styles.leftToolbar)}>
                <div><img src="/logos/thinair-white.svg"/></div>
                <div>
                    <img src="/logos/logo_chrome.svg"/>
                    <span>Chrome</span>
                </div>
            </div>
            
        </>

    )
}