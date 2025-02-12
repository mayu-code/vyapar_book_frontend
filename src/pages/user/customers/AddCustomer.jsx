import { RxCross1 } from "react-icons/rx";
import { motion } from "framer-motion";
import { AddCustomerForm } from "./AddCustomerForm";
import { useState } from "react";
import { addCustomerService } from "../../../service/user/UserService";

export const AddCustomer = ({
  setIsOpen,
  showNotification,
  refetchCustomers,
}) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

  const [customerData, setCustomerData] = useState({
    name: "",
    mobileNo: "",
    reference: "",
    amount: 0,
    date: formattedDate,
    status: "gave",
    gave: true,
    got: false,
    gstinNo: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    buildingNo: "",
    area: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    buildingNo: "",
    area: "",
    pincode: "",
    city: "",
    state: "",
  });

  const handleSubmit = async () => {
    const { status, ...payload } = customerData;

    const finalPayload = { ...payload, address: shippingAddress };

    // console.log(customerData);
    // console.log(shippingAddress);
    // console.log(finalPayload);

    const res = await addCustomerService(finalPayload);

    if (res?.statusCode === 200) {
      setIsOpen(false);
      showNotification(res?.message, "success");
      refetchCustomers();
    } else {
      setIsOpen(false);
      showNotification(res?.message, "error");
    }

    // console.log(billingAddress);
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
          <h2 className="text-lg font-medium">Add Customer</h2>
          <div
            onClick={() => setIsOpen(false)}
            className="flex cursor-pointer justify-center items-center"
          >
            <RxCross1 size={18} />
          </div>
        </div>

        <hr className="text-gray-300" />

        <div className="h-[35rem] py-2 px-4 overflow-y-auto">
          <AddCustomerForm
            isOpen={isAddressOpen}
            setIsOpen={setIsAddressOpen}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            customerData={customerData}
            setCustomerData={setCustomerData}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            billingAddress={billingAddress}
            setBillingAddress={setBillingAddress}
          />
        </div>

        <div className="w-[90%] py-2 mx-auto">
          <button
            disabled={
              customerData.name === "" ||
              customerData.mobileNo === "" ||
              customerData.reference === ""
            }
            onClick={handleSubmit}
            className={`p-2 ${
              customerData.name === "" ||
              customerData.mobileNo === "" ||
              customerData.reference === ""
                ? "bg-gray-300 cursor-no-drop"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }  w-full rounded-md text-white `}
          >
            Add Customer
          </button>
        </div>
      </motion.div>
    </section>
  );
};
