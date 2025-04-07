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
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      const title = payload?.notification?.title || "Notification";
      const body = payload?.notification?.body || "";

      toast.info(`${title}  ${body}`);
    });

    return () => unsubscribe(); // Cleanup on unmount
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
      <div className="min-h-screen w-[6%] md:w-[6%] lg:w-[6%] xl:w-[18%] 2xl:w-[18%] overflow-y-auto ">
        <Sidebar />
      </div>
      <div className="w-[100%] md:w-[100%] min-h-screen lg:w-[100%] xl:w-[100%] 2xl:w-[90%]">
        <Outlet />
      </div>
    </section>
  );
};
