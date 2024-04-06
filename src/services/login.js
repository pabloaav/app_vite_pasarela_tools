import axios from "axios";

const baseURL = `${import.meta.env.VITE_VUE_APP_ROOT_AUTH}/users`;
const apiLogin = axios.create({ baseURL });

const login = async (userData) => {
  const { data } = await apiLogin.post("/login", userData);
  return data;
};

const forgotPassword = async (Email) => {
  const { data } = await apiLogin.post("/send-code-from-outside", { Email });
  return data;
};

export default { login, forgotPassword };
