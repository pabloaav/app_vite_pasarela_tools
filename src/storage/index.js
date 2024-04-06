import Vue from "vue";
import Vuex from "vuex";
import cierre_lote from "./modules/cierre_lote";
import bancoService from "@/services/banco";
import reporteService from "@/services/reportes";
import moment from "moment";

Vue.use(Vuex);

const state = {
  username: null,
  isAuthorized: false,
  banco: [],
  log: [],
  notificacion: [],
  reportes_enviados: [],

  //datos vista banco - log - notificacion
  fechaInicio: moment().subtract(1, "months"),
  fechaFin: moment(),

  //datos para paginacion de la tabla
  size: 15,
  number: 1,
  lastPage: null,
  totalRegistros: 0,

  loadingTable: false,

  rowsPerPageArray: [15, 30, 50, 100], //opciones para la cantidad de registros que se muestran en la tabla

  //FILTROS
  tipoMovimiento: [],
  tipoReporte: null,
  cliente: null,
  db_cr: "",
  search: "",

  dialog: false,
  drawer: false,
};

const mutations = {
  login(state, username) {
    state.isAuthorized = true;
    state.username = username;
  },
  logout(state) {
    state.isAuthorized = false;
    state.username = null;
  },
  setBanco(state, bancoData) {
    state.banco = bancoData;
  },
  setLog(state, logData) {
    state.log = logData;
  },
  setNotificacion(state, notificacionData) {
    state.notificacion = notificacionData;
  },
  setReportesEnviados(state, reportesEnviados) {
    state.reportes_enviados = reportesEnviados;
  },
  setLastPage(state, lastPage) {
    state.lastPage = lastPage;
  },
  setSize(state, size) {
    state.size = size;
  },
  setNumber(state, number) {
    state.number = number;
  },
  setDialog(state, dialog) {
    state.dialog = dialog;
  },
  setDrawer(state, drawer) {
    state.drawer = drawer;
  },
  setTotalRegistros(state, totalRegistros) {
    state.totalRegistros = totalRegistros;
  },
  setFechaInicio(state, fecha) {
    state.fechaInicio = fecha;
  },
  setFechaFin(state, fecha) {
    state.fechaFin = fecha;
  },
  setLoadingTable(state, isLoading) {
    state.loadingTable = isLoading;
  },
  setTipoMovimiento(state, tipoMovimiento) {
    state.tipoMovimiento = tipoMovimiento;
  },
  setTipoReporte(state, tipoReporte) {
    state.tipoReporte = tipoReporte;
  },
  setCliente(state, cliente) {
    state.cliente = cliente;
  },
  setDbCr(state, db_cr) {
    state.db_cr = db_cr;
  },
  setSearch(state, search) {
    state.search = search;
  },

  //reset data
  reset(state) {
    state.size = 15;
    state.number = 1;
    state.fechaInicio = moment().subtract(1, "months").toISOString();
    state.fechaFin = moment().toISOString();
    state.tipoMovimiento = [];
    state.tipoReporte = null;
    state.cliente = null;
    state.db_cr = "";
  },
};

