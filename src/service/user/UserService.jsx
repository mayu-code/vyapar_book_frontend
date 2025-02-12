import {
  addCustomer,
  addTransaction,
  deleteCustomer,
  deleteTransaction,
  getAllCustomers,
  getCustomerById,
  getCustomersTransaction,
  getDashboard,
  getTransactionReport,
  getTransactions,
  getUserByToken,
  sendFCMToken,
  updateCustomer,
  updateTransaction,
} from "../../api/user/UserApi";

export const getUserByTokenService = async (token) => {
  try {
    const res = await getUserByToken(token);
    // console.log(res);

    return res?.data?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addCustomerService = async (addReq) => {
  try {
    const token = localStorage.getItem("token");

    const res = await addCustomer(token, addReq);
    // console.log(res);

    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const sendFCMTokenService = async (firebaseToken) => {
  try {
    const token = localStorage.getItem("token");

    const res = await sendFCMToken(token, firebaseToken);
    // console.log(res);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const updateCustomerService = async (updateReq) => {
  try {
    const token = localStorage.getItem("token");

    const res = await updateCustomer(token, updateReq);
    // console.log(res);

    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const getAllCustomersService = async (paramReq) => {
  try {
    const token = localStorage.getItem("token");

    const res = await getAllCustomers(token, paramReq);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getDashboardService = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await getDashboard(token);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCustomersTransactionService = async (customerId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await getCustomersTransaction(token, customerId);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTransactionsService = async (req) => {
  try {
    const token = localStorage.getItem("token");

    const res = await getTransactions(token, req);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getCustomerByIdService = async (customerId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await getCustomerById(token, customerId);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getTransactionReportService = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await getTransactionReport(token);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addTransactionService = async (addReq) => {
  try {
    const token = localStorage.getItem("token");

    const res = await addTransaction(token, addReq);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const updateTransactionService = async (updateReq) => {
  try {
    const token = localStorage.getItem("token");

    const res = await updateTransaction(token, updateReq);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const deleteTransactionService = async (transactionId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await deleteTransaction(token, transactionId);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};

export const deleteCustomerService = async (customerId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await deleteCustomer(token, customerId);
    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || error;
  }
};
