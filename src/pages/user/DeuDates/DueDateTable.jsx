import { HorizontalLoader } from "../../../components/ui/loaders/HorizontalLoader";
import { IoAlarmOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { TbUsers } from "react-icons/tb";
import { toast } from "react-toastify";
import { getUserFromCookie } from "../../../security/cookies/UserCookie";

export const DueDateTable = ({ customers, isLoading, activeTab }) => {
  const [activeCustomers, setActiveCustomers] = useState(
    activeTab === "Today"
      ? customers?.todaysDueDate
      : activeTab === "Tomorrow"
      ? customers?.tomorrowDueDate
      : customers?.notPaymentYet
  );

  useEffect(() => {
    setActiveCustomers(
      activeTab === "Today"
        ? customers?.todaysDueDate
        : activeTab === "Tomorrow"
        ? customers?.tomorrowDueDate
        : customers?.notPaymentYet
    );
  }, [activeTab, customers]);

  const formatToReadableDate = (dateString) => {
    const dateObj = new Date(dateString.replace(" ", "T"));

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const year = dateObj.getFullYear();

    return `${day} ${month} ${year}`;
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <HorizontalLoader />
      </div>
    );
  }

  if (activeCustomers?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-10 mt-10">
        <p className="flex justify-center items-center">
          <TbUsers size={120} />
        </p>
        <p className="text-lg font-medium mt-2">No Customers with Due Date</p>
        <p className="text-gray-600 mt-4">
          It looks like there are no customers with a due date scheduled.
        </p>
        <p className="text-gray-500 mt-2">
          Check back later or review upcoming due dates.
        </p>
      </div>
    );
  }

  const user = getUserFromCookie();

  const sendMessage = (amount, mobileNo) => {
    if (mobileNo?.length === 0) {
      toast.error("Customer Number is not present");
      return;
    } else if (mobileNo?.length < 10) {
      toast.error("Customer Number is not valid");
      return;
    }
    const messageTemplate = `Payment of Rs. ${-amount} pending with ${
      user?.name
    } (${user?.mobileNo})`;

    const phoneNumber = `91${mobileNo}`;

    window.open(
      `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${messageTemplate}`,
      "_blank"
    );
  };

  return (
    <table className="w-full">
      <thead className="sticky bg-white top-0">
        <tr className="uppercase text-sm text-gray-700 font-medium">
          <td className="px-10 py-6">Date</td>
          <td className="px-10 py-6">Customer Name</td>
          <td className="px-10 py-6">Mobile</td>
          <td className="px-10 py-6">Amount</td>
          <td className="px-10 py-6">Action</td>
        </tr>
      </thead>
      <tbody>
        {activeCustomers?.map((customer, index) => {
          return (
            <tr key={index}>
              <td className="px-10 py-6">
                {formatToReadableDate(customer?.dueDate) || "-"}
              </td>
              <td className="px-10 py-6">{customer?.name || "-"}</td>
              <td className="px-10 py-6">{customer?.mobileNo || "-"}</td>
              <td className="px-10 py-6 font-medium text-red-600">
                ₹{-customer?.amount}
              </td>
              <td className="px-10 py-6">
                <div
                  onClick={() =>
                    sendMessage(customer?.amount, customer?.mobileNo)
                  }
                  className="flex gap-2 border cursor-pointer text-blue-600 hover:border-blue-500 border-gray-300 w-30 justify-center items-center p-2 rounded-full"
                >
                  <p className="flex justify-start  items-center">
                    <IoAlarmOutline size={30} />
                  </p>
                  <p>Remind</p>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
