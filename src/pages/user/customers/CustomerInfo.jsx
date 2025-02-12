import { useQuery } from "@tanstack/react-query";
import { BsGear } from "react-icons/bs";
import { LuClipboardList } from "react-icons/lu";
import {
  getCustomerByIdService,
  getCustomersTransactionService,
} from "../../../service/user/UserService";
import { useState } from "react";
import { AddEntry } from "./AddEntry";
import { IoBookOutline } from "react-icons/io5";
import { HorizontalLoader } from "../../../components/ui/loaders/HorizontalLoader";
import { EntryDetails } from "./EntryDetails";
import { CustomerDetail } from "./CustomerDetail";
import { useNavigate } from "react-router-dom";

export const CustomerInfo = ({
  customerId,
  setSelectedCustomerId,
  refetchCustomers,
  showNotification,
  isCustomersLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState(null);
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);

  const navigate = useNavigate();

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

  // console.log(customer);

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

  return (
    <div className="bg-white w-[94%] mx-auto flex flex-col gap-5">
      <div className="flex  mt-3  justify-between">
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
          <div
            onClick={() =>
              navigate("/user/reports/transactions", {
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
      <div className="flex justify-end">
        <div className="flex flex-col">
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
      <div>
        <div className="grid grid-cols-4 gap-5 text-gray-500 uppercase">
          <p className="col-span-2">Entries</p>
          <p>You Gave</p>
          <p>You Get</p>
        </div>
        <hr className="text-gray-300 mt-2" />
        {isTransactionsLoading ? (
          <div className="w-full h-[25rem]">
            <HorizontalLoader />
          </div>
        ) : (
          <div className="h-[25rem] bg-white-600 overflow-y-auto flex flex-col mt-4 gap-4">
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
                        <div className="flex  gap-1 font-medium ">
                          <p>{formatToReadableDate(entry.date)}</p>
                          {/* <p>•</p> */}
                          {/* <p> {entry.time}</p> */}
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
      {isOpen && (
        <AddEntry
          showNotification={showNotification}
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
          showNotification={showNotification}
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
          showNotification={showNotification}
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
