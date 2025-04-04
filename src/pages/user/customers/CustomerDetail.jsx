import { TbPhoneCall } from "react-icons/tb";
import { motion } from "framer-motion";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDeleteOutline } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { CiShop } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { UpdateCustomer } from "./UpdateCustomer";
import { LuUserRound } from "react-icons/lu";
import { deleteCustomerService } from "../../../service/user/UserService";
import { CgDanger } from "react-icons/cg";
import { toast } from "react-toastify";

export const CustomerDetail = ({
  setIsDetailOpen,
  setSelectedCustomerId,
  customer,
  refetchCustomers,
  refetchCustomer,
  refetchTransactions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [divHeight, setDivHeight] = useState("30vh");

  useEffect(() => {
    const updateHeight = () => {
      const zoomLevel = window.devicePixelRatio;
      setDivHeight(`${Math.min(80, Math.max(20, 120 / zoomLevel))}vh`);
    };

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const formattedAddress = Object.entries(customer?.address)
    .filter(([key, value]) => key !== "id" && value)
    // eslint-disable-next-line no-unused-vars
    .map(([_, value]) => value)
    .join(", ");

  const contents = [
    {
      icon: <TbPhoneCall size={20} />,
      name: "Phone Number",
      value: customer?.mobileNo,
    },
    {
      icon: <LuUserRound size={20} />,
      name: "Reference",
      value: customer?.reference,
    },
    {
      icon: <CiShop size={20} />,
      name: "GST Number",
      value: customer?.gstinNo,
    },
    {
      icon: <IoLocationOutline size={20} />,
      name: "Address",
      value: formattedAddress,
    },
    // {
    //   icon: <IoLocationOutline size={20} />,
    //   name: "Billing Address",
    //   value: "",
    // },
  ];

  //   console.log(customer);

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
          <h2 className={`text-lg font-medium`}>Customer Details</h2>
          <div
            onClick={() => setIsDetailOpen(false)}
            className="flex cursor-pointer justify-center items-center"
          >
            <RxCross1 size={18} />
          </div>
        </div>

        <hr className="text-gray-300" />

        <div
          className="py-2 px-4 flex flex-col gap-5 overflow-y-auto"
          style={{ height: divHeight }}
        >
          <div className="flex gap-4 mt-2">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-200">
              <span className="text-blue-600 text-xl font-medium">
                {customer?.name[0]}
              </span>
            </div>

            <div>
              <p>{customer?.name}</p>
              <p className="text-gray-700 text-sm">Customer</p>
            </div>
          </div>

          <div
            onClick={() => setIsOpen(true)}
            className="flex gap-3 justify-center cursor-pointer p-2 border rounded-md text-gray-500 border-gray-300"
          >
            <p className="flex justify-center items-center">
              <HiMiniPencilSquare size={20} />
            </p>
            <p>Edit Profile</p>
          </div>

          <div className="p-2 flex flex-col gap-5">
            {contents?.map((item, index) => {
              return (
                <div key={index} className="flex flex-col text-gray-700">
                  <div className="flex gap-5">
                    <p className="flex justify-center items-center">
                      {item.icon}
                    </p>
                    <p className="text-lg">{item.name}</p>
                  </div>
                  <p className="ml-10 font-medium">{item.value || "-"}</p>
                  <hr className="mt-4 text-gray-400" />
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
            <p>Delete Customer</p>
          </button>
        </div>
      </motion.div>
      {isOpen && (
        <UpdateCustomer
          customer={customer}
          setIsOpen={setIsOpen}
          setIsDetailOpen={setIsDetailOpen}
          refetchCustomers={refetchCustomers}
          refetchTransactions={refetchTransactions}
          refetchCustomer={refetchCustomer}
        />
      )}

      {showModal && (
        <DeletePopup
          setShowModal={setShowModal}
          showModal={showModal}
          setSelectedCustomerId={setSelectedCustomerId}
          customerId={customer?.id}
          setIsDetailOpen={setIsDetailOpen}
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
  setSelectedCustomerId,
  customerId,
  setIsDetailOpen,
  refetchCustomers,
  refetchCustomer,
  refetchTransactions,
}) => {
  const handleDeleteClick = async () => {
    const res = await deleteCustomerService(customerId);

    if (res?.statusCode === 200) {
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }

    setShowModal(false);
    setIsDetailOpen(false);
    setSelectedCustomerId(null);
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
            Delete customer
          </h2>
        </div>
        <p className="ml-5 px-8 text-gray-600">
          Are you sure you want to delete this customer? This action cannot be
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
