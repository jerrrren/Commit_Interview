import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import Login from './components/login/login'
import Logout from './components/login/logout'
import Register from './components/registration/register'



import LoggedInHome from './components/loggedin/home/home';



import PublicRoute from './routes/PublicRoute'
import PrivateRoute from "./routes/PrivateRoute";
import VerifyEmail from './components/emailverification/checkEmail';
import UpdatePassword from './components/forgetpassword/updatepassword';
import ForgetPassword from "./components/forgetpassword/forgetpassword";


function App() {

  const theme = extendTheme({
    components: {
      Button: {
        variants: {
          toggled: {
            background: "#ffb44c",
          },
        },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/register"
            element={<PublicRoute children={<Register />} />}
          />
          <Route
            path="/home"
            element={<PrivateRoute children={<LoggedInHome />} />}
          />
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route path="/logout" element={<Logout />} />

          <Route path="/verifyemail/:token" element={<VerifyEmail />} />

          <Route path="/updatepassword/:token" element={<UpdatePassword />} />

          <Route path="/forgetpassword" element={<ForgetPassword />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
