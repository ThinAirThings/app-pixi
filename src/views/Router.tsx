import { RouterProvider } from 'react-router'
import { Navigate, Outlet, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { UserContextProvider } from '../context/UserContext';
import { CheckAuthentication } from './Authentication/CheckAuthentication';
import { AuthenticationPage } from './Authentication/AuthenticationPage';
import { PixiProvider } from '../context/PixiContext';
import { InfiniteCanvas } from './InfiniteCanvas/InfiniteCanvas';
import { Loading } from './Loading/Loading';
import { LiveblocksRoomProvider } from '../context/LiveblocksContext';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={
            <UserContextProvider>
                <Outlet/>
            </UserContextProvider>
        }>
            <Route path="/auth" element={<AuthenticationPage/>}/>
            <Route path="*" element={
                <CheckAuthentication>
                    <Route path="*" element={<Navigate to="/dashboard"/>}/>
                    <Route path="/dashboard" element={<div>Dashboard</div>}/>
                    <Route path="/space/:spaceId" element={
                        <LiveblocksRoomProvider>
                            <PixiProvider>
                                <InfiniteCanvas/>
                            </PixiProvider>
                        </LiveblocksRoomProvider>
                    }/>
                </CheckAuthentication>
            }/>
        </Route>
    )
)

export const ThinAirRouter = () => {
    return <RouterProvider
        router={router}
        fallbackElement={<Loading/>}
    />
}