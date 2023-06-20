import { createContextExports, createContextProviderComposition, createContextRef, createContextState } from "@thinairthings/react-context"
import { ViewportState } from "../views/InfiniteCanvas/PixiCanvas"

const spaceMetaContext = {
    spaceDetailsContext: createContextState<{
        initialized: boolean
        spaceDisplayName: string
        spaceId: string
    }>({
        initialized: false,
        spaceDisplayName: '',
        spaceId: ''
    }),
}
export const {
    useSpaceDetailsContext,
} = createContextExports(spaceMetaContext)

export const SpaceMetaContextProvider = createContextProviderComposition(spaceMetaContext)

const spaceMainContext = {
    infiniteCanvasRefContext: createContextRef<HTMLDivElement>(),
    refPointRefContext: createContextRef<HTMLDivElement>(),
    viewportStateContext: createContextState<ViewportState>({
        x: 0,
        y: 0,
        scale: 1
    }),
    languageInterfaceActiveContext: createContextState<boolean>(false),
}
export const SpaceMainContextProvider = createContextProviderComposition(spaceMainContext)
export const {
    useInfiniteCanvasRefContext,
    useRefPointRefContext,
    useViewportStateContext,
    useLanguageInterfaceActiveContext
} = createContextExports(spaceMainContext)