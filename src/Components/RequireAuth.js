import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../Hooks/useAuth.js";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        allowedRoles?.includes(auth?.role)
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/noAutorizado" state={{ from: location }} replace />
                : <Navigate to="/Inicio" state={{ from: location }} replace />
    );
}


export default RequireAuth;