import CryptoJS from "crypto-js";

const secretKey = "fndsjibfisdbf87fsydf78dsadsasatydf8dsbu8sd8tsd";

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
