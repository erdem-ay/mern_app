import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Email from "./components/Email"
import Register from "./components/Register"
import Password from "./components/Password"
import Profile from "./components/Profile"
import Recovery from "./components/Recovery"
import Reset from "./components/Reset"
import PageNotFound from "./components/PageNotFound"

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'


/**Root Routes */
const router = createBrowserRouter([
    {
        path: '/',
        element: <Email></Email>
    },
    {
        path: '/register',
        element: <Register></Register>
    },
    {
        path: '/password',
        element: <ProtectRoute><Password /></ProtectRoute>
    },
    {
        path: '/profile',
        element: <AuthorizeUser><Profile /></AuthorizeUser>
    },
    {
        path: '/recovery',
        element: <Recovery></Recovery>
    },
    {
        path: '/reset',
        element: <Reset></Reset>
    },
    {
        path: '*',
        element: <PageNotFound></PageNotFound>
    }
])

export default function App() {
    return (
        <main>
            <RouterProvider router={router}></RouterProvider>
        </main>
    )
}
