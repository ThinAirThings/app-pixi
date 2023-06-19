import { ReactNode, useEffect } from "react"
import { useUserDetailsContext } from "../../context/UserContext"
import { Navigate } from "react-router"
import { Loading } from "../Loading/Loading"

export const HandleAuthentication = ({children}: {children: ReactNode}) => {
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
                    setUserDetails(draft => {
                        draft.initialized = true;
                    });
                } else {
                    const {accessToken, userId} = await refreshTokenResponse.json();
                    setUserDetails((draft) => {
                        draft.initialized = true;
                        draft.accessToken = accessToken;
                        draft.authenticated = true;
                        draft.userId = userId;
                    });
                }
            } catch (error) {
                console.log(error);
                setUserDetails(draft => {
                    draft.initialized = true;
                })
            }
        })();
    }, []);
    if (!userDetails.initialized) {
        return <Loading/>;
    }
    if (!userDetails.authenticated) {
        return <Navigate to="/auth"/>;
    }
    return <>{children}</>;
}