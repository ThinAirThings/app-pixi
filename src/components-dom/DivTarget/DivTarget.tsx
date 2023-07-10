import { CSSProperties, ReactNode, forwardRef } from "react"


export const DivTarget = forwardRef<HTMLDivElement, {
    nodeId: string,
    isApplicationTarget?: boolean,
    children?: ReactNode
    className?: string
    style?: CSSProperties
}>(
    ({nodeId, children, className, isApplicationTarget, style}, ref) => {
        return (
            <div
                className={className}
                style={style}
                ref={ref}
                data-nodeid={nodeId}
                data-isdomtarget={true}
                data-isselectiontarget={true}
                data-isapplicationtarget={!!isApplicationTarget}
            >
                {children}
            </div>
        )
    }
)