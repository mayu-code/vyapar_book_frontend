import { motion } from "framer-motion";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { LuBadgeIndianRupee, LuMoveUpRight } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { FaBarsStaggered } from "react-icons/fa6";
import { CgArrowBottomLeft, CgDanger } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import { EditEntry } from "./EditEntry";
import { deleteTransactionService } from "../../../service/user/UserService";

export const EntryDetails = ({
  customer,
  selectedTransition,
  setIsDetailOpen,
  showNotification,
  refetchCustomers,
  refetchCustomer,
  refetchTransactions,
}) => {
  const [showModal, setShowModal] = useState(false);

  const content = [
    {
      id: 1,
      icon:
        selectedTransition?.amount >= 0 ? (
          <CgArrowBottomLeft size={20} />
        ) : (
          <LuMoveUpRight size={20} />
        ),
      title: `${selectedTransition?.amount >= 0 ? "You Got" : "You Gave"}`,
      description: selectedTransition?.amount,
    },
    {
      id: 2,
      icon: <FaBarsStaggered size={20} />,
      title: "Description",
      description: "-",
    },
    {
      id: 3,
      icon: <LuBadgeIndianRupee size={20} />,
      title: "Running Balance",
      description: selectedTransition?.balanceAmount,
    },
  ];

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

    return `${day} ${month} ${year}`;
  };

  const [isUpdateEntryOpen, setIsUpdateEntryOpen] = useState(false);
  //   console.log(selectedTransition);

  const handleEditEntryClick = () => {
    setIsUpdateEntryOpen(true);
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
        <div className="flex justify-between p-5">
          <h2 className={`text-lg font-medium`}>Entry Details</h2>
          <div
            onClick={() => setIsDetailOpen(false)}
            className="flex cursor-pointer justify-center items-center"
          >
            <RxCross1 size={18} />
          </div>
        </div>

        <hr className="text-gray-300" />

        <div className="h-[35rem] py-2 px-4 flex flex-col gap-5 overflow-y-auto">
          <div className="flex gap-4 mt-2">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-200">
              <span className="text-blue-600 text-xl font-medium">
                {customer?.name[0]}
              </span>
            </div>

            <div>
              <p>{customer?.name}</p>
              <p className="text-gray-700 text-sm">
                {formatToReadableDate(selectedTransition?.date)}
              </p>
            </div>
          </div>

          <div
            onClick={handleEditEntryClick}
            className="flex gap-3 justify-center cursor-pointer p-2 border rounded-md text-gray-500 border-gray-300"
          >
            <p className="flex justify-center items-center">
              <HiMiniPencilSquare size={20} />
            </p>
            <p>Edit Entry</p>
          </div>

          <div className="p-2 flex flex-col gap-10">
            {content?.map((item, index) => {
              return (
                <div key={index} className="flex flex-col">
                  <div className="flex gap-3 text-gray-600">
                    <p
                      className={`flex justify-center items-center ${
                        item.id === 1
                          ? item.description >= 0
                            ? "text-green-600"
                            : "text-red-600"
                          : ""
                      }`}
                    >
                      {item.icon}
                    </p>
                    <p className="">{item.title}</p>
                  </div>
                  <div
                    className={`ml-8 ${
                      item.id === 2
                        ? ""
                        : item.description === 0
                        ? "text-gray-700 font-medium"
                        : item.description > 0
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }`}
                  >
                    {item.id === 2
                      ? item.description
                      : item.description >= 0
                      ? `₹${item.description}`
                      : `₹${-item.description}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[90%] py-2 mx-auto">
          <button
            onClick={() => setShowModal(true)}
            className={`p-2 w-full cursor-pointer rounded-md border flex gap-2 font-medium justify-center items-center text-red-600 bg-white`}
          >
            <p className="flex justify-center items-center">
              <MdDeleteOutline size={20} />
            </p>
            <p>Delete</p>
          </button>
        </div>
      </motion.div>
      {isUpdateEntryOpen && (
        <EditEntry
          status={selectedTransition?.amount >= 0 ? true : false}
          setIsDetailOpen={setIsDetailOpen}
          showNotification={showNotification}
          refetchCustomer={refetchCustomer}
          setIsOpen={setIsUpdateEntryOpen}
          isOpen={isUpdateEntryOpen}
          transition={selectedTransition}
          refetchCustomers={refetchCustomers}
          refetchTransactions={refetchTransactions}
        />
      )}

      {showModal && (
        <DeletePopup
          setShowModal={setShowModal}
          showModal={showModal}
          transitionId={selectedTransition?.id}
          setIsDetailOpen={setIsDetailOpen}
          showNotification={showNotification}
          refetchCustomers={refetchCustomers}
          refetchCustomer={refetchCustomer}
          refetchTransactions={refetchTransactions}
        />
      )}
    </section>
  );
};

const DeletePopup = ({
  setShowModal,
  showModal,
  transitionId,
  setIsDetailOpen,
  showNotification,
  refetchCustomers,
  refetchCustomer,
  refetchTransactions,
}) => {
  const handleDeleteClick = async () => {
    const res = await deleteTransactionService(transitionId);

    if (res?.statusCode === 200) {
      showNotification(res?.message, "success");
    } else {
      showNotification(res?.message, "error");
    }

    setShowModal(false);
    setIsDetailOpen(false);
    refetchCustomers();
    refetchCustomer();
    refetchTransactions();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10">
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-100 transform transition-all duration-300 ${
          showModal ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="flex gap-4">
          <div className="bg-red-100 p-2 rounded-full text-red-500">
            <CgDanger size={30} />
          </div>
          <h2 className="text-lg flex justify-center items-center font-semibold">
            Delete Entry
          </h2>
        </div>
        <p className="ml-5 px-8 text-gray-600">
          Are you sure you want to delete this entry? This action cannot be
          undone.
        </p>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 cursor-pointer bg-white border rounded-lg border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
