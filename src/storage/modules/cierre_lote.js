import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import cierreService from "@/services/cierre_lote";
import multipagoService from "@/services/multipago.js"; //para el get de multipago

Vue.use(Vuex);

const state = {
  multipago: [],
  rapipago: [],
  apilink: [],
  prisma: [],
  movimientosPrisma: [],

  //rapipago
  codigoBarra: "",

  // apilink
  referenciaBanco: "",
  conciliados: 0,

  //vista de movimientos
  fechaPresentacion: false,
  fechaPagoMov: false,
  dialogDetalleMovimiento: false,

  //vista de cierre de lote prisma
  fechaCreacion: true,
  fechaOperacion: false,
  fechaPago: false,
  tipoOperacion: null,
  disputa: false,
  observacion: false,
  cargarMovimientos: false,
  cargarPagos: false,
  codigosAutorizacion: [],

  //datos para paginacion de la tabla
  size: 15,
  number: 1,
  lastPage: null,

  loadingTable: false,

  //general
  fechaInicio: moment().subtract(1, "months").toISOString(),
  fechaFin: moment().toISOString(),

  rowsPerPageArray: [15, 30, 50, 100], //opciones para la cantidad de registros que se muestran en la tabla
};

const mutations = {
  setFechaInicio(state, fecha) {
    state.fechaInicio = fecha;
  },
  setFechaFin(state, fecha) {
    state.fechaFin = fecha;
  },
  setRapipago(state, rapiTransactions) {
    state.rapipago = rapiTransactions;
  },
  setMultipago(state, multiTransactions) {
    state.multipago = multiTransactions;
  },
  setPrisma(state, prismaTransactions) {
    state.prisma = prismaTransactions;
  },
  setMovimientosPrisma(state, movimientosPrisma) {
    state.movimientosPrisma = movimientosPrisma;
  },
  setDialogDetalleMovimiento(state, detalle) {
    state.dialogDetalleMovimiento = detalle;
  },
  setApilink(state, apilinkTransactions) {
    state.apilink = apilinkTransactions;
  },

  //rapipago
  setCodigoBarra(state, codigoBarra) {
    state.codigoBarra = codigoBarra;
  },

  //apilink
  setConciliados(state, conciliados) {
    state.conciliados = conciliados;
  },

  setReferenciaBanco(state, referenciaBanco) {
    state.referenciaBanco = referenciaBanco;
  },

  //datos prisma
  setFechaCreacion(state, fechaCrecion) {
    state.fechaCreacion = fechaCrecion;
  },
  setFechaOperacion(state, fechaOperacion) {
    state.fechaOperacion = fechaOperacion;
  },
  setFechaPago(state, fechaPago) {
    state.fechaPago = fechaPago;
  },
  setTipoOperacion(state, tipoOperacion) {
    state.tipoOperacion = tipoOperacion;
  },
  setDisputa(state, disputa) {
    state.disputa = disputa;
  },
  setObservacion(state, observacion) {
    state.observacion = observacion;
  },
  setFechaPresentacion(state, fecha) {
    state.fechaPresentacion = fecha;
  },
  setFechaPagoMov(state, fecha) {
    state.fechaPagoMov = fecha;
  },
  setCargarMovimientos(state, cargar) {
    state.cargarMovimientos = cargar;
  },
  setCargarPagos(state, cargar) {
    state.cargarPagos = cargar;
  },
  setCodigosAutorizacion(state, codigosAutorizacion) {
    state.codigosAutorizacion = codigosAutorizacion;
  },

  //datos para la paginacion
  setLoadingTable(state, loading) {
    state.loadingTable = loading;
  },
  setSize(state, size) {
    state.size = size;
  },
  setNumber(state, number) {
    state.number = number;
  },
  setLastPage(state, lastPage) {
    state.lastPage = lastPage;
  },

  //reset data
  reset(state) {
    state.size = 15;
    state.number = 1;
    state.fechaInicio = moment().subtract(1, "months").toISOString();
    state.fechaFin = moment().toISOString();
    state.fechaCreacion = true;
  },
};

