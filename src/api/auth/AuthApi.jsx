import axios from "axios";
import { BASE_URL } from "../ApiConstants";

const AUTH_URL = `${BASE_URL}/auth`;

const auth = axios.create({
  baseURL: AUTH_URL,
});

export const registerUser = (registerReq) => {
  return auth.post("/registerUser", registerReq);
};

export const loginUser = (loginReq) => {
  return auth.post("/login", loginReq);
};

export const logoutUser = (token) => {
  return auth.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const sendOtpToEmail = (email) => {
  return auth.post(
    "/send-otp",
    {},
    {
      params: {
        email: email,
      },
    }
  );
};

export const VerifyOtp = (email, otp) => {
  return auth.post(
    "/verify-otp",
    {},
    {
      params: {
        email,
        otp,
      },
    }
  );
};

export const resetPassword = (email, otp, password) => {
  return auth.post(
    "/reset-password",
    {},
    {
      params: {
        email,
        otp,
        password,
      },
    }
  );
};
