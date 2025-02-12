import axios from "axios";

const auth = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

export const registerUser = (registerReq) => {
  return auth.post("/registerUser", registerReq);
};

export const loginUser = (loginReq) => {
  return auth.post("/login", loginReq);
};
