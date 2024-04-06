import moment from "moment";

export function formatDate(date, listar) {
  let formatDate = date;

  if (listar) formatDate = moment(date).add(1, "days");

  return moment(formatDate).format("DD-MM-YYYY");
}

// utilizado en vista LOG
export function formatDateHour(date) {
  return moment(date).format("HH:mm");
}

export function formatImport(monto, float = false) {
  /* Recibe como parametro un importe entero y retorna un flotante transformando sus dos ultimos digitos en decimal */
  let numero = monto;

  if (!float) numero = monto / 100;

  const format = numero.toLocaleString("es-ar", {
    style: "currency",
    currency: "ARS",
    currencySign: "accounting",
    minimumFractionDigits: 2,
  });

  // si el monto es negativo
  if (format.includes("(")) return "- " + format;

  return format;
}

export const formatImportFloat = (monto, sinSigno) => {
  const format = monto.toLocaleString("es-ar", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  if (sinSigno) return format.substring(2).replace(/\s/g, "-");

  return format;
};

// se encarga de obtener el token del local storage
const getToken = () => {
  const token = window.localStorage.getItem("userLogged");
  return `Bearer ${token}`;
};

// se encarga de agregar el token en la cabecera de la peticion
export const config = (params, formData) => {
  const config = {
    headers: {
      Authorization: getToken(),
    },
  };

  if (params) config.params = params;

  // si se envia un formData
  if (formData) {
    config.headers = {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    };
  }

  return config;
};

export const handleErrorApi = (error, message) => {
  const defaultMessage = message || "Error al comunicarse con el servidor";

  const defaultError = {
    message: defaultMessage,
    status: error?.response?.status || 400,
  };

  const errorData = error?.response?.data || defaultError;

  console.error(error);

  return errorData;
};

export const handleSuccessApi = (data, message) => {
  const defaultMessage = message || "Consulta realizada con éxito";

  const defaultSuccess = {
    message: defaultMessage,
    status: data.status,
  };

  const successData = data?.message || defaultSuccess;

  return successData;
};

export const formatNumReporte = (numeroReporte) => {
  //agrega al numero recibido el numero de ceros que falten para completar 6 digitos
  const numberString = numeroReporte.toString();
  const zerosNeeded = 6 - numberString.length;
  const zeros = "0".repeat(zerosNeeded);
  return zeros + numberString;
};

export function formatCompact(value) {
  const result = new Intl.NumberFormat("en-US", { notation: "compact" }).format(
    value
  );
  return result;
}
