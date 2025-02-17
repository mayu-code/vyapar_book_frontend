import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import { CiCalendarDate } from "react-icons/ci";
import { updateTransactionService } from "../../../service/user/UserService";
import { FaAngleLeft } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useState } from "react";

export const EditEntry = ({
  refetchGetDashboardData,
  status,
  setIsDetailOpen,
  refetchCustomers,
  setIsOpen,
  transition,
  refetchCustomer,
  refetchTransactions,
}) => {
  const formatDateTime = (dateObj) => {
    const now = dateObj || new Date();
    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      " " +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0") +
      ":" +
      String(now.getSeconds()).padStart(2, "0")
    );
  };

  const [entryData, setEntryData] = useState({
    id: transition?.id,
    amount: transition?.amount >= 0 ? transition?.amount : -transition?.amount,
    date: transition?.date,
    detail: transition?.detail,
    gave: transition?.amount < 0,
    got: transition?.amount >= 0,
  });

  const handleDateChange = (selectedDate) => {
    setEntryData((prev) => ({
      ...prev,
      date: formatDateTime(selectedDate),
    }));
  };

  const handleSubmit = async () => {
    console.log(entryData);

    const res = await updateTransactionService(entryData);

    if (res?.statusCode === 200) {
      setIsOpen(false);
      setIsDetailOpen(false);
      toast.success(res?.message);
      setTimeout(() => {
        refetchCustomers();
        refetchCustomer();
        refetchTransactions();
        refetchGetDashboardData();
      }, 100);
    } else {
      setIsOpen(false);
      setIsDetailOpen(false);
      toast.error(res?.message);
      setTimeout(() => {
        refetchCustomers();
        refetchCustomer();
        refetchTransactions();
        refetchGetDashboardData();
      }, 100);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntryData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="fixed inset-0 bg-black/50 flex">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute right-0 top-0 h-full w-[25%] bg-white shadow-lg rounded-l-md"
      >
        <div className="flex gap-1 p-5">
          <div
            onClick={() => setIsOpen(false)}
            className="flex cursor-pointer justify-center items-center"
          >
            <FaAngleLeft size={18} />
          </div>
          <h2
            className={`text-lg font-medium ${
              status ? "text-green-600" : "text-red-600"
            }`}
          >
            Edit Entry
          </h2>
        </div>

        <hr className="text-gray-300" />

        <div className="h-[35rem] py-2 px-4 flex flex-col gap-5 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-gray-800">
              Amount
            </label>
            <div className="flex px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500">
              <div className="flex justify-center items-center">
                <p>₹</p>
              </div>
              <input
                type="text"
                name="amount"
                id="amount"
                pattern="^\d+(\.\d{0,2})?$"
                value={entryData.amount}
                onChange={handleInputChange}
                maxLength={8}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*?)\..*/g, "$1")
                    .replace(/^0+(\d)/, "$1")
                    .replace(/^(\d+)\.(\d{2})\d*$/, "$1.$2");
                }}
                className="focus:outline-none w-full pl-2"
                placeholder="Enter Amount"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="detail" className="text-gray-800">
              Description
            </label>
            <textarea
              name="detail"
              id="detail"
              value={entryData.detail}
              onChange={handleInputChange}
              rows={5}
              className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
              placeholder="Enter Details (Item Name, Bill No, Quantity, etc)"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="date" className="text-gray-700">
              Date
            </label>
            <div className="relative flex w-full items-center">
              <CiCalendarDate
                size={24}
                className="absolute left-3 text-gray-800"
              />
              <DatePicker
                selected={entryData?.date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                onKeyDown={(e) => e.preventDefault()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={50}
                placeholderText="Select Date"
                className="w-full pl-10 pr-3 py-2 cursor-pointer rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="w-[90%] py-2 mx-auto">
          <button
            onClick={handleSubmit}
            className={`p-2 w-full cursor-pointer rounded-md text-white ${
              status
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Save
          </button>
        </div>
      </motion.div>
    </section>
  );
};
