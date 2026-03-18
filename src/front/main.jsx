import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
import { StoreProvider } from './hooks/useGlobalReducer'
import { BackendURL } from './components/BackendURL'
import { GoogleOAuthProvider } from "@react-oauth/google";

const Main = () => {

    if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "")
        return (
            <React.StrictMode>
                <BackendURL />
            </React.StrictMode>
        );

    return (
        <React.StrictMode>

            <GoogleOAuthProvider clientId="3815072650-c4055m3c1jvbe74af5jqve8clov2ib9t.apps.googleusercontent.com">

                <StoreProvider>

                    <RouterProvider router={router}></RouterProvider>

                </StoreProvider>

            </GoogleOAuthProvider>

        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
