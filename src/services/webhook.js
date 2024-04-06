import apiBackground from "./apiBackground";
import { config } from "@/helpers";

const notificarPagos = async (params) => {
  const endpoint = "/administracion/notificacion-pagos";
  const { data } = await apiBackground(endpoint, config(params));
  return data;
};

const notificarPagosReferences = async (params) => {
  const endpoint = "/administracion/notificar-pagos-references";
  const { data } = await apiBackground(endpoint, config(params));
  return data;
};

export default { notificarPagos, notificarPagosReferences };
