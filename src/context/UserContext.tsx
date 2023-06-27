import { createContextExports, createContextProviderComposition, createContextState } from "@thinairthings/react-context";


export const UserContext = {
    userDetailsContext: createContextState<{
        initialized: boolean
        accessToken: string | null
        userId: string | null
        authenticated: boolean
    }>({
        initialized: false,
        accessToken: null,
        userId: null,
        authenticated: false
    })
}

export const {
    useUserDetailsContext
} = createContextExports(UserContext)
export const UserContextProvider = createContextProviderComposition(UserContext)
