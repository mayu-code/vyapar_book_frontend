import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { ToastContainer } from "react-toastify";

export const AppLayout = () => {
  return (
    <>
      <Header />
      <ToastContainer
        className="mt-20"
        position="top-center"
        autoClose={5000}
        // hideProgressBar
        theme="colored"
      />
      <Outlet />
    </>
  );
};
