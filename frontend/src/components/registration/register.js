import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./register.css";
import Nav from "../navigation/navbar";
import { url } from "../../constants/url";
import validator from "validator";
import DatePicker from "react-date-picker";
import { Flex, Box } from "@chakra-ui/react";

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [email, setEmail] = useState("");
  const [profilepic, setProfilePic] = useState(null);
  const [dob, setdob] = useState(new Date());

  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!validator.isEmail(email)) {
      setErr(true);
      setErrMsg("Please verify that the email is in a correct format");
      return;
    }

    let formData = new FormData();

    formData.append("profilePic", profilepic);
    formData.append("username", name);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("dob", dob.toString());

    await axios
      .post(url.signup, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp);
        setRedirect(true);
      })
      .catch((err) => {
        console.log(err);
        setErr(true);
        setErrMsg(err.response.data.message);
      });
  };

  if (redirect) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="register" style={{ height: "100vh" }}>
      <Nav />
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
          minHeight="50vh"
          minWidth="40vw"
          style={{
            backgroundColor: "rgba(223, 232, 229, 0.65)",
          }}
        >
          <main className="form-signin w-100 m-auto">
            <form onSubmit={(e) => submit(e)}>
              <h1 className="h3 mb-3 fw-normal">Welcome aboard!</h1>

              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="floatingInput">Email</label>
              </div>

              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  minLength={5}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="floatingInput">Username</label>
              </div>

              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  minLength={7}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              <div>
                <DatePicker onChange={(e) => setdob(e)} value={dob} />
              </div>

              <div className="form-floating">
                Upload a profile picture
                <input
                  type="file"
                  name="profile pic"
                  required
                  accept="image/png, image/jpeg"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
              </div>

              <button className="w-100 btn btn-lg btn-primary" type="submit">
                Register
              </button>
            </form>
          </main>
        </Box>
      </Flex>
    </div>
  );
};

export default Register;
