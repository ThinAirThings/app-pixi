import { createContextExports, createContextProviderComposition, createContextRef, createContextState } from "@thinairthings/react-context"
import { ViewportState } from "../views/InfiniteCanvas/InfiniteCanvas"


const spaceContext = {
    spaceDetailsContext: createContextState<{
        initialized: boolean
        displayName: string
        id: string
    }>({
        initialized: false,
        displayName: '',
        id: ''
    }),
    infiniteCanvasRefContext: createContextRef<HTMLDivElement>(),
    refPointRefContext: createContextRef<HTMLDivElement>(),
    viewportStateContext: createContextState<ViewportState>({
        x: 0,
        y: 0,
        scale: 1
    })
}
export const {
    useSpaceDetailsContext,
    useInfiniteCanvasRefContext,
    useRefPointRefContext,
    useViewportStateContext,
} = createContextExports(spaceContext)

export const SpaceContextProvider = createContextProviderComposition(spaceContext)