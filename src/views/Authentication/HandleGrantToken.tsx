import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom";
import { Loading } from "../Loading/Loading";


export const HandleGrantToken = () => {
    const [isFetchingComplete, setFetchingComplete] = useState(false);
    useEffect(() => {
        (async () => {
            console.log("Running")
            const response = await fetch(`https://${import.meta.env.VITE_COGNITO__AUTH_DOMAIN}/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'grant_type': 'authorization_code',
                    'client_id': `${import.meta.env.VITE_COGNITO__CLIENT_ID}`,
                    'code': new URLSearchParams(window.location.search).get('code')!,
                    'redirect_uri': `${import.meta.env.VITE_COGNITO__GRANT_TOKEN_REDIRECT_URL}`
                })
            })
            const {refresh_token} = await response.json();
            // Bounce off server for cookie refresh
            await fetch("https://devauth.api.thinair.cloud/create-refresh-cookie", {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    refreshToken: refresh_token
                }),
                mode: 'cors'
            })
            setFetchingComplete(true);
        })();
    }, [])
    return isFetchingComplete ? <Navigate to="/dashboard"/> : <Loading/>;
}