const actions = {
  setFechaInicio({ commit }, fecha) {
    commit("setFechaInicio", fecha);
  },

  setFechaFin({ commit }, fecha) {
    commit("setFechaFin", fecha);
  },

  async getRapipagoData({ commit }) {
    commit("setLoadingTable", true);
    const params = {
      Number: state.number,
      Size: state.size,
      FechaInicio:
        moment(state.fechaInicio).format("YYYY-MM-DD") + "T00:00:00Z",
      FechaFin: moment(state.fechaFin).format("YYYY-MM-DD") + "T00:00:00Z",
      CodigoBarra: state.codigoBarra,
    };

    try {
      const rapipagoData = await cierreService.rapipago(params);
      commit("setRapipago", rapipagoData?.data || []);
      commit("setLastPage", rapipagoData.meta?.page.lastPage || null);
      commit("setLoadingTable", false);
    } catch (error) {
      commit("setLoadingTable", false);
    }
  },

  async getMultipagoData({ commit }) {
    commit("setLoadingTable", true);
    const params = {
      Number: state.number,
      Size: state.size,
      FechaInicio:
        moment(state.fechaInicio).format("YYYY-MM-DD") + "T00:00:00Z",
      FechaFin: moment(state.fechaFin).format("YYYY-MM-DD") + "T00:00:00Z",
      CodigoBarra: state.codigoBarra,
    };

    try {
      const multipagoData = await multipagoService.multipago(params);
      commit("setMultipago", multipagoData?.data || []);
      commit("setLastPage", multipagoData.meta?.page.lastPage || null);
      commit("setLoadingTable", false);
    } catch (error) {
      commit("setLoadingTable", false);
    }
  },

  async getPrismaData({ commit }) {
    commit("setLoadingTable", true);
    let params = null;

    if (!state.codigosAutorizacion || state.codigosAutorizacion.length === 0) {
      params = {
        Number: state.number,
        Size: state.size,
        EstadoexternoId: 12,
        FechaInicio:
          moment(state.fechaInicio).format("YYYY-MM-DD") + "T00:00:00Z",
        FechaFin:
          moment(state.fechaFin).format("YYYY-MM-DD") + "T23:59:59.999Z",
        FechaCreacion: state.fechaCreacion,
        FechaOperacion: state.fechaOperacion,
        FechaPago: state.fechaPago,
        TipoOperacion: state.tipoOperacion,
        Disputa: state.disputa,
        Observacion: state.observacion,
        CargarMovimientoPrisma: state.cargarMovimientos,
        CargarPagoPrisma: state.cargarPagos,
      };
    } else {
      params = {
        Number: state.number,
        Size: state.size,
        EstadoexternoId: 12,
        CodigosAutorizacion: state.codigosAutorizacion
          .map(({ codigo }) => codigo)
          .toString(),
        Disputa: state.disputa,
        Observacion: state.observacion,
        CargarMovimientoPrisma: state.cargarMovimientos,
        CargarPagoPrisma: state.cargarPagos,
      };
    }

    //if (params.tipoOperacion === null) delete params.tipoOperacion;
    try {
      const prismaData = await cierreService.prisma(params);

      commit("setPrisma", prismaData?.data?.cierreslotes || []);
      commit("setLastPage", prismaData.data.meta?.page.lastPage || null);
      commit("setLoadingTable", false);
    } catch (error) {
      commit("setLoadingTable", false);
    }
  },

  async getApilinkData({ commit }) {
    commit("setLoadingTable", true);
    const params = {
      Number: state.number,
      Size: state.size,
      FechaInicio: moment(state.fechaInicio).format("YYYY-MM-DD"),
      FechaFin: moment(state.fechaFin).format("YYYY-MM-DD"),
      ReferenciaBanco: state.referenciaBanco,
      Conciliados: state.conciliados,
    };

    try {
      const apilinkData = await cierreService.apilink(params);

      commit("setApilink", apilinkData.data?.cierreslotes || []);
      commit("setLastPage", apilinkData.data.meta?.page?.lastPage || null);
      commit("setLoadingTable", false);
    } catch (error) {
      commit("setLoadingTable", false);
    }
  },

  async getMovimientosPrismaData({ commit }) {
    commit("setLoadingTable", true);
    const params = {
      Number: state.number,
      Size: state.size,
      FechaInicio:
        moment(state.fechaInicio).format("YYYY-MM-DD") + "T00:00:00Z",
      FechaFin: moment(state.fechaFin).format("YYYY-MM-DD") + "T00:00:00Z",
      BuscarPorFechaPresentacion: state.fechaPresentacion,
      BuscarPorFechaPago: state.fechaPagoMov,
      BuscarPorFechaCreacion: state.fechaCreacion,
      // BuscarPorFechaOrigenCompra: false,
    };

    try {
      const movimientosData = await cierreService.movimientosPrisma(params);

      commit("setMovimientosPrisma", movimientosData?.data || []);
      commit("setLastPage", movimientosData?.meta?.page?.lastPage || null);
      commit("setLoadingTable", false);
    } catch (error) {
      commit("setLoadingTable", false);
    }
  },

  setDialogDetalleMovimiento({ commit }, detalle) {
    commit("setDialogDetalleMovimiento", detalle);
  },

  //rapipago
  setCodigoBarra({ commit }, codigoBarra) {
    commit("setCodigoBarra", codigoBarra);
  },

  //rapipago
  setConciliados({ commit }, conciliados) {
    commit("setConciliados", conciliados);
  },

  setReferenciaBanco({ commit }, referenciaBanco) {
    commit("setReferenciaBanco", referenciaBanco);
  },

  //datos prisma
  setFechaCreacion({ commit }, fechaCreacion) {
    commit("setFechaCreacion", fechaCreacion);
  },
  setFechaOperacion({ commit }, fechaOperacion) {
    commit("setFechaOperacion", fechaOperacion);
  },
  setFechaPago({ commit }, fechaPago) {
    commit("setFechaPago", fechaPago);
  },
  setTipoOperacion({ commit }, tipoOperacion) {
    commit("setTipoOperacion", tipoOperacion);
  },
  setDisputa({ commit }, disputa) {
    commit("setDisputa", disputa);
  },
  setObservacion({ commit }, observacion) {
    commit("setObservacion", observacion);
  },

  setFechaPresentacion({ commit }, fechaPresentacion) {
    commit("setFechaPresentacion", fechaPresentacion);
  },
  setFechaPagoMov({ commit }, fechaPagoMov) {
    commit("setFechaPagoMov", fechaPagoMov);
  },
  setCargarMovimientos({ commit }, cargarMovimientos) {
    commit("setCargarMovimientos", cargarMovimientos);
  },
  setCargarPagos({ commit }, cargarPagos) {
    commit("setCargarPagos", cargarPagos);
  },
  setCodigosAutorizacion({ commit }, cargarAutorizacion) {
    commit("setCodigosAutorizacion", cargarAutorizacion);
  },

  //datos para la paginacion
  setLoadingTable({ commit }, loading) {
    commit("setLoadingTable", loading);
  },
  setLastPage({ commit }, lastPage) {
    commit("setLastPage", lastPage);
  },
  setNumber({ commit }, number) {
    commit("setNumber", number);
  },
  setSize({ commit }, size) {
    commit("setSize", size);
  },
};

const getters = {
  fechaInicio: (state) => state.fechaInicio,
  fechaFin: (state) => state.fechaFin,
  fechaPresentacion: (state) => state.fechaPresentacion,
  apilink: (state) => state.apilink,
  prisma: (state) => state.prisma,
  rapipago: (state) => state.rapipago,
  multipago: (state) => state.multipago,
  movimientosPrisma: (state) => state.movimientosPrisma,
  dialogDetalleMovimiento: (state) => state.dialogDetalleMovimiento,
  cargarMovimientos: (state) => state.cargarMovimientos,
  cargarPagos: (state) => state.cargarPagos,
  codigosAutorizacion: (state) => state.codigosAutorizacion,
  codigoBarra: (state) => state.codigoBarra,
  conciliados: (state) => state.conciliados,
  referenciaBanco: (state) => state.referenciaBanco,

  //datos para la paginacion
  size: (state) => state.size,
  number: (state) => state.number,
  lastPage: (state) => state.lastPage,
  loadingTable: (state) => state.loadingTable,
  rowsPerPageArray: (state) => state.rowsPerPageArray,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
