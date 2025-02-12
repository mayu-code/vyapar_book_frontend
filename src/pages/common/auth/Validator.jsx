const checkInteger = (input) => {
  if (/^\d*$/.test(input)) return true;
  else return false;
};

export const validateRegistrationFields = (registerData) => {
  let errors = {};

  const { name, mobileNo, email, password, confirmPassword } = registerData;

  if (!name) errors.name = "Name is required";
  if (!mobileNo) errors.mobileNo = "Mobile number is required";
  if (!checkInteger(mobileNo) || mobileNo.length !== 10) {
    errors.mobileNo = "Invalid mobile number";
  }
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (!confirmPassword) {
    errors.confirmPassword = "Confirm Password is required";
  }
  if (confirmPassword !== password)
    errors.confirmPassword = "Password do not match !";

  return errors;
};

export const validateLoginFields = (loginData) => {
  let errors = {};

  const { email, password } = loginData;

  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  return errors;
};
