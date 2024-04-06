import { config } from "../helpers";
import apiPasarela from "./apiPasarela";
import apiBackground from "./apiBackground";

const getTransactions = async (params) => {
  const endpoint = "/banco/obtener_movimientos";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const conciliacionTransferencia = async (params) => {
  const endpoint = "/administracion/conciliacion-banco";
  const { data } = await apiPasarela.get(endpoint, config(params));
  return data;
};

const procesarMovimientos = async () => {
  const endpoint = "/banco/procesar_movimientos_herramienta";
  const { data } = await apiPasarela.get(endpoint, config());
  return data;
};

export default {
  getTransactions,
  conciliacionTransferencia,
  procesarMovimientos,
};
