// import { useContext } from 'react';
// import { UserContext } from './UserContext'; 
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = ({ allowedRoles, redirectPath = '/' }) => {
//   const { user } = useContext(UserContext);

//   if (!user || !allowedRoles.includes(user.id_cargo)) {
//     return <Navigate to={redirectPath} replace />;
//   }

//   return <Outlet />;
// };
// export default ProtectedRoute;