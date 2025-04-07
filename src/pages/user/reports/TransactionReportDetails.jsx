import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendarDate } from "react-icons/ci";
import { GrTransaction } from "react-icons/gr";
import "react-datepicker/dist/react-datepicker.css";
import { TransactionsTable } from "./TransactionsTable";
import { useQuery } from "@tanstack/react-query";
import {
  downloadExcelService,
  getTransactionsService,
} from "../../../service/user/UserService";
import { useLocation } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";

export const TransactionReportDetails = () => {
  const location = useLocation();
  const customerName = location.state?.customerName;
  // const customerId = location.state?.customerId;

  const formatDateTime = (dateObj) => {
    const now = dateObj || new Date();
    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0")
    );
  };

  const getLastDateOfYear = () => {
    const date = new Date();
    date.setMonth(11, 31);
    return date.toISOString().split("T")[0];
  };

  const getFirstDateOfYear = () => {
    const year = new Date().getFullYear();
    return `${year}-01-01`;
  };

  const req = {
    query: undefined,
    startDate: getFirstDateOfYear(),
    endDate: getLastDateOfYear(),
  };

  const [filter, setFilter] = useState(req);
  const [searchQuery, setSearchQuery] = useState(customerName || "");

  useEffect(() => {
    setSearchQuery(customerName || "");
    setFilter((prev) => ({
      ...prev,
      query: searchQuery,
    }));
  }, [customerName]);

  const { data: allTransactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["allTransactions", filter],
    queryFn: async () => {
      return await getTransactionsService(filter);
    },
  });

  const positiveSum = allTransactions
    ?.filter((transaction) => transaction.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const negativeSum = allTransactions
    ?.filter((transaction) => transaction.amount < 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const cards = [
    {
      id: 1,
      amount: positiveSum,
      status: "You Gave",
    },
    {
      id: 2,
      amount: negativeSum === 0 ? 0 : -negativeSum,
      status: "You Got",
    },
    {
      id: 3,
      amount: positiveSum + negativeSum,
      status: "Net Balance",
    },
  ];

  const selectColor = (status) => {
    switch (status) {
      case "You Gave":
        return "text-red-700";

      case "You Got":
        return "text-green-700";

      default:
        return "text-gray-500";
    }
  };

  const handleSearchChange = (e) => {
    let value = e.target.value;

    if (value.startsWith(" ")) {
      value = value.trim();
    }

    setSearchQuery(value);
    setFilter((prev) => ({ ...prev, query: value }));
  };

  const handleExcelDownload = async () => {
    const response = await downloadExcelService(filter);

    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "customers_transactions.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // const handlePdfDownload = async () => {
  //   const response = await downloadPdfService(customerId);

  //   const url = window.URL.createObjectURL(
  //     new Blob([response?.data], { type: "application/pdf" })
  //   );
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", `customer_transactions_${customerId}.pdf`);
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  // };

  return (
    <section className="h-screen overflow-y-auto">
      <div className="p-3 flex justify-between">
        <div className="flex gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-700">
            <span className="text-white text-xl font-medium">
              <GrTransaction />
            </span>
          </div>

          <div className="flex justify-center items-center">
            <p className="font-semibold text-lg">Transactions Reports</p>
          </div>
        </div>

        <div className="flex gap-5 justify-center items-center pr-5">
          {/* <div
            onClick={handlePdfDownload}
            className="flex gap-2 border border-gray-400 p-2 rounded-md text-gray-600 cursor-pointer"
          >
            <p className="flex justify-center items-center">
              <FaRegFilePdf />
            </p>
            <p>Download PDF</p>
          </div> */}
          <div
            onClick={handleExcelDownload}
            className="flex gap-2 border border-gray-400 p-3 rounded-md text-gray-600 cursor-pointer"
          >
            <p className="flex justify-center items-center">
              <RiFileExcel2Line />
            </p>
            <p className="flex justify-center items-center">Download Excel</p>
          </div>
        </div>
      </div>
      <hr className="text-gray-300 mt-3" />

      <div className="flex gap-4 py-3 px-6 mt-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className=" text-gray-700">
            Customer Name
          </label>
          <input
            type="search"
            name="name"
            value={searchQuery}
            onChange={handleSearchChange}
            id="name"
            placeholder="Search"
            className="p-2 border border-gray-300 focus:border-blue-500 focus:outline-none rounded-md"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="startDate" className="text-gray-700">
            Start Date
          </label>
          <div className="relative flex items-center">
            <CiCalendarDate
              size={24}
              className="absolute left-3 text-gray-500"
            />
            <DatePicker
              selected={filter?.startDate}
              onChange={(date) => {
                setFilter((prev) => ({
                  ...prev,
                  startDate: formatDateTime(date),
                }));
              }}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              scrollableYearDropdown
              onKeyDown={(e) => e.preventDefault()}
              yearDropdownItemNumber={50}
              placeholderText="Select start date"
              className="w-full pl-10 cursor-pointer pr-3 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 ">
          <label htmlFor="endDate" className="text-gray-700">
            End Date
          </label>
          <div className="relative flex items-center">
            <CiCalendarDate
              size={24}
              className="absolute left-3 text-gray-500"
            />
            <DatePicker
              selected={filter?.endDate}
              onChange={(date) => {
                setFilter((prev) => ({
                  ...prev,
                  endDate: formatDateTime(date),
                }));
              }}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              onKeyDown={(e) => e.preventDefault()}
              scrollableYearDropdown
              yearDropdownItemNumber={50}
              placeholderText="Select end date"
              className="w-full pl-10 pr-3 cursor-pointer py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="py-3 px-6 mt-4">
        <h2 className="font-medium">Total {allTransactions?.length} entries</h2>

        <div className="flex gap-3 mt-5">
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
        </div>

        <div className="mt-8">
          <TransactionsTable
            transactions={allTransactions}
            isLoading={isTransactionsLoading}
          />
        </div>
      </div>
    </section>
  );
};
