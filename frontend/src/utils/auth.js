import session, { SessionStorageKey } from "./sessionStorage";
import { url } from "../constants/url";
import axios from "axios";

export const getToken = () => {
  const access = session.getItem(SessionStorageKey.access);
  const refresh = session.getItem(SessionStorageKey.refresh);
  const authType = session.getItem(SessionStorageKey.authType);

  if (access && refresh) return { access, refresh, authType };
};

export const refreshToken = (err) => {
  if ((err.response.data.message = "Token is either invalid or expired")) {
    console.log(true);
    axios
      .get(url.get_access_token, { withCredentials: true })
      .then((resp) => {
        console.log(resp.data.Token);
        session.setItem(SessionStorageKey.access, resp.data.Token);
      })
      .catch((err) => {
        console.log(err);
      });
    
  }
};

export const getAuth = () => {
  const authType = session.getItem(SessionStorageKey.authType);
  if (authType) return authType;
};

export const getUid = () => {
  const uid = session.getItem("uid");
  return uid;
};

export const saveToken = (token, authType, uid) => {
  session.setItem(SessionStorageKey.access, token.access);
  session.setItem(SessionStorageKey.refresh, token.refresh);
  session.setItem(SessionStorageKey.authType, authType);
  session.setItem("uid", uid);
};

export const deleteToken = () => {
  session.removeAllItems();
};
