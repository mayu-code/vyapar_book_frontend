import { useRouteError, NavLink } from "react-router-dom";

export const GlobalErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <img src="/error.jpg" alt="Not Found" width={400} />
      <p className="text-lg text-gray-600 mt-2">
        {error?.statusText || "An unexpected error occurred."}
      </p>
      <NavLink
        to="/"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Home
      </NavLink>
    </div>
  );
};
