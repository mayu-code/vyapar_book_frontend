import { AiOutlineTransaction } from "react-icons/ai";
import { HorizontalLoader } from "../../../components/ui/loaders/HorizontalLoader";

export const TransactionsTable = ({ transactions, isLoading }) => {
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

  if (transactions?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-10">
        <p className="flex justify-center items-center">
          <AiOutlineTransaction size={100} />
        </p>
        <p className="text-lg font-medium mt-2">No reports available</p>

        <p className="text-gray-600">Please change the date range or </p>
        <p className="text-gray-600">select another report-type from </p>
        <p className="text-gray-600">the left side panel</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="sticky bg-white top-0">
        <tr className="uppercase text-sm text-gray-700 font-medium">
          <td className="px-10 py-6">Date</td>
          <td className="px-10 py-6">Customer Name</td>
          <td className="px-10 py-6">Details</td>
          <td className="px-10 py-6">You Gave</td>
          <td className="px-10 py-6">You Got</td>
        </tr>
      </thead>
      <tbody>
        {transactions?.map((entry, index) => {
          return (
            <tr key={index}>
              <td className="px-10 py-6">
                {formatToReadableDate(entry?.date)}
              </td>
              <td className="px-10 py-6">{entry?.customerName}</td>
              <td className="px-10 py-6">{entry?.detail || "-"}</td>
              <td className="px-10 py-6">
                {entry?.amount < 0 ? `₹${-entry?.amount}` : "₹0"}
              </td>
              <td className="px-10 py-6">
                {entry?.amount >= 0 ? `₹${entry?.amount}` : "₹0"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
