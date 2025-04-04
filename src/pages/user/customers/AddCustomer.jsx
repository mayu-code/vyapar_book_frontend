import { RxCross1 } from "react-icons/rx";
import { motion } from "framer-motion";
import { AddCustomerForm } from "./AddCustomerForm";
import { useEffect, useState } from "react";
import { addCustomerService } from "../../../service/user/UserService";
import { toast } from "react-toastify";

export const AddCustomer = ({
  setIsOpen,
  refetchCustomers,
  refetchGetDashboardData,
}) => {
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
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

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  // const [billingAddress, setBillingAddress] = useState({
  //   buildingNo: "",
  //   area: "",
  //   pincode: "",
  //   city: "",
  //   state: "",
  // });

  const handleSubmit = async () => {
    // eslint-disable-next-line no-unused-vars
    const { status, ...payload } = customerData;

    const finalPayload = { ...payload, address: shippingAddress };

    if (customerData.name === "" || customerData.reference === "") {
      toast.warn("Please Enter All Details");
      return;
    }

    const formData = new FormData();

    formData.append(
      "request",
      new Blob([JSON.stringify(finalPayload)], { type: "application/json" })
    );
    formData.append("bill", file);

    // console.log(customerData);
    // console.log(shippingAddress);
    // console.log(finalPayload);

    const res = await addCustomerService(formData);

    if (res?.statusCode === 200) {
      setIsOpen(false);
      toast.success(res?.message);
      refetchGetDashboardData();
      refetchCustomers();
    } else {
      // setIsOpen(false);
      toast.error(res?.message);
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

        <div
          className=" py-2 px-4 overflow-y-auto"
          style={{ height: divHeight }}
        >
          <AddCustomerForm
            isOpen={isAddressOpen}
            setIsOpen={setIsAddressOpen}
            isChecked={isChecked}
            setIsChecked={setIsChecked}
            customerData={customerData}
            setCustomerData={setCustomerData}
            shippingAddress={shippingAddress}
            file={file}
            setDragging={setDragging}
            setFile={setFile}
            dragging={dragging}
            setShippingAddress={setShippingAddress}
            // billingAddress={billingAddress}
            // setBillingAddress={setBillingAddress}
          />
        </div>

        <div className="w-[90%] flex justify-center items-center py-2 mx-auto">
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
