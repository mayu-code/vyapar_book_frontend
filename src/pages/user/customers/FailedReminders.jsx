import { MdOutlineSmsFailed } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { FailedReminderTable } from "./FailedReminderTable";
import { useQuery } from "@tanstack/react-query";
import {
  downLoadRemaindersPdfService,
  getCustomerRemaindersService,
} from "../../../service/user/UserService";
import { FaRegFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";

export const FailedReminders = ({ customer, setShow }) => {
  const { data: reminders, isLoading } = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      return await getCustomerRemaindersService(customer?.id);
    },
  });

  const handleDownload = async () => {
    if (reminders?.length <= 0) {
      toast.error("No Reminders Available");
      return;
    }

    const response = await downLoadRemaindersPdfService(customer?.id);

    const url = window.URL.createObjectURL(
      new Blob([response?.data], { type: "application/pdf" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `customer_reminders_${customer?.id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="w-[99%] h-[95%] overflow-auto flex px-8 rounded-lg flex-col gap-4 bg-white">
        <div className="flex flex-col gap-4 sticky top-0 z-20 py-4 bg-white">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <p className="flex text-white justify-center rounded-full items-center px-2 py-2 bg-blue-500">
                <MdOutlineSmsFailed size={30} />
              </p>
              <h1 className="text-2xl flex justify-center items-center font-semibold text-gray-800">
                Reminders
              </h1>
            </div>
            <div className="flex gap-3">
              <div
                onClick={handleDownload}
                className="flex gap-2 border border-gray-400 p-2 rounded-md text-gray-600 cursor-pointer"
              >
                <p className="flex justify-center items-center">
                  <FaRegFilePdf />
                </p>
                <p className="flex justify-center items-center">Download PDF</p>
              </div>
              <p
                onClick={() => setShow(false)}
                className="flex justify-center cursor-pointer  border border-gray-400 px-3 rounded-md py-2 items-center "
              >
                <RxCross1 size={20} />
              </p>
            </div>
          </div>
          <hr className="text-gray-400" />
        </div>

        <div className="mt-2 flex flex-col gap-4 ">
          <p className="uppercase font-medium text-gray-600">
            Customer Name:-{" "}
            <span className="normal-case text-gray-800">{customer?.name}</span>
          </p>
          <p className="uppercase font-medium text-gray-600">
            Mobile Number:-{" "}
            <span className="normal-case text-gray-800">
              {customer?.mobileNo}
            </span>
          </p>
        </div>

        <div className="mt-3">
          <div
            className={`text-2xl flex flex-col bg-red-100
             px-4 py-8 w-52 rounded-md gap-2`}
          >
            <p
              className={` font-medium
                    
                  text-red-700
              } `}
            >
              ₹{customer?.amount.toLocaleString() || 0}
            </p>
            <p className={`text-[16px] ml-1 text-gray-800 font-medium`}>
              Net Balance
            </p>
          </div>
        </div>

        <div className="px-4">
          <p className="font-semibold">
            Total {reminders?.slice(0)?.length} entries
          </p>
        </div>

        <div>
          <FailedReminderTable
            reminders={reminders?.slice(0)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
};
