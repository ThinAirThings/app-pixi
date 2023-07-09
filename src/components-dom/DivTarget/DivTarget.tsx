import { CSSProperties, ReactNode, forwardRef } from "react"


export const DivTarget = forwardRef<HTMLDivElement, {
    nodeId: string, 
    children?: ReactNode
    className?: string
    style?: CSSProperties
}>(
    ({nodeId, children, className, style}, ref) => {
        return (
            <div
                className={className}
                style={style}
                ref={ref}
                data-nodeid={nodeId}
                data-isdomtarget={true}
                data-isselectiontarget={true}
            >
                {children}
            </div>
        )
    }
)