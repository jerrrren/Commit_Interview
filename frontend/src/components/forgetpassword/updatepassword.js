import axios from "axios";
import React from "react";
import { useState } from "react";
import {  useParams } from "react-router-dom";
import Nav from "../../components/navigation/navbar";
import { url } from "../../constants/url";

import "./login.css";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { token } = useParams();

  const [passwordReseted, setPasswordReseted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setErrMsg("Password not the same as Confirm Password");
      setErr(true);
      return;
    }
    axios
      .post(url.updatePassword, {
        password: password,
        token: token,
      })
      .then((resp) => {
        setPasswordReseted(true);
      })
      .catch((err) => {
        console.log(err.response.data);
        setErr(true);
        setErrMsg(err.response.data.message);
      });
  };

  if (passwordReseted) {
    return (
      <div className="login" style={{ height: "100vh" }}>
        <Nav />
        <h1 className="h3 mb-3 fw-normal">
          Your password has been reset, please login again
        </h1>
      </div>
    );
  }

  return (
    <div className="login" style={{ height: "100vh" }}>
      <Nav />
      {err ? (
        <div className="alert alert-danger" role="alert">
          {errMsg}
        </div>
      ) : (
        <div></div>
      )}
      <main className="form-signin w-100 m-auto">
        <form onSubmit={(e) => submit(e)}>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              required
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">ConfirmPassword</label>
          </div>

          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default UpdatePassword;
