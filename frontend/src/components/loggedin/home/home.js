import React, { useState, useEffect } from "react";
import LoggedinNavbar from "../navigation/nav";
import { url } from "../../../constants/url";
import useAuth from "../../../hooks/useAuth";
import {Text ,Image,Flex} from "@chakra-ui/react"
import axios from "axios";

import "./home.css";

const LoggedInHome = () => {
  const id = useAuth((state) => state.uid);
  const accessToken = useAuth((state) => state.tokens);
  const updateToken = useAuth((state) => state.updateToken);

  const [profilePic,setprofilePic] = useState("")
  const [name,setName] = useState("")
  const [dob,setDob] = useState(new Date())
  const [email,setEmail] = useState("")

  useEffect(() => {
    const getData = async () => {

      await axios
        .get(url.userinfo + "/" + id, {
          headers: { token: accessToken.access },
        })
        .then((resp) => {
          console.log(resp);
          setprofilePic(resp.data.profile_pic)
          setName(resp.data.username);
          setDob(new Date(resp.data.dob))
          setEmail(resp.data.email)
        })
        .catch((err) => {
          console.log(err.response);
          if (
            err.response.data.message == "Token is either invalid or expired"
          ) {
            updateToken(err);
          }
        });
    };

    getData();
  }, [id, accessToken]);

  return (
    <div className="innerhome">
      <LoggedinNavbar />
      <div>
        <div className="jumbotron p-3 p-md-5 text-white rounded-bottom bg-dark">
          <div className="col-md-6 px-0">
            <h1 className="display-4 font-italic">{"Welcome " + name}</h1>
            <Text>Email: {email}</Text>
            <Text>dob: {dob.toDateString()}</Text>
            <Flex justifyContent="center" alignItems="center" gap="5vw" padding="5">
              <Text>Profile Picture</Text>
              <Image
                borderRadius="full"
                boxSize="150px"
                src={profilePic}
                alt="profile picture"
              />
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggedInHome;
