// import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { companyLogo } from "../../assets/Logo";
// import { decryptData } from "../../security/SecurityCrypto";
// import AvatarMenu from "../ui/Avatar";
// import { companyLogo } from "../ui/img/CompanyLogo";

export const Header = () => {
  // const [user, setUser] = useState(null);

  const jwt = localStorage.getItem("jwt");

  // const data = useSelector((state) => state.userReducer.user);

  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   if (data) {
  //     setUser(decryptData(data));
  //   }
  // }, [data]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const test = false;

  return (
    <div className="bg-gray-200 sticky top-0 z-50 w-full">
      <div className="w-[100%] mx-auto">
        <div className="flex py-2 h-[5.5rem] justify-between">
          {/* <NavLink to="/">
            <div className="flex justify-center items-end gap-2">
              <figure className="relative left-20">
                <img src={companyLogo} alt="logo" className="w-10" />
              </figure>
              <div className="relative top-6">
                <h1 className="text-xl font-medium text-red-500">
                  Vyapar Book
                </h1>
              </div>
            </div>
          </NavLink> */}
          <div></div>
          <div className="hidden md:flex justify-center mr-5  items-center">
            <ul className="flex space-x-5">
              {!test && (
                <>
                  <NavLink to="/register">
                    <li className="group relative inline-block px-6 py-2 rounded-full text-white hover:text-red-500 bg-red-500  border-2 border-red-500 font-bold overflow-hidden">
                      <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out"></span>
                      <span className="relative z-10">Sign Up</span>
                    </li>
                  </NavLink>
                  <NavLink to="/login">
                    <li className="group relative inline-block px-6  py-2 rounded-full text-red-500 hover:text-white bg-white  border-2 border-red-500 font-bold overflow-hidden">
                      <span className="absolute inset-0 bg-red-500 opacity-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out"></span>
                      <span className="relative z-10">Login</span>
                    </li>
                  </NavLink>
                </>
              )}
              {/* {data && <AvatarMenu user={user} jwt={jwt} />} */}
            </ul>
          </div>
          <div
            className="flex cursor-pointer md:hidden justify-center m-2 items-center"
            onClick={handleToggle}
          >
            <GiHamburgerMenu className="text-2xl" />
          </div>
          {/* {jwt && (
            <div className="md:hidden flex justify-center items-center">
              <AvatarMenu user={user} jwt={jwt} />
            </div>
          )} */}
        </div>
        {isOpen && (
          <div className="relative md:hidden transition-all duration-400 ease-in-out">
            <div className="flex flex-col justify-center gap-2 py-2 items-center">
              <NavLink
                to="/register"
                className="cursor-pointer w-full flex justify-center py-2 items-center hover:bg-gray-200 transition-colors duration-200 ease-in-out"
              >
                <p>
                  <span className="font-medium text-lg text-orange-500">
                    Sign Up
                  </span>
                </p>
              </NavLink>
              <NavLink
                to="/login"
                className="cursor-pointer w-full flex justify-center py-2 items-center hover:bg-gray-200 transition-colors duration-200 ease-in-out"
              >
                <p>
                  <span className="font-medium text-lg text-blue-500">
                    Login
                  </span>
                </p>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
