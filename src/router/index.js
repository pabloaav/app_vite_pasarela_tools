import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Banco from "../views/Banco.vue";
import Rapipago from "../views/Rapipago/Rapipago.vue";
import Prisma from "../views/CierreLote/Prisma.vue";
import EjecutarProceso from "../views/CierreLote/EjecutarProceso.vue";
import MovimientosPrisma from "@/views/CierreLote/MovimientosPrisma.vue";
import Apilink from "../views/Apilink/Apilink.vue";
import TrasaccionesFaltantes from "../views/CierreLote/TransaccionesFaltantes.vue";
import store from "@/storage";
/* import jwtDecode from "jwt-decode"; */

const routes = [
  { path: "/login", name: "Login", component: Login },
  {
    path: "/banco",
    name: "Banco",
    meta: { requiresAuth: true },
    component: Banco,
  },
  {
    path: "/cierre_lote_rapipago",
    name: "Rapipago",
    meta: { requiresAuth: true },
    component: Rapipago,
  },
  {
    path: "/multipago",
    name: "Multipago",
    meta: { requiresAuth: true },
    component: () => import("../views/Multipago/Multipago.vue"),
  },
  {
    path: "/cierre_lote_prisma",
    name: "Prisma",
    meta: { requiresAuth: true },
    component: Prisma,
  },
  {
    path: "/transacciones_faltantes",
    name: "TrasaccionesFaltantes",
    meta: { requiresAuth: true },
    component: TrasaccionesFaltantes,
  },
  {
    path: "/movimientos_prisma",
    name: "MovimientosPrisma",
    meta: { requiresAuth: true },
    component: MovimientosPrisma,
  },
  {
    path: "/cierre_lote_apilink",
    name: "Apilink",
    meta: { requiresAuth: true },
    component: Apilink,
  },
  {
    path: "/ejecutar_proceso",
    name: "EjecutarProceso",
    meta: { requiresAuth: true },
    component: EjecutarProceso,
  },
  {
    path: "/log",
    name: "Log",
    meta: { requiresAuth: true },
    component: () => import("../views/Log.vue"),
  },
  {
    path: "/webhook",
    name: "Webhook",
    meta: { requiresAuth: true },
    component: () => import("../views/Webhook.vue"),
  },
  {
    path: "/transferencia-comisiones",
    name: "TransferenciaComisiones",
    meta: { requiresAuth: true },
    component: () => import("../views/TransferenciaComisiones.vue"),
  },
  {
    path: "/notificaciones",
    name: "Notificacion",
    meta: { requiresAuth: true },
    component: () => import("../views/Notificacion.vue"),
  },
  {
    path: "/reportes_enviados",
    name: "ReportesEnviados",
    meta: { requiresAuth: true },
    component: () => import("../views/ReportesEnviados.vue"),
  },
  {
    path: "/ejecutar_proceso_rapipago",
    name: "EjecutarProcesoRapipago",
    meta: { requiresAuth: true },
    component: () => import("../views/Rapipago/EjecutarProceso.vue"),
  },
  {
    path: "/ejecutar_proceso_apilink",
    name: "EjecutarProcesoApilink",
    meta: { requiresAuth: true },
    component: () => import("../views/Apilink/EjecutarProceso.vue"),
  },
  {
    path: "/reportes_graficos",
    name: "ReportesGraficos",
    meta: { requiresAuth: true },
    component: () => import("../views/ReportesGraficos.vue"),
  },
  {
    path: "/calculo_comisiones",
    name: "CalculoComisiones",
    meta: { requiresAuth: true },
    component: () => import("../views/CalculoComisiones.vue"),
  },
  {
    path: "/transferencias",
    name: "Transferencias",
    meta: { requiresAuth: true },
    component: () => import("../views/Transferencias.vue"),
  },
  {
    path: "/control_cobranzas",
    name: "ControlCobranzas",
    meta: { requiresAuth: true },
    component: () => import("../views/ControlCobranzas.vue"),
  },
  {
    path: "/transferencias_subcuentas",
    name: "TransferenciasSubcuentas",
    meta: { requiresAuth: true },
    component: () => import("../views/TransferenciasSubcuentas.vue"),
  },
  {
    path: "*",
    redirect: "/login",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

/* const userLogged = (token) => {
  if (token) {
    const userDecoded = jwtDecode(token);
    store.dispatch("login", userDecoded.user);
    return true;
  } else {
    return false;
  }
}; */

//proteccion de rutas
router.beforeEach((to, from, next) => {
  if (to.path === "/") {
    next({ name: "Banco" });
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    //const token = window.localStorage.getItem("userLogged");

    if (store.state.isAuthorized) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else {
    next();
  }
});

export default router;
