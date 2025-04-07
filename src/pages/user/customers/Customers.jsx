import { CustomerList } from "../customers/CustomerList";
import { CustomerInfo } from "../customers/CustomerInfo";
import { useState } from "react";
import { LuUsers } from "react-icons/lu";
import { AddCustomer } from "./AddCustomer";
import { useQuery } from "@tanstack/react-query";
import {
  getAllCustomersService,
  getDashboardService,
} from "../../../service/user/UserService";

export const Customers = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const paramReq = {
    query: undefined,
    gave: false,
    get: false,
    settle: false,
  };

  const [filter, setFilter] = useState(paramReq);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: customers,
    refetch: refetchCustomers,
    isLoading: isCustomersLoading,
  } = useQuery({
    queryKey: ["customers", filter, searchQuery],
    queryFn: async () => {
      return await getAllCustomersService(filter);
    },
  });

  const { data: dashboardData, refetch: refetchGetDashboardData } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      return await getDashboardService();
    },
  });

  return (
    <section className="grid grid-cols-2 h-screen">
      <CustomerList
        paramReq={paramReq}
        filter={filter}
        setFilter={setFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isOpen={isAddCustomerOpen}
        setSelectedCustomerId={setSelectedCustomerId}
        selectedCustomerId={selectedCustomerId}
        dashboardData={dashboardData}
        setIsOpen={setIsAddCustomerOpen}
        customers={customers}
        isCustomersLoading={isCustomersLoading}
      />
      {selectedCustomerId ? (
        <CustomerInfo
          refetchGetDashboardData={refetchGetDashboardData}
          setSelectedCustomerId={setSelectedCustomerId}
          customerId={selectedCustomerId}
          refetchCustomers={refetchCustomers}
        />
      ) : (
        <div className="flex flex-col gap-5 justify-center items-center">
          <div className="flex justify-center items-center">
            <LuUsers className="text-gray-400" size={100} />
          </div>
          <h1 className="font-medium">No Customer Selected</h1>
        </div>
      )}

      {isAddCustomerOpen && (
        <AddCustomer
          setIsOpen={setIsAddCustomerOpen}
          refetchGetDashboardData={refetchGetDashboardData}
          refetchCustomers={refetchCustomers}
        />
      )}
    </section>
  );
};
