import apiBackground from "./apiBackground";
import apiPasarela from "./apiPasarela";
import { config } from "@/helpers";

const transferenciasComisiones = async (body) => {
  const endpoint = "/administracion/transferencia-comisiones-impuestos";
  const { data } = await apiBackground.post(endpoint, body, config());
  return data;
};

const transferenciasClientes = async (params) => {
  const endpoint = "/administracion/transferencias-automaticas";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const transferenciaPorMovimiento = async (body) => {
  const endpoint = "/administracion/transferencia-por-movimiento";
  const { data } = await apiPasarela.post(endpoint, body, config());
  return data;
};

export default {
  transferenciasComisiones,
  transferenciasClientes,
  transferenciaPorMovimiento,
};
