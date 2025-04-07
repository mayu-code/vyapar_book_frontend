import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { CiCalendarDate } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { addTransactionService } from "../../../service/user/UserService";
import { toast } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import { Star } from "../../../utilities/StarMark";

export const AddEntry = ({
  refetchGetDashboardData,
  refetchCustomers,
  setIsOpen,
  status,
  customerId,
  refetchCustomer,
  refetchTransactions,
}) => {
  const [date, setDate] = useState(new Date());
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
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

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const selectedFile = event.dataTransfer.files[0];

    if (selectedFile) {
      if (!["image/png", "image/jpeg"].includes(selectedFile.type)) {
        toast.warn("Only PNG and JPG files are allowed.");
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.warn("File size exceeds 5MB. Please select a smaller file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (!["image/png", "image/jpeg"].includes(selectedFile.type)) {
        toast.warn("Only PNG and JPG files are allowed.");
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.warn("File size exceeds 5MB. Please select a smaller file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const formatDateTime = (dateObj) => {
    const now = dateObj || new Date();
    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      " " +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0") +
      ":" +
      String(now.getSeconds()).padStart(2, "0")
    );
  };
  const [entryData, setEntryData] = useState({
    customerId: customerId,
    amount: 0.0,
    date: formatDateTime(new Date()),
    detail: "",
    gave: !status,
    got: status,
  });

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setEntryData((prev) => ({
      ...prev,
      date: formatDateTime(selectedDate),
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...entryData,
      date: formatDateTime(date),
    };

    // console.log(payload);

    if (entryData.amount === 0 || entryData.amount === "0") {
      toast.warn("Amount should be larger than 0");
      return;
    }

    const formData = new FormData();

    formData.append(
      "transaction",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    formData.append("bill", file);

    const res = await addTransactionService(formData);

    // alert(res?.message);

    if (res?.statusCode === 200) {
      toast.success(res?.message);

      setIsOpen(false);
    } else {
      toast.error(res?.message);
      setIsOpen(false);
    }
    refetchCustomers();
    refetchCustomer();
    refetchTransactions();
    refetchGetDashboardData();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntryData((prev) => ({ ...prev, [name]: value }));
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
          <h2
            className={`text-lg font-medium ${
              status ? "text-green-600" : "text-red-600"
            }`}
          >
            Add Entry
          </h2>
          <div
            onClick={() => setIsOpen(false)}
            className="flex cursor-pointer justify-center items-center"
          >
            <RxCross1 size={18} />
          </div>
        </div>

        <hr className="text-gray-300" />

        <div
          className=" py-2 px-4 flex flex-col gap-5 overflow-y-auto"
          style={{ height: divHeight }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-gray-800">
              Amount <Star />
            </label>
            <div className="flex px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500">
              <div className="flex justify-center items-center">
                <p>₹</p>
              </div>
              <input
                type="text"
                name="amount"
                id="amount"
                pattern="^\d+(\.\d{0,2})?$"
                value={entryData.amount}
                onChange={handleInputChange}
                maxLength={8}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*?)\..*/g, "$1")
                    .replace(/^0+(\d)/, "$1")
                    .replace(/^(\d+)\.(\d{2})\d*$/, "$1.$2");
                }}
                className="focus:outline-none w-full pl-2"
                placeholder="Enter Amount"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="detail" className="text-gray-800">
              Description
            </label>
            <textarea
              name="detail"
              id="detail"
              value={entryData.detail}
              onChange={handleInputChange}
              rows={5}
              className="focus:outline-none px-4 py-2 border rounded-md border-gray-300 focus:border-blue-500"
              placeholder="Enter Details (Item Name, Bill No, Quantity, etc)"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="date" className="text-gray-700">
              Date <Star />
            </label>
            <div className="relative flex w-full items-center">
              <CiCalendarDate
                size={24}
                className="absolute left-3 text-gray-800"
              />
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                onKeyDown={(e) => e.preventDefault()}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={50}
                placeholderText="Select Date"
                className="w-full pl-10 pr-3 py-2 cursor-pointer rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="text-gray-800">
            <p>Attach Bill (Optional)</p>
          </div>
          {file ? (
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg flex flex-col items-center  relative">
              <div className="w-full flex justify-between items-center">
                <p className="text-gray-700 font-medium">{file.name}</p>
                <button
                  onClick={() => setFile(null)}
                  title="Delete"
                  className="text-red-600 cursor-pointer hover:text-red-800"
                >
                  <MdDeleteOutline size={24} />
                </button>
              </div>
              <div className="mt-2 w-full">
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Uploaded Preview"
                    className="w-full h-auto object-cover rounded-lg "
                  />
                )}
              </div>
            </div>
          ) : (
            <div
              className={`w-full h-44 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all ${
                dragging ? "border-blue-500 bg-blue-100" : "border-gray-400"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <p className="text-gray-600">Drag & Drop a PNG or JPG file</p>
              <p className="text-blue-500 font-semibold">Click to Upload</p>
              <input
                type="file"
                id="fileInput"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        <div className="w-[90%] py-2 mx-auto">
          <button
            disabled={entryData.amount === 0 || date === ""}
            onClick={handleSubmit}
            className={`p-2 w-full rounded-md text-white ${
              status
                ? entryData.amount === 0
                  ? "bg-gray-300 cursor-no-drop text-white"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
                : entryData.amount === 0
                ? "bg-gray-300 cursor-no-drop text-white"
                : "bg-red-600 hover:bg-red-700 cursor-pointer"
            }`}
          >
            Save
          </button>
        </div>
      </motion.div>
    </section>
  );
};
