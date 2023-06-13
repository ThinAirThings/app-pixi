import classnames from 'classnames';
import styles from './Dashboard.module.scss';

const headerTags = [
    'Space Name',
    'Creation Time',
    'Last Accessed',
    'Shared With'
]
export const Dashboard = () => {
    
    return (
        <div className={classnames(styles.dashboard)}>
            <div className={classnames(styles.box)}>
                <img src="/logos/thinair-full-white.svg" className={classnames(styles.logo)}/>
                <div className={classnames(styles.table)}>
                    {headerTags.map(tag => <span key={tag} className={classnames(styles.tableHeaderItem)}>{tag}</span>)}


                </div>
            </div>
        </div>
    )
}