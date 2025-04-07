import { NavLink } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <img src="/not_found.jpg" alt="Not Found" width={400} />
      <p className="text-lg text-gray-600 mt-2">
        Oops! The page you are looking for does not exist.
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
