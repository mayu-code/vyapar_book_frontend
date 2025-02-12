import { GrTransaction } from "react-icons/gr";
import { HiOutlineDocumentCurrencyRupee } from "react-icons/hi2";
import { NavLink } from "react-router-dom";

export const Report = () => {
  const navs = [
    {
      label: "Transaction Report",
      to: "/user/reports/transactions",
      icon: GrTransaction,
      desc: "All Customers, All Transactions",
    },
    {
      label: "Cashbook Report",
      to: "/user/reports/cashbook",
      icon: HiOutlineDocumentCurrencyRupee,
      desc: "Cashbook Related Transactions",
    },
  ];

  return (
    <section>
      <div className="p-4">
        <h1 className="text-lg text-gray-700">Reports</h1>
      </div>
      <hr className="text-gray-300" />

      <div className="px-4 py-2 flex flex-col gap-5">
        <h2 className="uppercase text-sm text-gray-700">Customers Reports</h2>

        <div className="flex flex-col">
          {navs.map((nav, index) => (
            <NavLink
              key={index}
              to={nav.to}
              className={`relative flex gap-4 py-4 px-2 rounded-md transition`}
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition ${
                      isActive ? "bg-blue-700" : "bg-gray-200"
                    }`}
                  >
                    <nav.icon
                      className={`text-2xl ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                  </div>

                  <div className="flex flex-col">
                    <p className={`text-base ${isActive ? "font-medium" : ""}`}>
                      {nav.label}
                    </p>
                    <p className="text-gray-500 text-sm">{nav.desc}</p>
                  </div>

                  {isActive && (
                    <div className="absolute -mt-4 right-0 w-1.5 h-20 bg-blue-600"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};
