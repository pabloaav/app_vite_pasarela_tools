import apiBackground from "./apiBackground";
import apiPasarela from "./apiPasarela";
import { config } from "@/helpers";

const rapipago = async (params) => {
  const endpoint = "/administracion/consultar-cierrelote-rapipago";
  const { data } = await apiPasarela.get(endpoint, config(params));
  return data;
};

const prisma = async (params) => {
  const endpoint = "cierrelote/all-cierre-lote-prisma";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const deletePrisma = async (id) => {
  const endpoint = "/cierrelote/delete-cierre-lote-prisma";
  const { data } = await apiBackground.delete(endpoint, config(id));
  return data;
};

const updatePrisma = async (datos) => {
  const endpoint = "/cierrelote/edit-cierre-lote-prisma";
  const { data } = await apiBackground.put(endpoint, datos, config());
  return data;
};

const movimientosPrisma = async (params) => {
  const endpoint = "/cierrelote/presentaciones-prisma";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const apilink = async (params) => {
  const endpoint = "/cierrelote/all-cierre-lote-apilink";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const caducarPagosIntentosOffline = async () => {
  const endpoint = "/administracion/caducar-pagosintentos-offline";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const leerArchivoMinio = async (params) => {
  const endpoint = "/cierrelote/leer-archivo-minio";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const procesarTablaMovimientos = async () => {
  const endpoint = "/cierrelote/procesar-tabla-movimientos-mx";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const procesarTablaPagos = async () => {
  const endpoint = "/cierrelote/procesar-tabla-pagos-px";
  const { data } = await apiBackground.get(endpoint, config());
  return data;
};

const conciliacionCLMX = async (formData) => {
  const endpoint = "/cierrelote/conciliacion-cl-mx";
  const { data } = await apiBackground.post(
    endpoint,
    formData,
    config(null, true)
  );
  return data;
};

const conciliacionCLPX = async (formData) => {
  const endpoint = "/cierrelote/conciliacion-cl-px";
  const { data } = await apiBackground.post(
    endpoint,
    formData,
    config(null, true)
  );
  return data;
};

const conciliarBancoCL = async (formData) => {
  const endpoint = "/cierrelote/conciliar-banco-cl";
  const { data } = await apiBackground.post(
    endpoint,
    formData,
    config(null, true)
  );
  return data;
};

const generarMovimientoManual = async (params) => {
  const endpoint = "/cierrelote/generar-movimiento-manual";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

const transaccionesFaltantes = async (params) => {
  const endpoint = "/cierrelote/all-pagos-cl";
  const { data } = await apiBackground.get(endpoint, config(params));
  return data;
};

export default {
  rapipago,
  prisma,
  movimientosPrisma,
  deletePrisma,
  updatePrisma,
  leerArchivoMinio,
  procesarTablaMovimientos,
  procesarTablaPagos,
  apilink,
  conciliacionCLMX,
  conciliacionCLPX,
  conciliarBancoCL,
  generarMovimientoManual,
  caducarPagosIntentosOffline,
  transaccionesFaltantes,
};
