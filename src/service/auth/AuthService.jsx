import { loginUser, registerUser } from "../../api/auth/AuthApi";

export const registerUserService = async (registerReq) => {
  try {
    const res = await registerUser(registerReq);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const loginUserService = async (loginReq) => {
  try {
    const res = await loginUser(loginReq);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};
