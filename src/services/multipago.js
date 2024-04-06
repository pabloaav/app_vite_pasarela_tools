import apiBackground from "./apiBackground";
import apiPasarela from "./apiPasarela";
import { config } from "@/helpers";

const multipago = async (params) => {
  const endpoint = "/administracion/consultar-cierrelote-multipago";
  const { data } = await apiPasarela.get(endpoint, config(params));
  return data;
};

const leerArchivoMinio = async () => {
  const endpoint = "/cierrelote/leer-archivo-minio";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const actualizarPagosCL = async () => {
  const endpoint = "/administracion/actualizar-pagos-cl-mp";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const notificarPagosCL = async (params) => {
  const endpoint = "/administracion/notificar-pagos-cl-actualizados-mp";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const conciliacionBanco = async () => {
  const endpoint = "/administracion/multipagos-cierre-lote";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const generarMovimiento = async () => {
  const endpoint = "/administracion/generar-movimiento-multipagos";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

export default {
  multipago,
  leerArchivoMinio,
  actualizarPagosCL,
  notificarPagosCL,
  conciliacionBanco,
  generarMovimiento,
};
