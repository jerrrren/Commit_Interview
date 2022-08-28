import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../navigation/navbar";
import { url } from "../../constants/url";

const VerifyEmail = () => {
  const [message, setmessage] = useState("");
  const { token } = useParams();
  useEffect(() => {
    console.log(token)
    axios
      .post(url.verify_email, {
        token: token,
      })
      .then((resp)=>{console.log(resp)
        setmessage(resp.data.message)
    })
      .catch((err) => {
        console.log(err.response.data.message)
        setmessage(err.response.data.message);
      })},
  []
  );
 
  return (
    <div>
      <Nav />
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
