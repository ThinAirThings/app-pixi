import { createContextExports, createContextProviderComposition, createContextRef, createContextState } from "@thinairthings/react-context"
import { ViewportState } from "../views/InfiniteCanvas/PixiCanvas"


const spaceContext = {
    spaceDetailsContext: createContextState<{
        initialized: boolean
        spaceDisplayName: string
        spaceId: string
    }>({
        initialized: false,
        spaceDisplayName: '',
        spaceId: ''
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