import {
  addCustomer,
  addTransaction,
  deleteCustomer,
  deleteDueDate,
  deleteTransaction,
  downloadExcel,
  downloadPdf,
  downLoadRemaindersPdf,
  getAllCustomers,
  getCustomerById,
  getCustomerByMobile,
  getCustomerRemainders,
  getCustomersOnDueDate,
  getCustomersTransaction,
  getDashboard,
  getTransactionReport,
  getTransactions,
  getUserByToken,
  sendFCMToken,
  setDueDate,
  updateCustomer,
  updateTransaction,
} from "../../api/user/UserApi";

const errorMessage = {
  message: "Something went wrong !!",
  statusCode: 500,
};

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
    return errorMessage;
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
    return errorMessage;
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
    return errorMessage;
  }
};

export const setDueDateService = async (deuDateReq) => {
  try {
    const token = localStorage.getItem("token");

    const res = await setDueDate(token, deuDateReq);
    // console.log(res);

    return res?.data;
  } catch (error) {
    console.log(error);
    return error?.response?.data || errorMessage;
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

export const downloadPdfService = async (customerId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await downloadPdf(token, customerId);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const downLoadRemaindersPdfService = async (customerId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await downLoadRemaindersPdf(token, customerId);
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const downloadExcelService = async (paramReq) => {
  try {
    const token = localStorage.getItem("token");

    const res = await downloadExcel(token, paramReq);
    return res;
  } catch (error) {
    console.log(error);
    return null;
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

export const getCustomersOnDueDateService = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await getCustomersOnDueDate(token);
    return res?.data?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getCustomerByMobileService = async (mobileNo) => {
  try {
    const token = localStorage.getItem("token");
    const res = await getCustomerByMobile(token, mobileNo);
    return res?.data;
  } catch (error) {
    console.log(error);
    return errorMessage;
  }
};

export const getCustomerRemaindersService = async (customerId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await getCustomerRemainders(token, customerId);
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
    return errorMessage;
  }
};

export const updateTransactionService = async (updateReq) => {
  try {
    const token = localStorage.getItem("token");

    const res = await updateTransaction(token, updateReq);
    return res?.data;
  } catch (error) {
    console.log(error);
    return errorMessage;
  }
};

export const deleteTransactionService = async (transactionId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await deleteTransaction(token, transactionId);
    return res?.data;
  } catch (error) {
    console.log(error);
    return errorMessage;
  }
};

export const deleteCustomerService = async (customerId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await deleteCustomer(token, customerId);
    return res?.data;
  } catch (error) {
    console.log(error);
    return errorMessage;
  }
};

export const deleteDueDateService = async (customerId, dueDate) => {
  try {
    const token = localStorage.getItem("token");

    const res = await deleteDueDate(token, customerId, dueDate);
    return res?.data;
  } catch (error) {
    console.log(error);
    return errorMessage;
  }
};
