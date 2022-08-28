const host = "http://localhost:8080";

export const url = {
  login: host + "/users/login",
  signup: host + "/users/signup",
  userinfo: host + "/users",
  get_verification_status: host + "/email/checkverified",
  send_verification_email: host + "/email/sendverificationemail?id=",
  verify_email: host + "/email/verifyemail",
  get_access_token: host + "/token"
};

