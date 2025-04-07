import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromCookie } from "../../../security/cookies/UserCookie";

export const Home = () => {
  const navigate = useNavigate();
  const user = getUserFromCookie();

  useEffect(() => {
    if (user) {
      navigate("/user/customers");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return null;
};
