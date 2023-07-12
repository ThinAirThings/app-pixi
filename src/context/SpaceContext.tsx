import { createContextExports, createContextProviderComposition, createContextState } from "@thinairthings/react-context"
import { ViewportState } from "@thinairthings/zoom-utils"
import { GhostContainer } from "../components-dom/GhostContainer/GhostContainer"
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
    viewportStateContext: createContextState<ViewportState>({
        x: 0,
        y: 0,
        scale: 1
    }),
    ghostContainersContext: createContextState<Parameters<typeof GhostContainer>[0][]>([]),
    languageInterfaceActiveContext: createContextState<boolean>(false)
}
export const SpaceMainContextProvider = createContextProviderComposition(SpaceMainContext)
export const {
    useViewportStateContext,
    useGhostContainersContext,
    useLanguageInterfaceActiveContext,
} = createContextExports(SpaceMainContext)