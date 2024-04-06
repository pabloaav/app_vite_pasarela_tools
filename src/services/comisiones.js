import apiBackground from "./apiBackground";
import { config } from "@/helpers";

const movimientosTemporalesPagos = async (params) => {
  const endpoint = "/administracion/calcular-movimientostemporales-pagos";
  const { data } = await apiBackground.get(endpoint, config(params));

  return data;
};

const comisionManual = async (formData) => {
  const endpoint = "/administracion/comision-manual";
  const { data } = await apiBackground.post(
    endpoint,
    formData,
    config(null, true)
  );

  return data;
};

export default {
  movimientosTemporalesPagos,
  comisionManual,
};
