import axios from "axios";

const baseURL = import.meta.env.VITE_VUE_APP_ROOT_BACKGROUND;
const apiBackground = axios.create({ baseURL });

export default apiBackground;
