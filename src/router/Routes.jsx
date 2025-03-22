import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Register } from "../pages/common/auth/Register";
import { Login } from "../pages/common/auth/Login";
import { UserLayout } from "../components/layout/UserLayout";
import { Customers } from "../pages/user/customers/Customers";
import { TransactionReportDetails } from "../pages/user/reports/TransactionReportDetails";
import { Home } from "../pages/common/home/Home";
import { CustomerDueDates } from "../pages/user/DeuDates/CustomerDueDates";
import { ForgotPassword } from "../pages/common/auth/ForgetPassword";
import { GlobalErrorPage } from "../pages/exception/GlobalErrorPage";
import { NotFoundPage } from "../pages/exception/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <GlobalErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forget-password",
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    errorElement: <GlobalErrorPage />,
    children: [
      {
        path: "/user/customers",
        element: <Customers />,
      },
      {
        path: "/user/deu-dates",
        element: <CustomerDueDates />,
      },
      {
        path: "/user/reports",
        element: <TransactionReportDetails />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
