import axios from "axios";

const baseURL = import.meta.env.VITE_VUE_APP_ROOT_PASARELA;
const apiPasarela = axios.create({ baseURL });

export default apiPasarela;
