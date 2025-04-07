import axios from "axios";
import { BASE_URL } from "../ApiConstants";

const USER_URL = `${BASE_URL}/user`;

const user = axios.create({
  baseURL: USER_URL,
});

export const getUserByToken = (token) => {
  return user.get("/getProfile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addCustomer = (token, addReq) => {
  return user.post("/addCustomer", addReq, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCustomer = (token, updateReq) => {
  return user.post("/updateCustomer", updateReq, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllCustomers = (token, paramReq) => {
  return user.get("/getAllCustomers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      query: paramReq.query,
      gave: paramReq.gave,
      get: paramReq.get,
      settle: paramReq.settle,
    },
  });
};

export const getDashboard = (token) => {
  return user.get("/getDashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCustomersTransaction = (token, customerId) => {
  return user.get(`/getCustomersTransaction/${customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransactions = (token, req) => {
  return user.get(`/getTransactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      query: req.query,
      startDate: req.startDate,
      endDate: req.endDate,
    },
  });
};

export const getCustomerById = (token, customerId) => {
  return user.get(`/getCustomer/${customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTransactionReport = (token) => {
  return user.get(`/getTransactionReport`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addTransaction = (token, addReq) => {
  return user.post(`/addTransaction`, addReq, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendFCMToken = (token, firebaseToken) => {
  return user.post(
    `/sendFCMToken`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        token: firebaseToken,
      },
    }
  );
};

export const updateTransaction = (token, updateReq) => {
  return user.post(`/updateTransaction`, updateReq, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const setDueDate = (token, deuDateReq) => {
  return user.post(`/setDueDate`, deuDateReq, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTransaction = (token, transactionId) => {
  return user.delete(`/deleteTransaction/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCustomer = (token, customerId) => {
  return user.delete(`/deleteCustomer/${customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteDueDate = (token, customerId, dueDate) => {
  return user.delete(`/removeDueDate/${customerId}/${dueDate}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCustomersOnDueDate = (token) => {
  return user.get(`/getCustomersOnDueDate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCustomerRemainders = (token, customerId) => {
  return user.get(`/getCustomerRemainders/${customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCustomerByMobile = (token, mobileNo) => {
  return user.get(`/getCustomerByMobile/${mobileNo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const downloadPdf = (token, customerId) => {
  return user.get(`/downloadReport`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
    params: {
      customerId: customerId,
      startDate: undefined,
      endDate: undefined,
    },
  });
};

export const downLoadRemaindersPdf = (token, customerId) => {
  return user.get(`/downLoadRemainders/${customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });
};

export const downloadExcel = (token, paramReq) => {
  return user.get(`/downloadExcelReport`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
    params: {
      query: paramReq.query,
      startDate: paramReq.startDate,
      endDate: paramReq.endDate,
    },
  });
};
