import apiPasarela from "./apiPasarela";
import apiBackground from "./apiBackground";
import { config } from "@/helpers";

const leerArchivoMinio = async (params) => {
  const endpoint = "/cierrelote/leer-archivo-minio";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const actualizarPagosCL = async () => {
  const endpoint = "/administracion/actualizar-pagos-cl";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const notificarPagosCL = async (params) => {
  const endpoint = "/administracion/notificar-pagos-cl-actualizados";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const conciliacionBanco = async () => {
  const endpoint = "/administracion/rapipago-cierre-lote";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const generarMovimiento = async () => {
  const endpoint = "/administracion/generar-movimiento-rapipago";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const updateIdBanco = async (editData) => {
  const endpoint = "/administracion/asignar-bancoid-clrapipago";
  const { data } = await apiBackground.post(endpoint, editData, config());

  return data;
};

export default {
  leerArchivoMinio,
  actualizarPagosCL,
  notificarPagosCL,
  conciliacionBanco,
  generarMovimiento,
  updateIdBanco,
};
