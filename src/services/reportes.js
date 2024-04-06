import apiBackground from "./apiBackground";
import { config } from "@/helpers";

const logs = async (params) => {
  const endpoint = "/reporte/logs";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const notificaciones = async (params) => {
  const endpoint = "/reporte/notificaciones";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const reportesEnviados = async (params) => {
  const endpoint = "/reporte/reportes-enviados";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

// utilizado para filtrado en vista de reportes enviados
const obtenerClientes = async (params) => {
  const endpoint = "/administracion/clientes-herramienta";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const sendReportePagos = async (params) => {
  const endpoint = "/reporte/send-pagos";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const sendReporteRendiciones = async (params) => {
  const endpoint = "/reporte/send-rendiciones";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const sendBatchPagoItems = async (params) => {
  const endpoint = "/reporte/batch-pago-items";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const reportesPagosMensuales = async (params) => {
  const endpoint = "/reporte/reportes-pagos-mensuales";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const reportesRendicionesMensuales = async (params) => {
  const endpoint = "/reporte/reportes-rendiciones-mensuales";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const sendReporteCobranzas = async (params) => {
  const endpoint = "/reporte/reporte-cobranza-diaria";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

//enviar reporte grafico por email
const sendReporteGrafico = async (formData) => {
  const endpoint = "/reporte/send-archivo-email";
  const { data } = await apiBackground.post(
    endpoint,
    formData,
    config(null, true)
  );

  return data;
};

export default {
  logs,
  notificaciones,
  reportesEnviados,
  obtenerClientes,
  sendReportePagos,
  sendReporteRendiciones,
  sendBatchPagoItems,
  sendReporteCobranzas,
  reportesPagosMensuales,
  reportesRendicionesMensuales,
  sendReporteGrafico,
};
