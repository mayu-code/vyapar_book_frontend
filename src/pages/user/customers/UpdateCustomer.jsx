import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UpdateCustomerForm } from "./UpdateCustomerForm";
import { FaAngleLeft } from "react-icons/fa6";
import { updateCustomerService } from "../../../service/user/UserService";
import { toast } from "react-toastify";

export const UpdateCustomer = ({
  setIsOpen,
  customer,
  refetchCustomers,
  refetchCustomer,
  refetchTransactions,
  setIsDetailOpen,
}) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
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

  const [customerData, setCustomerData] = useState({
    id: customer?.id,
    name: customer?.name,
    mobileNo: customer?.mobileNo,
    reference: customer?.reference,
    gstinNo: customer?.gstinNo,
  });

  //   console.log(customer);

  const [shippingAddress, setShippingAddress] = useState({
    buildingNo: customer?.address?.buildingNo,
    area: customer?.address?.area,
    pincode: customer?.address?.pincode,
    city: customer?.address?.city,
    state: customer?.address?.state,
  });

  // const [billingAddress, setBillingAddress] = useState({
  //   buildingNo: "",
  //   area: "",
  //   pincode: "",
  //   city: "",
  //   state: "",
  // });

  const handleSubmit = async () => {
    const finalPayload = { ...customerData, address: shippingAddress };

    // console.log(customerData);
    // console.log(shippingAddress);
    console.log(finalPayload);

    const res = await updateCustomerService(finalPayload);

    if (res?.statusCode === 200) {
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }

    setIsOpen(false);
    setIsDetailOpen(false);
    refetchCustomers();
    refetchCustomer();
    refetchTransactions();

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
        <div className="flex gap-1 p-5">
          <div
            onClick={() => setIsOpen(false)}
            className="flex cursor-pointer justify-center items-center"
          >
            <FaAngleLeft size={18} />
          </div>
          <h2 className="text-lg font-medium">Edit Customer</h2>
        </div>

        <hr className="text-gray-300" />

        <div
          className="py-2 px-4 overflow-y-auto"
          style={{ height: divHeight }}
        >
          <UpdateCustomerForm
            isOpen={isAddressOpen}
            setIsOpen={setIsAddressOpen}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            customerData={customerData}
            setCustomerData={setCustomerData}
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            // billingAddress={billingAddress}
            // setBillingAddress={setBillingAddress}
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
            Update Customer
          </button>
        </div>
      </motion.div>
    </section>
  );
};
