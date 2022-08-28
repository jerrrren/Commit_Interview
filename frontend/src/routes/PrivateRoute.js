import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { Routes } from "../constants/routes";
import { ROLE } from "../constants/roles";
import { url } from "../constants/url";
import axios from "axios";
import UnVerifiedEmail from "../components/emailverification/unverifiedEmail";

const PrivateRoute = (props) => {
  const location = useLocation();

  const isAuth = useAuth((state) => state.isAuth);

  const hasRequiredRole = isAuth === ROLE.User;
  const id = useAuth((state) => state.uid);

  
  const [isVerified, setVerified] = useState(null);

  
  useEffect(() => {
    console.log(url.get_verification_status+"/"+id)
    axios
      .get(url.get_verification_status+"/"+id)
      .then((resp) => {
        console.log(resp)
        setVerified(resp.data.verified);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if(!isAuth || !hasRequiredRole){
    return <Navigate to={Routes.login} state={{ from: location }} />;
  }

  if (isVerified == null){
    return null
  }

  if (isAuth && hasRequiredRole && isVerified) {
    return props.children;
  }


  if (isAuth && hasRequiredRole && !isVerified) {
    return <UnVerifiedEmail></UnVerifiedEmail>;
  }

};

export default PrivateRoute;
