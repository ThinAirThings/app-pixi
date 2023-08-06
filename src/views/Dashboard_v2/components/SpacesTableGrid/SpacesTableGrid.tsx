import { FC, Fragment } from "react";
import styles from "./SpacesTableGrid.module.scss";
import classNames from "classnames";
import { useSpacesMetadataMap } from "./hooks/useSpacesMetadataMap";
import { Button } from "../../../../components-dashboard/Button/Button";

const headerTags = [
    "Space Name",
    "Creation Date",
    "Last Accessed",
    "Shared With",
    ""
]
export const SpacesTableGrid: FC<{

}> = ({}) => {
    // State
    const spaceMetadataMap = useSpacesMetadataMap()
    return (
        <div className={classNames(styles.spacesTableGrid)}>
            {/* Declare Header */}
            {headerTags.map((tag, index) => {
                return (
                    <span key={index}>{tag}</span>
                )
            })}
            {/* Declare Row */}
            {[...spaceMetadataMap].map(([spaceId, spaceMetadata], index) => 
                <Fragment key={spaceId}>
                    <div style={{gridRow: index+2}}/>
                    <span style={{
                        gridRow: `${index+2}`,
                        gridColumn: 1,
                    }}>{spaceMetadata.spaceDisplayName}</span>
                    <span style={{
                        gridRow: `${index+2}`,
                        gridColumn: 2
                    }}>{spaceMetadata.creationTime}</span>
                    <span style={{
                        gridRow: `${index+2}`,
                        gridColumn: 3
                    }}>{spaceMetadata.lastAccessedTime}</span>
                    <span style={{
                        gridRow: `${index+2}`,
                        gridColumn: 4
                    }}>-</span>
                    <Button label="Manage" style={{
                        gridRow: `${index+2}`,
                    }}/>
                </Fragment>
            )}
            
        </div>
    )
}