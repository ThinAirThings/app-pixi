import { ReactNode, useEffect } from "react"
import { useUserDetailsContext } from "../../context/UserContext"
import { Navigate } from "react-router"
import { Loading } from "../Loading/Loading"
// const cognitoTokenVerifier = CognitoJwtVerifier.create({
//     userPoolId: `${import.meta.env.VITE_COGNITO__USERPOOL_ID}`,
//     clientId: `${import.meta.env.VITE_COGNITO__CLIENT_ID}`,
//     tokenUse: 'access',
// })

export const CheckAuthentication = ({children}: {children: ReactNode}) => {
    const [userDetails, setUserDetails] = useUserDetailsContext();
  
    useEffect(() => {
        (async () => {
            try {
                const refreshTokenResponse = await fetch("https://devauth.api.thinair.cloud/refresh", {
                    method: 'GET',
                    credentials: 'include',
                    mode: 'cors'
                });
                if (!refreshTokenResponse.ok) {
                    const {message} = await refreshTokenResponse.json();
                    console.log(message);
                    setUserDetails(draft => {
                        draft.initialized = true;
                    });
                } else {
                    const {accessToken, userId} = await refreshTokenResponse.json();
                    setUserDetails(async (draft) => {
                        draft.initialized = true;
                        draft.accessToken = accessToken;
                        draft.authenticated = true;
                        draft.userId = userId;
                    });
                }
            } catch (error) {

                setUserDetails(draft => {
                    draft.initialized = true;
                })
            }
        })();
    }, []);
    console.log(userDetails)
    if (!userDetails.initialized) {
        return <Loading/>;
    }
    if (!userDetails.authenticated) {
        return <Navigate to="/auth"/>;
    }
    return <>{children}</>;
}