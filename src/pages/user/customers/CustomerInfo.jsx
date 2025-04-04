import { useQuery } from "@tanstack/react-query";
import { BsGear } from "react-icons/bs";
import { LuAlarmClock, LuClipboardList } from "react-icons/lu";
import {
  deleteDueDateService,
  downloadPdfService,
  getCustomerByIdService,
  getCustomersTransactionService,
  setDueDateService,
} from "../../../service/user/UserService";
import { useEffect, useRef, useState } from "react";
import { AddEntry } from "./AddEntry";
import { IoBookOutline } from "react-icons/io5";
import { HorizontalLoader } from "../../../components/ui/loaders/HorizontalLoader";
import { EntryDetails } from "./EntryDetails";
import { CustomerDetail } from "./CustomerDetail";
import { useNavigate } from "react-router-dom";
import { FaRegFilePdf, FaWhatsapp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import useOutsideClick from "../../../components/hooks/useOutsideClick";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { getUserFromCookie } from "../../../security/cookies/UserCookie";
import { FailedReminders } from "./FailedReminders";
import { MdOutlineSmsFailed } from "react-icons/md";

export const CustomerInfo = ({
  refetchGetDashboardData,
  customerId,
  setSelectedCustomerId,
  refetchCustomers,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState(null);
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [reasonPopup, setReasonPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [divHeight, setDivHeight] = useState("30vh");

  const {
    data: customer,
    isLoading: isCustomerLoading,
    refetch: refetchCustomer,
  } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      return await getCustomerByIdService(customerId);
    },
  });

  useEffect(() => {
    const updateHeight = () => {
      const zoomLevel = window.devicePixelRatio;
      setDivHeight(
        `${Math.min(
          customer?.amount < 0 ? 49 : 60,
          Math.max(20, (customer?.amount < 0 ? 57 : 73) / zoomLevel)
        )}vh`
      );
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => window.removeEventListener("resize", updateHeight);
  }, [customer?.amount]);

  const user = getUserFromCookie();

  const navigate = useNavigate();

  // const date = customer?.dueDate ? new Date(customer.dueDate) : new Date();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateStatus, setDateStatus] = useState("set");

  useEffect(() => {
    if (customer?.dueDate) {
      setSelectedDate(new Date(customer.dueDate).toString());
      setDateStatus("edit");
    } else {
      setDateStatus("set");
    }
  }, [customer?.dueDate]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  useOutsideClick(datePickerRef, () => setShowDatePicker(false));

  const handleDateChange = async (date) => {
    if (!date) return;
    setSelectedDate(date);

    const formatted = date ? date.toISOString().split("T")[0] : "";

    const updatedDueDate = {
      id: customer?.id,
      amount: customer?.amount,
      dueDate: formatted,
    };

    if (dateStatus === "edit") {
      setShowDatePicker(false);
      return setReasonPopup(true);
    }

    const res = await setDueDateService(updatedDueDate);

    if (res?.statusCode === 200) {
      // console.log("success");
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }

    refetchCustomer();
    refetchCustomers();

    setShowDatePicker(false);
  };

  const removeDueDate = async () => {
    const res = await deleteDueDateService(customerId, customer?.dueDate);

    if (res?.statusCode === 200) {
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }
    refetchCustomer();
    refetchCustomers();
  };

  const formatToReadableDate = (dateString) => {
    const dateObj = new Date(dateString.replace(" ", "T"));

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const year = dateObj.getFullYear();
    const time = dateObj.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${day} ${month} ${year} ${time}`;
  };

  // Function to convert yyyy-mm-dd to "DD MMM YYYY"
  const formatDueDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";

    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(",", "");
  };

  const {
    data: customersTransactions,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["customersTransactions", customerId],
    queryFn: async () => {
      return await getCustomersTransactionService(customerId);
    },
  });

  const amountColor = (amount) => {
    if (amount > 0) return "text-green-500";
    else if (amount < 0) return "text-red-500";
    else return "text-gray-600";
  };

  const handleButtonClick = (status) => {
    setStatus(status);
    setIsOpen(true);
  };

  if (isCustomerLoading) {
    return (
      <div className="w-full mt-1">
        <HorizontalLoader />
      </div>
    );
  }

  const handleDetailClick = (transition) => {
    setIsDetailOpen(true);
    setSelectedTransition(transition);
  };

  const handleDownload = async () => {
    const response = await downloadPdfService(customerId);

    const url = window.URL.createObjectURL(
      new Blob([response?.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `customer_transactions_${customerId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const messageTemplate = `Payment of Rs. ${-customer?.amount} pending with ${
    user?.name
  } (${user?.mobileNo})`;

  const sendMessage = () => {
    if (customer?.mobileNo?.length === 0) {
      toast.error("Customer Number is not present");
      return;
    } else if (customer?.mobileNo?.length < 10) {
      toast.error("Customer Number is not valid");
      return;
    }

    const phoneNumber = `91${customer?.mobileNo}`;

    window.open(
      `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${messageTemplate}`,
      "_blank"
    );
  };

  const handleConfirm = async () => {
    const formatted = selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : "";

    const updatedDueDate = {
      id: customer?.id,
      amount: customer?.amount,
      reason: reason,
      dueDate: formatted,
    };

    const res = await setDueDateService(updatedDueDate);

    if (res?.statusCode === 200) {
      // console.log("success");
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }

    setReasonPopup(false);
    setReason("");

    refetchCustomer();
    refetchCustomers();
  };

  return (
    <div
      className="bg-white w-[94%] mx-auto flex flex-col h-full gap-5"
      ref={datePickerRef}
    >
      <div className="flex  mt-3  justify-between" ref={datePickerRef}>
        <div className="flex gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-200">
            <span className="text-blue-600 text-xl font-medium">
              {customer?.name[0]}
            </span>
          </div>

          <div>
            <p className="text-md font-semibold">{customer?.name}</p>
            <p className="text-gray-700 text-sm">+91 {customer?.mobileNo}</p>
          </div>
        </div>

        <div className="flex gap-4">
          {customersTransactions?.length > 0 && (
            <div
              onClick={handleDownload}
              className="flex gap-2 border border-gray-400 p-2 rounded-md text-gray-600 cursor-pointer"
            >
              <p className="flex justify-center items-center">
                <FaRegFilePdf />
              </p>
              <p className="flex justify-center items-center">Download PDF</p>
            </div>
          )}
          <div
            onClick={() =>
              navigate("/user/reports", {
                state: { customerName: customer?.name },
              })
            }
            className="flex gap-2 px-2 text-gray-500 cursor-pointer border border-gray-400 rounded-md"
          >
            <div className="flex cursor-pointer justify-center items-center">
              <LuClipboardList />
            </div>
            <button className="cursor-pointer">Report</button>
          </div>
          <div
            onClick={() => setIsCustomerDetailOpen(true)}
            className="flex justify-center items-center gap-2 px-4 text-gray-500 cursor-pointer border border-gray-400 rounded-md"
          >
            <BsGear />
          </div>
        </div>
      </div>
      <div className="flex justify-between" ref={datePickerRef}>
        {customer?.amount < 0 ? (
          <div className="flex flex-col gap-1" ref={datePickerRef}>
            <div className="flex gap-2 text-gray-600">
              <p className="flex justify-center items-center">
                <LuAlarmClock size={20} />
              </p>
              <p className="flex justify-center items-center font-medium">
                Due Date:
              </p>
            </div>
            <div className="flex gap-4 text-gray-700 select-none">
              <p className="flex justify-center items-center">
                {formatDueDate(customer?.dueDate)}
              </p>
              <div className="flex gap-2">
                <p
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="px-2 border border-blue-300 text-sm cursor-pointer hover:border-blue-400 rounded-md text-blue-600"
                >
                  {customer?.dueDate ? "Edit" : "Set Date"}
                </p>
                {customer?.dueDate && (
                  <p
                    onClick={removeDueDate}
                    className="px-2 border border-blue-300 text-sm cursor-pointer hover:border-blue-400 rounded-md text-blue-600"
                  >
                    Remove
                  </p>
                )}
              </div>
              {showDatePicker && (
                <div className="absolute top-36">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    onKeyDown={(e) => e.preventDefault()}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={50}
                    shouldCloseOnSelect={true}
                    inline
                    minDate={new Date()}
                    calendarClassName="border border-gray-300 rounded-md shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <div className="flex flex-col" ref={datePickerRef}>
          <p className="uppercase text-center text-gray-600">Net Balance:</p>
          <div className="flex gap-2">
            <p className="font-medium text-gray-700">
              {customer?.amount >= 0 ? "You'll Give" : "You'll Get"}:
            </p>
            <p className={` font-medium ${amountColor(customer?.amount)} `}>
              ₹{customer?.amount >= 0 ? customer?.amount : -customer?.amount}
            </p>
          </div>
        </div>
      </div>
      {customer?.amount < 0 && (
        <div className="flex justify-between px-8">
          <div className="flex gap-1 justify-center items-center font-medium">
            <p className="flex justify-center items-center">Send Reminder</p>
            <p
              className="flex justify-center items-center"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <IoMdInformationCircleOutline />
            </p>
            {showTooltip && (
              <div className="absolute right-[10%] text-gray-700 w-[20rem] top-[33%] xl:top-[30%] 2xl:top-[28%] mt-1 bg-gray-50 border py-3 px-4 border-gray-300  text-sm rounded shadow-lg">
                <div className="font-semibold text-gray-800">
                  Remider Template
                </div>
                <div className="p-2 border mt-3 border-gray-300">
                  {messageTemplate}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <div
              onClick={sendMessage}
              className="flex gap-2 cursor-pointer justify-center items-center px-4 border border-gray-300 rounded-md py-2"
            >
              <p className="flex justify-center items-center text-green-500">
                <FaWhatsapp />
              </p>
              <p className="flex justify-center items-center ">Whatsapp</p>
            </div>
            <div
              onClick={() => setShowPopup(true)}
              className="flex gap-2 cursor-pointer justify-center items-center px-4 border border-gray-300 rounded-md py-2"
            >
              <p className="flex justify-center items-center ">
                <MdOutlineSmsFailed />
              </p>
              <p className="flex justify-center items-center ">Remiders</p>
            </div>
          </div>
        </div>
      )}
      {showPopup && (
        <FailedReminders customer={customer} setShow={setShowPopup} />
      )}
      <div ref={datePickerRef}>
        <div className="grid grid-cols-4 gap-5 text-gray-500 uppercase">
          <p className="col-span-2">Entries</p>
          <p>You Gave</p>
          <p>You Get</p>
        </div>
        <hr className="text-gray-300 mt-2" />
        {isTransactionsLoading ? (
          <div className="w-full" style={{ height: divHeight }}>
            <HorizontalLoader />
          </div>
        ) : (
          <div
            className="
            bg-white overflow-auto flex flex-col mt-4 gap-4"
            style={{ height: divHeight }}
          >
            {customersTransactions?.length > 0 ? (
              customersTransactions?.map((entry, index) => {
                return (
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleDetailClick(entry)}
                  >
                    <div className="grid grid-cols-4 gap-5 ">
                      <div className="flex flex-col col-span-2 gap-1">
                        <div className="flex flex-col gap-1 font-medium ">
                          <p>{formatToReadableDate(entry.date)}</p>
                          {entry?.bill && (
                            <img
                              src={`data:image/jpeg;base64,${entry.bill}`}
                              alt="bill"
                              className="w-10 h-10"
                            />
                          )}
                        </div>
                        <div className="text-gray-500 flex gap-1">
                          <p>Balance:</p>
                          <p>
                            ₹
                            {entry.balanceAmount >= 0
                              ? entry.balanceAmount
                              : -entry.balanceAmount}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-start items-center font-semibold">
                        <p className="text-red-500">
                          {entry.amount < 0
                            ? `₹${Number(entry.amount * -1).toLocaleString()}`
                            : "-"}
                        </p>
                      </div>
                      <div className="flex justify-start items-center font-semibold">
                        <p className="text-green-500">
                          {entry.amount > 0
                            ? `₹${Number(entry.amount).toLocaleString()}`
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <hr className="text-gray-300" />
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col gap-5 justify-center items-center w-full h-full">
                <p>
                  <IoBookOutline size={120} className="text-gray-400" />
                </p>
                <p className="font-medium text-xl">No entries added</p>
              </div>
            )}
          </div>
        )}
      </div>
      {reasonPopup && (
        <ReasonPopUp
          reason={reason}
          setReason={setReason}
          setShowPopup={setReasonPopup}
          handleConfirm={handleConfirm}
        />
      )}
      {isOpen && (
        <AddEntry
          refetchGetDashboardData={refetchGetDashboardData}
          refetchCustomers={refetchCustomers}
          refetchTransactions={refetchTransactions}
          refetchCustomer={refetchCustomer}
          setIsOpen={setIsOpen}
          status={status}
          customerId={customerId}
        />
      )}
      {isDetailOpen && (
        <EntryDetails
          refetchGetDashboardData={refetchGetDashboardData}
          refetchCustomers={refetchCustomers}
          refetchTransactions={refetchTransactions}
          refetchCustomer={refetchCustomer}
          customer={customer}
          selectedTransition={selectedTransition}
          setIsDetailOpen={setIsDetailOpen}
        />
      )}
      {isCustomerDetailOpen && (
        <CustomerDetail
          setIsDetailOpen={setIsCustomerDetailOpen}
          setSelectedCustomerId={setSelectedCustomerId}
          customer={customer}
          refetchTransactions={refetchTransactions}
          refetchCustomer={refetchCustomer}
          refetchCustomers={refetchCustomers}
        />
      )}

      <div className="p-4 grid grid-cols-2 gap-4">
        <button
          onClick={() => handleButtonClick(false)}
          className="bg-red-100 hover:bg-red-700 hover:text-white cursor-pointer p-2 text-red-600 rounded-md"
        >
          You Gave ₹
        </button>
        <button
          onClick={() => handleButtonClick(true)}
          className="bg-green-100 hover:bg-green-700 hover:text-white cursor-pointer p-2 text-green-600 rounded-md"
        >
          You Got ₹
        </button>
      </div>
    </div>
  );
};

const ReasonPopUp = ({ reason, setReason, setShowPopup, handleConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-1">Enter Reason</h2>
        <p className="text-gray-700 text-sm mb-4">
          You are changing the due date mention the reason.
        </p>
        <input
          type="text"
          className="w-full p-2 border border-gray-500 focus:outline-none focus:border-blue-500 rounded-md"
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setShowPopup(false)}
            className="px-4 py-2 cursor-pointer bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
