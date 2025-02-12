import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { Register } from "../pages/common/auth/Register";
import { Login } from "../pages/common/auth/Login";
import { UserLayout } from "../components/layout/UserLayout";
import { Customers } from "../pages/user/customers/Customers";
import { ReportLayout } from "../components/layout/ReportLayout";
import { TransactionReportDetails } from "../pages/user/reports/TransactionReportDetails";
import { CashbookReportDetails } from "../pages/user/reports/CashbookReportDetails";
import { Home } from "../pages/common/home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
    ],
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        path: "/user/customers",
        element: <Customers />,
      },
      {
        path: "/user/reports",
        element: <ReportLayout />,
        children: [
          {
            path: "/user/reports/transactions",
            element: <TransactionReportDetails />,
          },
          {
            path: "/user/reports/cashbook",
            element: <CashbookReportDetails />,
          },
        ],
      },
    ],
  },
]);
