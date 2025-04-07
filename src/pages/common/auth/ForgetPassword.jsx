import { useEffect, useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import {
  resetPasswordService,
  sendOtpToEmailService,
  VerifyOtpService,
} from "../../../service/auth/AuthService";
import { toast } from "react-toastify";
import { AuthLoader } from "../../../components/ui/loaders/AuthLoader";
import { ForgetLoader } from "../../../components/ui/loaders/ForgetLoader";
import { resetPassword } from "../../../api/auth/AuthApi";
import { useNavigate } from "react-router-dom";
import { getUserFromCookie } from "../../../security/cookies/UserCookie";

export const ForgotPassword = () => {
  const [forgetDataReq, setForgetDataReq] = useState({
    email: "",
    otp: "",
    password: "",
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [buttonText, setButtonText] = useState("Send OTP");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showResend, setShowResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendClicked, setResendClicked] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForgetDataReq({ ...forgetDataReq, [name]: value });
  };

  useEffect(() => {
    const user = getUserFromCookie();
    if (user) {
      navigate("/user/customers");
    }
  }, []);

  useEffect(() => {
    if (isEmailVerified && !isOtpVerified) {
      setCountdown(60);
      setShowResend(false);

      const timer = setTimeout(() => {
        setShowResend(true);
      }, 60000);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isEmailVerified, isOtpVerified, resendClicked]);

  const handleResendClick = async () => {
    if (forgetDataReq?.email === "") {
      toast.error("Fill the Details first !!");
      return;
    }
    setIsLoading(true);
    const res = await sendOtpToEmailService(forgetDataReq?.email);
    if (res.statusCode === 200) {
      setIsLoading(false);
      setShowResend(false);
      setCountdown(60);
      setResendClicked((prev) => !prev);
      toast.success(res?.message);
    } else {
      setIsLoading(false);
      toast.error(res?.message);
    }
  };

  const handleButtonClick = async () => {
    if (buttonText === "Send OTP" && !isEmailVerified && !isOtpVerified) {
      if (forgetDataReq?.email === "") {
        toast.error("Fill the Details first !!");
        return;
      }
      setIsLoading(true);
      const res = await sendOtpToEmailService(forgetDataReq?.email);
      if (res.statusCode === 200) {
        setIsLoading(false);
        setIsEmailVerified(true);
        setButtonText("Verify OTP");
        toast.success(res?.message);
      } else {
        setIsLoading(false);
        toast.error(res?.message);
      }
    }

    if (buttonText === "Verify OTP" && isEmailVerified && !isOtpVerified) {
      if (forgetDataReq?.email === "" || forgetDataReq?.otp === "") {
        toast.error("Fill the Details first !!");
        return;
      }
      setIsLoading(true);
      const res = await VerifyOtpService(
        forgetDataReq?.email,
        forgetDataReq?.otp
      );
      if (res.statusCode === 200) {
        setIsLoading(false);
        setIsOtpVerified(true);
        setShowResend(false);
        setButtonText("Reset Password");
        toast.success(res?.message);
      } else {
        setIsLoading(false);
        toast.error(res?.message);
      }
    }

    if (buttonText === "Reset Password" && isEmailVerified && isOtpVerified) {
      if (
        forgetDataReq?.email === "" ||
        forgetDataReq?.otp === "" ||
        forgetDataReq?.password === ""
      ) {
        toast.error("Fill the Details first !!");
        return;
      }
      setIsLoading(true);
      const res = await resetPasswordService(
        forgetDataReq?.email,
        forgetDataReq?.otp,
        forgetDataReq?.password
      );
      if (res.statusCode === 200) {
        setIsLoading(false);
        navigate("/login");
        toast.success(res?.message);
      } else {
        setIsLoading(false);
        toast.error(res?.message);
      }
    }
  };

  return (
    <section className="flex items-center justify-center bg-white">
      <div className="w-full max-w-sm p-6 my-20 rounded">
        <div className="flex justify-center items-center">
          <p className="flex p-4 bg-red-50 text-red-400 rounded-full justify-center items-center">
            <IoKeyOutline size={30} />
          </p>
        </div>
        <h2 className="text-3xl mt-3 font-bold text-center font-Urbanist mb-4">
          Forgot password?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          No worries, we&apos;ll send you reset instructions.
        </p>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled={isEmailVerified}
              name="email"
              value={forgetDataReq?.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="w-full px-3 bg-slate-100 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {isEmailVerified && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Otp
              </label>
              <input
                id="otp"
                type="text"
                name="otp"
                disabled={isOtpVerified}
                value={forgetDataReq?.otp}
                onChange={handleInputChange}
                placeholder="Enter Otp"
                required
                className="w-full px-3 bg-slate-100 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              {!isOtpVerified &&
                (!showResend ? (
                  <p className="text-sm text-end text-gray-500">
                    Resend OTP in {countdown}s
                  </p>
                ) : (
                  <p
                    onClick={handleResendClick}
                    className="text-sm text-end text-blue-600 cursor-pointer hover:text-blue-700"
                  >
                    Resend OTP
                  </p>
                ))}
            </div>
          )}

          {isOtpVerified && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="password"
                type="text"
                name="password"
                value={forgetDataReq?.password}
                onChange={handleInputChange}
                placeholder="Enter New Password"
                required
                className="w-full px-3 bg-slate-100 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}

          <button
            onClick={handleButtonClick}
            className="w-full bg-red-400 text-white py-2 rounded-md cursor-pointer hover:bg-red-500"
          >
            {buttonText}
          </button>
        </div>

        <div className="text-center mt-4">
          <a href="/login" className="text-sm text-gray-600 hover:text-red-500">
            &larr; Back to log in
          </a>
        </div>
      </div>
      {isLoading && (
        <div className="h-screen w-screen fixed flex justify-center items-center bg-black/30">
          <ForgetLoader />
        </div>
      )}
    </section>
  );
};
