import { RouterProvider } from "react-router-dom";
import { router } from "./router/Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const App = () => {
  const client = new QueryClient();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.title = window.location.href;
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileDevices = [
      "android",
      "iphone",
      "ipad",
      "ipod",
      "windows phone",
    ];

    const isMobileDevice = mobileDevices.some((device) =>
      userAgent.includes(device)
    );
    setIsMobile(isMobileDevice);
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="bg-white p-6 w-[95%] rounded-lg shadow-lg max-w-md text-gray-800">
          <div className="flex items-center space-x-3">
            <span className="text-blue-500 text-2xl">ℹ️</span>
            <h2 className="text-xl font-semibold">Browser not supported</h2>
          </div>
          <p className="mt-2 text-gray-600">
            Our desktop site is not supported on mobile browsers. Please use
            Google Chrome, Brave, Mozilla Firefox, or Microsoft Edge on a
            desktop, laptop, or PC.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
};
