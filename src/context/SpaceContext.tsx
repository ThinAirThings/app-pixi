import { createContextExports, createContextProviderComposition, createContextRef, createContextState } from "@thinairthings/react-context"
import { ViewportState } from "@thinairthings/zoom-utils"
export const SpaceMetaContext = {
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
} = createContextExports(SpaceMetaContext)

export const SpaceMetaContextProvider = createContextProviderComposition(SpaceMetaContext)

export const SpaceMainContext = {
    infiniteCanvasRefContext: createContextRef<HTMLDivElement>(),
    refPointRefContext: createContextRef<HTMLDivElement>(),
    viewportStateContext: createContextState<ViewportState>({
        x: 0,
        y: 0,
        scale: 1
    }),
    languageInterfaceActiveContext: createContextState<boolean>(false)
}
export const SpaceMainContextProvider = createContextProviderComposition(SpaceMainContext)
export const {
    useInfiniteCanvasRefContext,
    useRefPointRefContext,
    useViewportStateContext,
    useLanguageInterfaceActiveContext,
} = createContextExports(SpaceMainContext)