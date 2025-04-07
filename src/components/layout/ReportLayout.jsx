import { Outlet } from "react-router-dom";
import { Report } from "../../pages/user/reports/Report";

export const ReportLayout = () => {
  return (
    <section className="flex">
      <div className="h-screen w-[30%] ">
        <Report />
      </div>
      <div className="w-[70%] h-screen ">
        <Outlet />
      </div>
    </section>
  );
};
