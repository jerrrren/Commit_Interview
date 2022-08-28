import create from "zustand";

import { saveToken, deleteToken, getAuth, getUid,getToken,refreshToken } from "../utils/auth";
import { ROLE } from "../constants/roles";

const useAuth = create((set) => ({
  isAuth: getAuth(),
  uid: getUid(),
  tokens:getToken(),

  userLogin: (token, uid) => {
    saveToken(token, ROLE.User, uid);
    set({ isAuth: getAuth() });
    set({ uid: getUid() });
    set({ tokens: getToken() })
  },


  updateToken:(accessToken) => {

    refreshToken(accessToken)
    set({tokens:getToken()})
  },
  

  logout: () => {
    deleteToken();
    set({ isAuth: getAuth() });
    set({ uid: getUid() });
  },
}));

export default useAuth;
