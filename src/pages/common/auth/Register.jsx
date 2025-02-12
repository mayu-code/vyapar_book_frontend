import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { registerImage } from "../../../assets/RegisterImage";
import { useEffect, useState } from "react";
import { validateRegistrationFields } from "./Validator";
import { Notification } from "../../../components/ui/Notification";
import { registerUserService } from "../../../service/auth/AuthService";
import { AuthLoader } from "../../../components/ui/loaders/AuthLoader";
import app from "../../../firbase";
import { getUserFromCookie } from "../../../security/cookies/UserCookie";

export const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const auth = getAuth(app);

  const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return console.log("User Registered:", userCredential);
    } catch (error) {
      return console.error("Registration Error:", error.message);
    }
  };

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const user = getUserFromCookie();
    if (user) {
      navigate("/user/customers");
    }
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateFields(name, value);
    setRegisterData({ ...registerData, [name]: value });
  };

  const checkInteger = (input) => {
    if (/^\d*$/.test(input)) return true;
    else return false;
  };

  const validateFields = (name, value) => {
    let newErrors = { ...errors };

    if (name === "name" && !value) newErrors.name = "Name is Required";
    else if (name === "mobileNo" && value === "")
      newErrors.mobileNo = "Mobile Number is Required";
    else if (name === "mobileNo" && !checkInteger(value))
      newErrors.mobileNo = "Invalid Mobile Number";
    else if (name === "mobileNo" && value.length !== 10)
      newErrors.mobileNo = "Invalid Mobile Number";
    else if (name === "email" && value === "")
      newErrors.email = "Email is Required";
    else if (name === "password" && !value)
      newErrors.password = "Password is Required";
    else if (name === "confirmPassword" && !value)
      newErrors.confirmPassword = "Confirm Password is Required";
    else if (name === "confirmPassword" && registerData.password !== value)
      newErrors.confirmPassword = "Password do not match";
    else delete newErrors[name];

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateRegistrationFields(registerData);

    setErrors(errors);

    if (Object.keys(errors).length !== 0) {
      const errorMessages = Object.values(errors).join("\n");
      showNotification(errorMessages, "warning");
      return;
    }

    setErrors({});

    const res = await registerUserService(registerData);

    console.log(res);

    if (res?.statusCode === 200) {
      showNotification(res?.message, "success");
      registerUser(registerData?.email, registerData?.password);
      setIsLoading(true);
      setTimeout(() => {
        setRegisterData({
          name: "",
          mobileNo: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsLoading(false);
        navigate("/login");
      }, 2000);
    } else {
      showNotification(res?.message, "error");
    }
  };

  return (
    <section className="select-none">
      {notification && (
        <Notification
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}
      {isLoading && (
        <div className="h-screen w-screen fixed flex justify-center items-center bg-black/50">
          <AuthLoader />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 sm:mt-0 w-[90%] mx-auto">
        <div className="w-full md:w-[80%] lg:w-[70%] mx-auto">
          <form className="p-10 flex flex-col gap-10" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-medium font-serif">Register Here</h1>

            <div className="flex flex-col gap-5">
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleInputChange}
                placeholder="Enter Name"
                className="bg-gray-200 w-full focus:outline-none placeholder:font-medium focus:ring-2 p-2 focus:ring-red-400 rounded-sm"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}

              <input
                type="text"
                name="mobileNo"
                value={registerData.mobileNo}
                onChange={handleInputChange}
                placeholder="Enter Mobile Number"
                className="bg-gray-200 w-full focus:outline-none placeholder:font-medium focus:ring-2 p-2 focus:ring-red-400 rounded-sm"
                required
              />
              {errors.mobileNo && (
                <p className="text-red-500 text-sm">{errors.mobileNo}</p>
              )}

              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleInputChange}
                placeholder="Enter Email Address"
                className="bg-gray-200 w-full focus:outline-none placeholder:font-medium focus:ring-2 p-2 focus:ring-red-400 rounded-sm"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                className="bg-gray-200 w-full focus:outline-none placeholder:font-medium focus:ring-2 p-2 focus:ring-red-400 rounded-sm"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}

              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="bg-gray-200 w-full focus:outline-none placeholder:font-medium focus:ring-2 p-2 focus:ring-red-400 rounded-sm"
                required
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <button
                type="submit"
                disabled={notification}
                className="w-full p-2 border-2 hover:border-red-600 cursor-pointer rounded-md bg-red-400 text-white"
              >
                Sign Up
              </button>

              <div className="text-gray-700">
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="text-gray-950 hover:text-blue-500 font-medium"
                >
                  Sign in
                </NavLink>
              </div>
            </div>
          </form>
        </div>

        <div
          className="bg-cover hidden md:inline"
          // style={{
          //   backgroundImage: `url(${registerImage})`,
          // }}
        >
          <img
            src={registerImage}
            alt="image"
            className="w-full h-full select-none"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
};
