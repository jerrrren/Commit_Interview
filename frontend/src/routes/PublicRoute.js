import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { Routes } from "../constants/routes";
import { ROLE } from "../constants/roles";

const PublicRoute = ( props ) => {
  const location = useLocation();

  const isAuth = useAuth((state) => state.isAuth);
  const hasRequiredRole = isAuth === ROLE.User;

  if (isAuth && hasRequiredRole) {
    return <Navigate to={Routes.home} state={{ from: location }} />;
  }
  
  return props.children ;
};

export default PublicRoute;
