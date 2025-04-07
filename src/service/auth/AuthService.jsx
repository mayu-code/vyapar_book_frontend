import {
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendOtpToEmail,
  VerifyOtp,
} from "../../api/auth/AuthApi";

const errorMessage = {
  message: "Something went wrong !!",
};

export const registerUserService = async (registerReq) => {
  try {
    const res = await registerUser(registerReq);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || errorMessage;
  }
};

export const loginUserService = async (loginReq) => {
  try {
    const res = await loginUser(loginReq);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || errorMessage;
  }
};

export const logoutUserService = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await logoutUser(token);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || errorMessage;
  }
};

export const sendOtpToEmailService = async (email) => {
  try {
    const res = await sendOtpToEmail(email);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || errorMessage;
  }
};

export const VerifyOtpService = async (email, otp) => {
  try {
    const res = await VerifyOtp(email, otp);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || errorMessage;
  }
};

export const resetPasswordService = async (email, otp, password) => {
  try {
    const res = await resetPassword(email, otp, password);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || errorMessage;
  }
};
