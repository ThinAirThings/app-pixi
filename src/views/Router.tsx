import { RouterProvider } from 'react-router'
import { Navigate, Outlet, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { UserContextProvider } from '../context/UserContext';
import { HandleAuthentication } from './Authentication/HandleAuthentication';
import { AuthenticationPage } from './Authentication/AuthenticationPage';
import { Loading } from './Loading/Loading';
import { HandleGrantToken } from './Authentication/HandleGrantToken';
import { Routes } from 'react-router-dom';  
import { Dashboard } from './Dashboard/Dashboard';
import { SpaceMain } from './SpaceMain/SpaceMain';
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={
            <UserContextProvider>
                <Outlet/>
            </UserContextProvider>
        }>
            <Route path="/auth" element={<AuthenticationPage/>}/>
            <Route path="/auth/token" element={<HandleGrantToken/>}/>
            <Route path="*" element={
                <HandleAuthentication>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/space/:spaceId" element={
                            <SpaceMain/>
                        }/>
                        <Route path="*" element={<Navigate to="/dashboard"/>}/>
                    </Routes>
                </HandleAuthentication>
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