const actions = {
  login({ commit }, username) {
    commit("login", username);
  },

  logout({ commit }) {
    commit("logout");
  },

  async getBancoData({ commit }) {
    commit("setLoadingTable", true);

    const params = {
      Number: state.number,
      Size: state.size,
      FechaInicio:
        moment(state.fechaInicio).format("YYYY-MM-DD") + "T00:00:00Z",
      FechaFin: moment(state.fechaFin).format("YYYY-MM-DD") + "T00:00:00Z",
    };

    if (state.db_cr && !state.db_cr.includes(",")) {
      params.DebitoCredito = Number(state.db_cr);
    }

    if (state.tipoMovimiento) {
      const idTipoMovimiento = state.tipoMovimiento.map(
        (item) => item.split(" -")[0]
      );
      params.ListaIdsTipoMovimientos = idTipoMovimiento.toString();
    }

    try {
      const data = await bancoService.getTransactions(params);

      let bancoData = data?.data?.data || [];

      if (params.ListaIdsTipoMovimientos.includes("17")) {
        bancoData = state.tipoMovimiento.includes("17 - Debin")
          ? bancoData.filter(
              (item) => item.debin_id || item.tipo_movimiento !== 17
            )
          : bancoData.filter(
              (item) => !item.debin_id || item.tipo_movimiento !== 17
            );
      }

      commit("setBanco", bancoData);

      commit("setLastPage", data.data.meta.page.lastPage);
      commit("setLoadingTable", false);
    } catch (error) {
      commit("setLoadingTable", false);
    }
  },

  async getLogData({ commit }) {
    commit("setLoadingTable", true);
    const params = {
      Number: state.number,
      Size: state.size,
      FechaInicio:
        moment(state.fechaInicio).format("YYYY-MM-DD") + "T00:00:00Z",
      FechaFin: moment(state.fechaFin).format("YYYY-MM-DD") + "T00:00:00Z",
    };

    try {
      const logData = await reporteService.logs(params);

      commit("setLog", logData?.result?.data || []);
      commit("setLastPage", logData.result.last_page);
      commit("setLoadingTable", false);
    } catch (error) {
      commit("setLoadingTable", false);
    }
  },

  async getNotificacionData({ commit }) {
    commit("setLoadingTable", true);
    const params = {
      Number: state.number,
      Size: state.size,
      FechaInicio:
        moment(state.fechaInicio).format("YYYY-MM-DD") + "T00:00:00Z",
      FechaFin: moment(state.fechaFin).format("YYYY-MM-DD") + "T00:00:00Z",
    };

    try {
      const notificacionData = await reporteService.notificaciones(params);

      commit("setNotificacion", notificacionData?.result?.data || []);
      commit("setLastPage", notificacionData.result.last_page);
      commit("setLoadingTable", false);
    } catch (error) {
      commit("setLoadingTable", false);
    }
  },

  async getReportesEnviadosData({ commit }) {
    try {
      commit("setLoadingTable", true);
      const params = {
        Number: state.number,
        Size: state.size,
        FechaInicio: moment(state.fechaInicio).format("YYYY-MM-DD"),
        FechaFin: moment(state.fechaFin).format("YYYY-MM-DD"),
        TipoReporte: state.tipoReporte,
        Cliente: state.cliente,
      };

      const { data } = await reporteService.reportesEnviados(params);

      commit("setReportesEnviados", data?.reportes || []);
      commit("setLastPage", data?.meta.page.lastPage || null);
      commit("setTotalRegistros", data?.meta.page.total || null);
      commit("");
      commit("setLoadingTable", false);
    } catch (error) {
      console.error(error);
      commit("setLoadingTable", false);
    }
  },

  setLastPage({ commit }, lastPage) {
    commit("setLastPage", lastPage);
  },

  setFechaInicio({ commit }, lastPage) {
    commit("setFechaInicio", lastPage);
  },

  setFechaFin({ commit }, lastPage) {
    commit("setFechaFin", lastPage);
  },

  setSize({ commit }, size) {
    commit("setSize", size);
  },

  setDrawer({ commit }, drawer) {
    commit("setDrawer", drawer);
  },

  setDialog({ commit }, dialog) {
    commit("setDialog", dialog);
  },

  setNumber({ commit }, number) {
    commit("setNumber", number);
  },

  setLoadingTable({ commit }, isLoading) {
    commit("setLoadingTable", isLoading);
  },

  setTipoMovimiento({ commit }, tipoMovimiento) {
    commit("setTipoMovimiento", tipoMovimiento);
  },

  setTipoReporte({ commit }, tipoReporte) {
    commit("setTipoReporte", tipoReporte);
  },

  setCliente({ commit }, cliente) {
    commit("setCliente", cliente);
  },

  setDbCr({ commit }, db_cr) {
    commit("setDbCr", db_cr);
  },

  setSearch({ commit }, search) {
    commit("setSearch", search);
  },
};

const getters = {
  size: (state) => state.size,
  number: (state) => state.number,
  lastPage: (state) => state.lastPage,
  loadingTable: (state) => state.loadingTable,
  banco: (state) => state.banco,
  log: (state) => state.log,
  notificacion: (state) => state.notificacion,
  reportes_enviados: (state) => state.reportes_enviados,
  fechaInicio: (state) => state.fechaInicio,
  fechaFin: (state) => state.fechaFin,
  rowsPerPageArray: (state) => state.rowsPerPageArray,
  totalRegistros: (state) => state.totalRegistros,
  dialog: (state) => state.dialog,

  tipoMovimiento: (state) => state.tipoMovimiento,
  cliente: (state) => state.cliente,
  db_cr: (state) => state.db_cr,
  username: (state) => state.username,
  search: (state) => state.search,
  drawer: (state) => state.drawer,
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules: { cierre_lote },
});
