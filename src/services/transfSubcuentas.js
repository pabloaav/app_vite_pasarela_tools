import { config } from "@/helpers";
import apiBackground from "./apiBackground";

const getTransferenciasSub = async () => {
  const endpoint = "/administracion/transferencia-subcuentas";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

export default { getTransferenciasSub };
