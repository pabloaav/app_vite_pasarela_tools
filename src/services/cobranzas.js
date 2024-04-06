import { config } from "../helpers";
import apiPasarela from "./apiPasarela";

const controlCobranzas = async (params) => {
  const endpoint = "/reporte/verificar-cobranzas";
  return await apiPasarela.get(endpoint, config(params));
};

export default {
  controlCobranzas,
};
