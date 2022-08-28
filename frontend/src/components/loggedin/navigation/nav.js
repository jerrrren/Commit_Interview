import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Flex, Text } from "@chakra-ui/react";

const LoggedinNavbar = () => {
  const userLogout = useAuth((state) => state.logout);

  const logout = () => {
    userLogout();
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark  padding:0 ">
      <div className="container-fluid">
        <Link
          to={`/home`}
          className="navbar-brand"
          onClick={() => window.location.reload()}
        >
          <Text>Example.com</Text>
        </Link>
        <div>
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={logout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default LoggedinNavbar;
