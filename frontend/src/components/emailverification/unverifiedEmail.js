import { Link, useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Button } from "@chakra-ui/react";
import { url } from "../../constants/url";
import { useEffect } from "react";

const UnVerifiedEmail = () => {
  const userLogout = useAuth((state) => state.logout);

  const logout = () => {
    userLogout();
  };

  const id = useAuth((state) => state.uid);

  const sendVerificationEmail = () => {
    axios
      .get(url.send_verification_email + id)
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    sendVerificationEmail();
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4 padding:0">
        <div className="container-fluid">
          <Link to={`/home`} className="navbar-brand">
            IntroNus
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
      <p>
        A verification link has been sent to your email to verify your account.
        If you did not receive the email click the button below to resend the
        verification code
      </p>
      <Button onClick={sendVerificationEmail}>Send Verification Email</Button>
    </div>
  );
};

export default UnVerifiedEmail;
