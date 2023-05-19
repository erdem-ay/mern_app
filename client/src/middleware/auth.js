import { Navigate,redirect } from "react-router-dom";
import { useAuthStore } from "../store/store";

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem('token');

    if(!token){
         return <Navigate to={'/'} replace={true}></Navigate>
    }

    console.log("c",children)
    return children;
}


export const ProtectRoute = ({ children }) => {
    const email = useAuthStore.getState().auth.email;
    if(!email){
        return <Navigate to={'/'} replace={true}></Navigate>
    }
    return children;
}