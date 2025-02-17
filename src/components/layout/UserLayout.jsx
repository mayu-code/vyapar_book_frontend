import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../ui/Sidebar";
import { useEffect, useState } from "react";
import {
  clearUserCookie,
  getUserFromCookie,
  setUserCookie,
} from "../../security/cookies/UserCookie";
import { getUserByTokenService } from "../../service/user/UserService";
import { HomeLoader } from "../ui/loaders/HomeLoader";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../firbase";
import { toast, ToastContainer } from "react-toastify";

export const UserLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUserFromCookie());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for messages when the app is in the foreground
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      // alert(payload);
      console.log(payload?.data);
      const { title, body } = payload.data;
      toast.info(`${title} ${body}`);
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      clearUserCookie();
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserByTokenService(token);
        if (fetchedUser) {
          setUser(fetchedUser);
          setUserCookie(fetchedUser);
        } else {
          throw new Error("Token expired or invalid");
        }
      } catch (error) {
        console.error("Token expired or invalid:", error);
        localStorage.removeItem("token");
        clearUserCookie();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (!user) return null;

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <HomeLoader />
      </div>
    );
  }

  return (
    <section className="flex">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        // hideProgressBar
        theme="colored"
      />
      <div className="h-screen w-[6%] md:w-[6%] lg:w-[6%] xl:w-[6%] 2xl:w-[18%] overflow-y-auto bg-[#004D40]">
        <Sidebar />
      </div>
      <div className="w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] 2xl:w-[90%]">
        <Outlet />
      </div>
    </section>
  );
};
