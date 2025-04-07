/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Star } from "../../../utilities/StarMark";

export const UpdateCustomerForm = ({
  isOpen,
  setIsOpen,
  isChecked,
  setIsChecked,
  customerData,
  setCustomerData,
  shippingAddress,
  setShippingAddress,
  // billingAddress,
  // setBillingAddress,
}) => {
  const handleCustomerDataChange = (e) => {
    const { name, value } = e.target;

    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prevData) => ({ ...prevData, [name]: value }));
  };
  // const handleBillingChange = (e) => {
  //   const { name, value } = e.target;
  //   setBillingAddress((prevData) => ({ ...prevData, [name]: value }));
  // };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="flex flex-col mt-2 gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-gray-800">
          Customer Name <Star />
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={customerData.name}
          onChange={handleCustomerDataChange}
          className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
          placeholder="Enter Customer Name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="mobileNo" className="text-gray-800">
          Phone Number <Star />
        </label>
        <div className="flex px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500">
          <div className="flex justify-center items-center">
            <p>+91</p>
          </div>
          <input
            type="tel"
            name="mobileNo"
            id="mobileNo"
            value={customerData.mobileNo}
            onChange={handleCustomerDataChange}
            pattern="[0-9]*"
            maxLength={10}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
            className="focus:outline-none w-full pl-2"
            placeholder="Enter Phone Number"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="mobileNo" className="text-gray-800">
          Reference <Star />
        </label>
        <div className="flex px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500">
          <input
            type="text"
            name="reference"
            id="reference"
            value={customerData.reference}
            onChange={handleCustomerDataChange}
            className="focus:outline-none w-full pl-2"
            placeholder="Enter Reference"
          />
        </div>
      </div>

      <div className="rounded-md mb-2">
        <button
          className="w-full flex cursor-pointer text-blue-600 justify-between items-center p-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium">Add GSTIN & Address (Optional)</span>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {isOpen && (
          <div className="p-3 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="gstinNo" className="text-gray-800">
                GSTIN
              </label>
              <input
                type="text"
                name="gstinNo"
                value={customerData.gstinNo}
                onChange={handleCustomerDataChange}
                id="gstinNo"
                className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                placeholder="Add GSTIN"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h5 className="">Address</h5>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="buildingNo" className="text-gray-800">
                    Flat / Building Number
                  </label>
                  <input
                    type="text"
                    name="buildingNo"
                    value={shippingAddress.buildingNo}
                    onChange={handleShippingChange}
                    id="buildingNo"
                    className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="area" className="text-gray-800">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={shippingAddress.area}
                    onChange={handleShippingChange}
                    id="area"
                    className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="area" className="text-gray-800">
                    Pincode
                  </label>
                  <input
                    type="tel"
                    name="pincode"
                    id="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleShippingChange}
                    pattern="[0-9]*"
                    maxLength={6}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                    className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="city" className="text-gray-800">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                      id="city"
                      className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="state" className="text-gray-800">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleShippingChange}
                      id="state"
                      className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="flex gap-2 items-center">
              <label className="flex gap-2 cursor-pointer">
                <div className="flex justify-center items-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <p className="select-none">
                  Shipping address same as billing address
                </p>
              </label>
            </div> */}

            {/* {!isChecked && (
              <div className="flex flex-col gap-3">
                <h5 className="">Billing Address</h5>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="buildingNo" className="text-gray-800">
                      Flat / Building Number
                    </label>
                    <input
                      type="text"
                      name="buildingNo"
                      value={billingAddress.buildingNo}
                      onChange={handleBillingChange}
                      id="buildingNo"
                      className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="area" className="text-gray-800">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={billingAddress.area}
                      onChange={handleBillingChange}
                      id="area"
                      className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="area" className="text-gray-800">
                      Pincode
                    </label>
                    <input
                      type="tel"
                      name="pincode"
                      id="pincode"
                      value={billingAddress.pincode}
                      onChange={handleBillingChange}
                      pattern="[0-9]*"
                      maxLength={6}
                      onInput={(e) =>
                        (e.target.value = e.target.value.replace(/\D/g, ""))
                      }
                      className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="city" className="text-gray-800">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={billingAddress.city}
                        onChange={handleBillingChange}
                        id="city"
                        className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="state" className="text-gray-800">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={billingAddress.state}
                        onChange={handleBillingChange}
                        id="state"
                        className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};
