import { Stage } from "@pixi/react"
import { ReactNode } from "react"

const rootElement = document.getElementById('root')!
export const PixiProvider = ({ children }: { children: ReactNode }) => {
    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            options={{
                resizeTo: rootElement,
                background: '#1c1c1c',
            }}
        >
            {children}
        </Stage>
    )
}