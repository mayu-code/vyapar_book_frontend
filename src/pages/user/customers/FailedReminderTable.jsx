import { AiOutlineTransaction } from "react-icons/ai";
import { HorizontalLoader } from "../../../components/ui/loaders/HorizontalLoader";

export const FailedReminderTable = ({ reminders, isLoading }) => {
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

  if (reminders?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-10">
        <p className="flex justify-center items-center">
          <AiOutlineTransaction size={100} />
        </p>
        <p className="text-lg font-medium mt-2">No reminders available</p>

        {/* <p className="text-gray-600">Please change the date range or </p>
        <p className="text-gray-600">select another report-type from </p>
        <p className="text-gray-600">the left side panel</p> */}
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="sticky bg-white top-0">
        <tr className="uppercase text-sm text-gray-700 font-medium">
          <td className="px-10 py-6">Date</td>
          <td className="px-10 py-6">detail</td>
          <td className="px-10 py-6">Amount</td>
          <td className="px-10 py-6">Status</td>
        </tr>
      </thead>
      <tbody>
        {reminders?.map((entry, index) => {
          return (
            <tr key={index}>
              <td className="px-10 py-6">
                {formatToReadableDate(entry?.dueDate)}
              </td>
              <td className="px-10 py-6">{entry?.reason || "-"}</td>
              <td
                className={`px-10 py-6 ${
                  entry?.amount >= 0
                    ? entry?.amount === 0
                      ? "text-gray-800"
                      : "text-green-500"
                    : "text-red-500"
                } font-medium`}
              >
                {entry?.amount < 0
                  ? `₹${-entry?.amount}`
                  : entry?.amount > 0
                  ? `₹${entry?.amount}`
                  : "-"}
              </td>
              <td
                className={`px-10 py-6 font-medium ${
                  entry?.status === "Failed"
                    ? "text-red-500"
                    : entry?.status === "Paid"
                    ? "text-green-500"
                    : "text-gray-800"
                } `}
              >
                {entry?.status || "-"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
