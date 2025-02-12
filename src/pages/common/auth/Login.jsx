import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import { loginImage } from "../../../assets/LoginImage";
import { useEffect, useState } from "react";
import { validateLoginFields } from "./Validator";
import { Notification } from "../../../components/ui/Notification";
import { loginUserService } from "../../../service/auth/AuthService";
import { AuthLoader } from "../../../components/ui/loaders/AuthLoader";
import { getUserFromCookie } from "../../../security/cookies/UserCookie";
import app from "../../../firbase";
import { sendFCMTokenService } from "../../../service/user/UserService";

export const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState(null);

  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = getUserFromCookie();
    if (user) {
      navigate("/user/customers");
    }
  }, []);

  const auth = getAuth(app);

  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("User logged in:", userCredential);
      return userCredential?._tokenResponse?.idToken;
    } catch (error) {
      console.error("Login error:", error.message);
      return null;
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateFields(name, value);
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateFields = (name, value) => {
    let newErrors = { ...errors };

    if (name === "email" && value === "") newErrors.email = "Email is Required";
    else if (name === "password" && !value)
      newErrors.password = "Password is Required";
    else delete newErrors[name];

    setErrors(newErrors);
  };

  const storeToken = (token) => {
    localStorage.setItem("token", token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateLoginFields(loginData);

    setErrors(errors);

    if (Object.keys(errors).length !== 0) {
      const errorMessages = Object.values(errors).join("\n");
      showNotification(errorMessages, "warning");
      return;
    }

    setErrors({});

    const res = await loginUserService(loginData);

    if (res?.statusCode === 200) {
      setIsLoading(true);
      storeToken(res?.token);
      showNotification(res?.message, "success");
      const token = await loginUser(loginData?.email, loginData?.password);

      setTimeout(() => {
        setLoginData({
          email: "",
          password: "",
        });
        setIsLoading(false);
        sendFCMTokenService(token);
        navigate("/user/customers");
      }, 2000);
    } else {
      showNotification(res?.message, "error");
    }
    // console.log("Login Data:", loginData);
  };

  return (
    <section>
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
      <div className="sm:min-h-[37.95rem]">
        <div
          className="w-full h-screen sm:h-[37.95rem] grid grid-cols-1 md:grid-cols-2"
          style={{
            backgroundImage: `url(${loginImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="text-white hidden md:flex flex-col gap-2 justify-center items-center">
            <p className="text-3xl font-semibold">Vyapar Book</p>
            <p className="text-xl text-gray-200">
              Sign in or create an account
            </p>
          </div>
          <div className="w-[100%] mx-auto h-[70%] my-20 sm:my-0 sm:h-full flex justify-end items-center">
            <form
              className="p-10 flex h-[90%] rounded-md bg-white flex-col gap-10 w-[90%] sm:w-[80%] md:w-[80%] xl:w-[60%] mx-auto"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-3 mt-3">
                <h1 className="text-3xl font-semibold font-urbanist">
                  Login Here
                </h1>
                <p className="text-gray-600">Please login to your account</p>
              </div>

              <div className="flex flex-col gap-5">
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  className="bg-gray-200 w-full h-[3.25rem] focus:outline-none placeholder:font-medium focus:ring-2 p-2 focus:ring-slate-700 rounded-sm"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  className="bg-gray-200 w-full h-[3.25rem] focus:outline-none placeholder:font-medium focus:ring-2 p-2 focus:ring-slate-700 rounded-sm"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <button
                  type="submit"
                  className="w-full cursor-pointer p-2 hover:bg-gray-800 transition-all rounded-md bg-gray-700 text-white disabled:bg-gray-400"
                >
                  Sign In
                </button>

                <div className="text-gray-700 flex gap-1 justify-center">
                  New User?{" "}
                  <NavLink
                    to="/register"
                    className="text-gray-950 hover:text-blue-500 font-medium"
                  >
                    Sign up
                  </NavLink>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
