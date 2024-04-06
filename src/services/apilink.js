import apiBackground from "./apiBackground";
import { config } from "@/helpers";

const conciliarDebines = async () => {
  const endpoint = "administracion/apilink-cierre-lote";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const notificarDebines = async () => {
  const endpoint = "administracion/notificar-pagos-clapilink-actualizados";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const conciliarBanco = async () => {
  const endpoint = "administracion/apilink-cierre-lote-conciliar-banco";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const generarMovimientos = async () => {
  const endpoint = "administracion/apilink-cierre-lote-generarmov";
  const { data } = await apiBackground.get(endpoint, config());

  return data;
};

const getDebinByID = async (params) => {
  const endpoint = "administracion/get-debin-id";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const getTicketInfo = async (params) => {
  const endpoint = "administracion/get-pago";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

export default {
  conciliarDebines,
  notificarDebines,
  conciliarBanco,
  generarMovimientos,
  getDebinByID,
  getTicketInfo,
};
