/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

export const UserNotification = ({
  notification,
  onClose,
  duration = 2000,
}) => {
  const { message, type } = notification;
  const [isVisible, setIsVisible] = useState(true);

  const icons = {
    success: <FaCheckCircle className="text-green-500" />,
    error: <FaTimesCircle className="text-red-500" />,
    warning: <FaExclamationTriangle className="text-yellow-500" />,
    info: <FaInfoCircle className="text-blue-500" />,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Delay removal for smooth animation
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed top-12 right-10 transform w-xs flex justify-between gap-3 bg-white shadow-lg rounded-lg p-4 border-l-4 transition-all duration-300 ease-in-out
    ${type === "success" ? "border-green-500" : ""}
    ${type === "error" ? "border-red-500" : ""}
    ${type === "warning" ? "border-yellow-500" : ""}
    ${type === "info" ? "border-blue-500" : ""}
    ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
  `}
    >
      <div className="flex gap-4">
        <span className="flex justify-center items-center">{icons[type]}</span>

        <span className="text-gray-800 font-medium">{message}</span>
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-gray-500 cursor-pointer hover:text-gray-800"
      >
        <FaTimes />
      </button>
    </div>
  );
};
