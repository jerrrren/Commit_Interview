import axios from "axios";
import React from "react";
import { useState } from "react";
import Nav from "../../components/navigation/navbar";
import useAuth from "../../hooks/useAuth";
import { url } from "../../constants/url";
import { Box, Button, Flex,Text } from "@chakra-ui/react";
import {Link} from "react-router-dom"
import "./login.css";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState(0);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const userLogin = useAuth((state) => state.userLogin);

  const submit = async(e) => {
    e.preventDefault();
    await axios
      .post(url.login, {
        username: name,
        password: password,
      },{ withCredentials:true })
      .then((resp) => {
        console.log(resp);
        setId(resp.data.uid);
        console.log(id);
        userLogin(
          {
            refresh: resp.data.refresh_token,
            access: resp.data.token,
          },
          resp.data.uid
        );
      })
      .catch((err) => {
        console.log(err.response.data);
        setErr(true);
        setErrMsg(err.response.data.message);
      });

    sessionStorage.setItem("username", name);
  };

  return (
    <div className="login" style={{ height: "100vh" }}>
      <Nav>
        <Link to="/register">
          <Button>Signup</Button>
        </Link>
      </Nav>
      {err ? (
        <div className="alert alert-danger" role="alert">
          {errMsg}
        </div>
      ) : (
        <div></div>
      )}

      <Flex justifyContent="center" alignItems="center" minHeight="71vh">
        <Box
          paddingBottom="5vh"
          paddingTop="5vh"
          paddingLeft="5vw"
          paddingRight="5vw"
          borderRadius="25px"
          height="50vh"
          width="40vw"
          style={{
            backgroundColor: "rgba(223, 232, 229, 0.65)",
          }}
        >
          <form onSubmit={(e) => submit(e)}>
            <Text fontSize="3xl">Please sign in</Text>
            <Box className="form-floating" marginBottom="3vh">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                required
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="floatingInput">Username</label>
            </Box>

            <Box className="form-floating" marginTop="3vh" marginBottom="3vh">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </Box>
            <Flex marginTop="3vh">
              <Button type="submit" width="10vw">
                Submit
              </Button>
            </Flex>
            <Link to="/forgetpassword">Forgot Password?</Link>
          </form>
        </Box>
      </Flex>
    </div>
  );
};

export default Login;
