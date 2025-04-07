import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import { IoIosSearch, IoMdAdd } from "react-icons/io";
import { LuClipboardList } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import { HorizontalLoader } from "../../../components/ui/loaders/HorizontalLoader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const CustomerList = ({
  paramReq,
  setFilter,
  searchQuery,
  setSearchQuery,
  setIsOpen,
  setSelectedCustomerId,
  selectedCustomerId,
  dashboardData,
  customers,
  isCustomersLoading,
}) => {
  const navigate = useNavigate();
  const [divHeight, setDivHeight] = useState("30vh");

  useEffect(() => {
    const updateHeight = () => {
      const zoomLevel = window.devicePixelRatio;
      setDivHeight(`${Math.min(60, Math.max(20, 73 / zoomLevel))}vh`);
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleSearchChange = (e) => {
    let value = e.target.value;

    if (value.startsWith(" ")) {
      value = value.trim();
    }

    setSearchQuery(value);
    setFilter((prev) => ({ ...prev, query: value }));
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;

    setFilter({
      ...paramReq,
      [value]: value ? true : false,
    });
  };

  // console.log(filter);

  function formatTimeAgo(dateString) {
    const parsedDate = parseDate(dateString);
    if (!parsedDate) return "Invalid date";

    const now = new Date();
    const seconds = Math.floor((now - parsedDate) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (let { label, seconds: intervalSeconds } of intervals) {
      const count = Math.floor(seconds / intervalSeconds);
      if (count > 0) {
        return `${count} ${label}${count !== 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  }

  function parseDate(dateString) {
    let parsedDate;

    parsedDate = new Date(dateString);
    if (!isNaN(parsedDate)) return parsedDate;

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split("-").map(Number);
      parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate)) return parsedDate;
    }

    return null;
  }
  const checkAmount = (amount) => {
    if (amount > 0) {
      return "You'll Give";
    } else if (amount < 0) {
      return "You'll Get";
    } else {
      return "";
    }
  };

  const handleReportClick = () => {
    navigate("/user/reports");
  };

  // console.log(customers);

  return (
    <div className="bg-white border-r border-r-gray-200 flex h-full flex-col gap-5">
      <div className="flex justify-around mt-5 border-b border-gray-300 pb-3">
        <div className="flex gap-2 text-lg">
          <p className="flex justify-center items-center text-gray-600">
            You&apos;ll Give:
          </p>
          <p className="flex justify-center items-center font-medium text-gray-700">
            ₹{dashboardData?.youWillGave}
          </p>
          <p className="flex justify-center items-center text-green-500 ">
            <GoArrowUpRight />
          </p>
        </div>

        <div className="flex gap-2 text-lg">
          <p className="flex justify-center items-center text-gray-600">
            You&apos;ll Get:
          </p>
          <p className="flex justify-center items-center font-medium text-gray-700">
            ₹{dashboardData?.youWillGet * -1}
          </p>
          <p className="flex justify-center items-center text-red-500 ">
            <GoArrowDownLeft />
          </p>
        </div>

        <div
          onClick={handleReportClick}
          className="flex gap-3 py-2 px-4 text-blue-500 hover:border-blue-700 cursor-pointer border border-blue-500 rounded-md"
        >
          <div className="flex cursor-pointer justify-center items-center">
            <LuClipboardList />
          </div>
          <button className="cursor-pointer">View Report</button>
        </div>
      </div>

      <div className="px-4 flex justify-between w-[97%] mx-auto">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-600">Search for customers</p>
          <div className="flex gap-2 p-2 ring ring-gray-400 focus-within:ring-blue-500 rounded-md">
            <p className="flex justify-center items-center">
              <IoIosSearch size={20} />
            </p>
            <input
              type="search"
              name="search"
              placeholder="Name or Phone Number"
              value={searchQuery}
              autoComplete="none"
              onChange={handleSearchChange}
              className="focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium text-gray-600">Filter By</p>
          <div className="flex gap-2 p-2 ring ring-gray-400 focus-within:ring-blue-500 rounded-md">
            <p className="flex justify-center items-center">
              <MdFilterList size={20} />
            </p>
            <select
              name="filter"
              className="focus:outline-none bg-white text-gray-700"
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="gave">You&apos;ll Give</option>
              <option value="get">You&apos;ll Get</option>
              <option value="settle">Settled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full h-full">
        <div className="flex px-4 uppercase text-gray-500 text-sm justify-between">
          <p>Name</p>
          <p>Amount</p>
        </div>

        <div
          className=" mt-5 flex flex-col gap-8 overflow-y-auto"
          style={{ height: divHeight }}
        >
          {isCustomersLoading ? (
            <div className="w-full">
              <HorizontalLoader />
            </div>
          ) : customers?.length > 0 ? (
            customers?.map((customer, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setSelectedCustomerId(customer?.id)}
                  className="flex cursor-pointer justify-between items-center px-4 bg-white rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-200">
                      <span className="text-blue-600 text-xl font-medium">
                        {customer?.name ? customer?.name[0] : ""}
                      </span>
                    </div>

                    <div>
                      <p
                        className={`text-gray-950 ${
                          customer?.id === selectedCustomerId ? "font-bold" : ""
                        }`}
                      >
                        {customer?.name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {formatTimeAgo(customer?.updateDate)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-lg  ${
                        customer?.amount > 0
                          ? "text-green-500 font-semibold"
                          : customer?.amount < 0
                          ? "text-red-500 font-semibold"
                          : "text-black"
                      }`}
                    >
                      ₹
                      {customer?.amount >= 0
                        ? Number(customer?.amount).toLocaleString()
                        : Number(customer?.amount * -1).toLocaleString()}
                    </p>
                    <p className="text-gray-500 uppercase font-semibold text-sm">
                      {checkAmount(customer?.amount)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col gap-5 justify-center items-center w-full h-full">
              <p>
                <FiUser size={100} className="text-gray-400" />
              </p>
              <p className="font-medium text-lg">No Customer Found</p>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center w-full p-2 bg-transparent/50">
          <div
            onClick={() => setIsOpen(true)}
            className="flex gap-3 py-2 px-4 text-white hover:bg-blue-700 cursor-pointer bg-blue-600 rounded-md"
          >
            <div className="flex cursor-pointer justify-center items-center">
              <IoMdAdd />
            </div>
            <button className="cursor-pointer">Add Customer</button>
          </div>
        </div>
      </div>
    </div>
  );
};
