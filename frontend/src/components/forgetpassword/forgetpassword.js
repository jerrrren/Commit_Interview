import axios from "axios";
import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Nav from "../../components/navigation/navbar";
import useAuth from "../../hooks/useAuth";
import { url } from "../../constants/url";

import "./login.css";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [emailSent,setEmailSent] = useState(false)

  const submit = (e) => {
    e.preventDefault();

    console.log(username)

    axios
      .post(url.forgetPassword, {
        Username: username,
      })
      .then((resp) => {
        console.log(resp.data);
      })
      .then((resp)=> {
        setEmailSent(true);
      }
      )
      .catch((err) => {
        console.log(err.response.data);
        setErr(true);
        setErrMsg(err.response.data.message);
      });
  };


  if (emailSent) {
    return (
      <div className="login" style={{ height: "100vh" }}>
        <Nav />
        <h1 className="h3 mb-3 fw-normal">
          A link has been sent to your email to reset you password
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
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="floatingPassword">Username</label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default ForgetPassword;
