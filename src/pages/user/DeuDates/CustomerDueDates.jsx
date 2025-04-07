import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import { getCustomersOnDueDateService } from "../../../service/user/UserService";

import { DueDateTable } from "./DueDateTable";
import { TbCalendarDue } from "react-icons/tb";
import { useState } from "react";

export const CustomerDueDates = () => {
  const [activeTab, setActiveTab] = useState("Today");
  //   const location = useLocation();
  //   const customerName = location.state?.customerName;

  //   const { data: transitionData, isLoading: isTransitionDataLoading } = useQuery(
  //     {
  //       queryKey: ["transitionData"],
  //       queryFn: async () => {
  //         return await getTransactionReportService();
  //       },
  //     }
  //   );

  //   const cards = [
  //     {
  //       id: 1,
  //       amount: -transitionData?.youGave,
  //       status: "You Gave",
  //     },
  //     {
  //       id: 2,
  //       amount: transitionData?.youGot,
  //       status: "You Got",
  //     },
  //     {
  //       id: 3,
  //       amount: transitionData?.netBalance,
  //       status: "Net Balance",
  //     },
  //   ];

  // const getLastDateOfYear = () => {
  //   const date = new Date();
  //   date.setMonth(11, 31);
  //   return date.toISOString().split("T")[0];
  // };

  // const getFirstDateOfYear = () => {
  //   const year = new Date().getFullYear();
  //   return `${year}-01-01`;
  // };

  // const req = {
  //   query: undefined,
  //   startDate: getFirstDateOfYear(),
  //   endDate: getLastDateOfYear(),
  // };

  // const [filter, setFilter] = useState(req);
  //   const [searchQuery, setSearchQuery] = useState(customerName || "");

  //   useEffect(() => {
  //     setSearchQuery(customerName || "");
  //     setFilter((prev) => ({
  //       ...prev,
  //       query: searchQuery,
  //     }));
  //   }, [customerName]);

  const { data: dueCustomers, isLoading: isDueCustomersLoading } = useQuery({
    queryKey: ["dueCustomers"],
    queryFn: async () => {
      return await getCustomersOnDueDateService();
    },
  });

  // console.log(dueCustomers);

  //   const handleSearchChange = (e) => {
  //     let value = e.target.value;

  //     if (value.startsWith(" ")) {
  //       value = value.trim();
  //     }

  //     setSearchQuery(value);
  //     setFilter((prev) => ({ ...prev, query: value }));
  //   };

  return (
    <section className="h-screen overflow-y-auto">
      <div className="px-4 py-3 flex gap-4">
        <div className=" relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-700">
          <span className="text-white text-xl font-medium">
            <TbCalendarDue />
          </span>
        </div>

        <div className="flex justify-center items-center">
          <p className="font-semibold text-lg">Customer Due Dates</p>
        </div>
      </div>

      <div className="px-20 flex gap-10 text-lg mt-5 border-b border-gray-300">
        <p
          className={`cursor-pointer relative px-5 pb-4 ${
            activeTab === "Today"
              ? "font-bold text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 font-medium"
          }`}
          onClick={() => setActiveTab("Today")}
        >
          Today&apos;s{" "}
          <span
            className={`${
              dueCustomers?.todaysDueDate?.length
                ? "bg-red-100 text-red-500"
                : ""
            } text-sm py-1 px-2 font-medium  rounded-full`}
          >
            {dueCustomers?.todaysDueDate?.length || 0}
          </span>
        </p>

        <p
          className={`cursor-pointer relative px-5 pb-4 ${
            activeTab === "Tomorrow"
              ? "font-bold text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 font-medium"
          }`}
          onClick={() => setActiveTab("Tomorrow")}
        >
          Tomorrow&apos;s{" "}
          <span
            className={`${
              dueCustomers?.tomorrowDueDate?.length
                ? "bg-red-100 text-red-500"
                : ""
            } text-sm py-1 px-2 font-medium  rounded-full`}
          >
            {dueCustomers?.tomorrowDueDate?.length || 0}
          </span>
        </p>

        <p
          className={`cursor-pointer relative px-5 pb-4 ${
            activeTab === "Pending"
              ? "font-bold text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 font-medium"
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending
          <span
            className={`${
              dueCustomers?.notPaymentYet?.length
                ? "bg-red-100 text-red-500"
                : ""
            } text-sm py-1 px-2 font-medium  rounded-full`}
          >
            {dueCustomers?.notPaymentYet?.length || 0}
          </span>
        </p>
      </div>

      <div className="py-3 px-2 mt-3">
        {/* <div className="flex gap-3 mt-5">
          {cards.map((card) => {
            return (
              <div
                key={card.id}
                className={`text-2xl flex flex-col ${
                  card.id === 2 ? "bg-green-100" : ""
                } px-4 py-8 w-52 rounded-md gap-2`}
              >
                <p
                  className={` font-medium ${
                    card.status === "Net Balance"
                      ? card.amount > 0
                        ? "text-green-700"
                        : card?.amount < 0
                        ? "text-red-700"
                        : "text-gray-800"
                      : "text-gray-800"
                  } `}
                >
                  ₹{Number(card.amount).toLocaleString()}
                </p>
                <p
                  className={`text-[16px] ml-1 ${selectColor(
                    card.status
                  )} font-medium`}
                >
                  {card.status}
                </p>
              </div>
            );
          })}
        </div> */}

        <div>
          <DueDateTable
            customers={dueCustomers}
            isLoading={isDueCustomersLoading}
            activeTab={activeTab}
          />
        </div>
      </div>
    </section>
  );
};
