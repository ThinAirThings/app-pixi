import { createContextExports, createContextProviderComposition, createContextState } from "@thinairthings/react-context";


const userContext = {
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
} = createContextExports(userContext)
export const UserContextProvider = createContextProviderComposition(userContext)
