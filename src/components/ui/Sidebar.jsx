import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoBookOutline, IoLogOutOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import {
  clearUserCookie,
  getUserFromCookie,
} from "../../security/cookies/UserCookie";
import { CgDanger } from "react-icons/cg";
import { AuthLoader } from "./loaders/AuthLoader";
import { TbCalendarDue } from "react-icons/tb";
import { logoutUserService } from "../../service/auth/AuthService";
import { toast } from "react-toastify";

export const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const user = getUserFromCookie();

  const menuItems = [
    {
      title: "Customers",
      icon: FaUsers,
      link: "/user/customers",
    },
    {
      title: "Due Dates",
      icon: TbCalendarDue,
      link: "/user/deu-dates",
    },
    {
      title: "Reports",
      icon: HiOutlineClipboardDocumentList,
      link: "/user/reports",
    },
  ];

  const handleActiveLink = ({ isActive }) => {
    return isActive ? "bg-[#205a51] text-white" : "text-[#39aa99]";
  };

  const handleLogoutClick = async () => {
    setShowModal(false);
    setIsLoading(true);
    const res = await logoutUserService();

    if (res?.statusCode === 200) {
      setIsLoading(false);
      navigate("/login");
      setTimeout(() => {
        toast.success(res?.message);
        localStorage.removeItem("token");
        clearUserCookie();
      }, 500);
    }
  };

  return (
    <div className="px-4 flex flex-col bg-[#004D40] gap-4 h-full">
      {/* <h2 className="hidden xl:inline text-center mt-4 text-white text-2xl font-semibold">
        VyaparBook
      </h2> */}

      <div className="xl:hidden mt-4 flex justify-center text-white items-center">
        <IoBookOutline size={30} />
      </div>

      <div>
        <div className="xl:p-4 xl:mt-5 xl:bg-[#205a51] rounded-xl select-none cursor-pointer flex gap-4 2xl:gap-6">
          <div className="flex justify-center items-center">
            <span className="py-2 px-4 rounded-md text-white bg-pink-500">
              A
            </span>
          </div>

          <div className="hidden xl:flex flex-col ">
            <p className="text-white xl:text-sm 2xl:text-lg">{user?.name}</p>
            <p className="text-white xl:text-sm 2xl:text-lg">
              {user?.mobileNo}
            </p>
          </div>
        </div>
      </div>

      <div className="">
        <h2 className="hidden xl:inline uppercase ml-5 font-bold text-sm  text-[#439b8c]">
          Management
        </h2>

        <div className="mt-2 xl:mt-5 text-lg flex flex-col gap-2">
          {menuItems?.map((item, index) => (
            <div key={index}>
              <NavLink
                to={item.link}
                title={item.title}
                className={({ isActive }) =>
                  `flex gap-5 cursor-pointer font-medium p-2 2xl:px-4 xl:py-2 rounded-md ${handleActiveLink(
                    {
                      isActive,
                    }
                  )}`
                }
              >
                <div className="flex justify-center items-center">
                  <item.icon size={20} />
                </div>
                <p className="hidden xl:inline">{item.title}</p>
              </NavLink>
            </div>
          ))}

          <div
            onClick={() => setShowModal(true)}
            title="Logout"
            className="flex gap-5 font-medium mt-0.5 hover:bg-[#205a51] cursor-pointer hover:text-red-300 text-[#39aa99] p-2 2xl:px-4 2xl:py-3 rounded-md"
          >
            <div className="flex justify-center items-center">
              <IoLogOutOutline size={20} />
            </div>
            <p className="hidden xl:inline">Log Out</p>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-90">
            <div className="flex gap-4">
              <div className="bg-red-100 p-2 rounded-full text-red-500">
                <CgDanger size={30} />
              </div>
              <h2 className="text-lg flex justify-center items-center font-semibold">
                Confirm Logout
              </h2>
            </div>
            <p className=" ml-5 px-10 text-gray-600">
              Are you sure you want to log out?
            </p>

            <div className="mt-5 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 cursor-pointer bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="h-screen w-screen fixed flex justify-center items-center ">
          <AuthLoader />
        </div>
      )}
    </div>
  );
};
