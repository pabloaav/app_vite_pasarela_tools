<template>
  <v-navigation-drawer app :mini-variant.sync="mini" permanent>
    <ModalExpiracion :dialog="dialog" />
    <v-list class="d-flex flex-column">
      <v-list-item class="px-2" @click="forzarMini = true">
        <v-list-item-avatar>
          <img src="@/assets/w.png" style="cursor: pointer" />
        </v-list-item-avatar>

        <v-list-item-title class="font-weight-bold white--text">{{
          username.split("@")[0]
        }}</v-list-item-title>

        <v-btn icon @click.stop="mini = !mini">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <!-- BANCOS -->
        <v-tooltip right color="black">
          <template v-slot:activator="{ on }">
            <v-list-item
              link
              to="/banco"
              class="mt-2"
              v-on="on"
              v-if="verificarPermiso('psp.herramienta')"
            >
              <v-list-item-icon>
                <!-- <img :src="require('@/assets/banco.png')" alt="" width="27px" /> -->
                <v-icon>mdi-bank-outline</v-icon>
              </v-list-item-icon>

              <v-list-item-title>Bancos</v-list-item-title>
            </v-list-item>
          </template>
          <span>Bancos</span>
        </v-tooltip>

        <div v-for="item in prisma" :key="item.to">
          <v-tooltip right color="black" v-if="!mini">
            <template v-slot:activator="{ on }">
              <v-list-group
                :key="item.title"
                v-model="item.active"
                active-class="blue-grey--text text--darken-4"
                no-action
                :prepend-icon="item.action"
                @click="forzarMini = true"
                :style="
                  verificarPermiso('psp.herramienta') ? '' : 'display: none'
                "
                v-on="on"
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item
                  v-for="child in item.items"
                  :key="child.title"
                  link
                  :to="child.to"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ child.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </template>
            <span>{{ item.title }}</span>
          </v-tooltip>

          <v-menu open-on-hover top offset-x v-else>
            <template v-slot:activator="{ on }">
              <v-list-item
                link
                v-on="on"
                :style="
                  verificarPermiso('psp.herramienta') ? '' : 'display: none'
                "
              >
                <v-list-item-icon>
                  <v-icon>{{ item.action }}</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </template>

            <v-card dark>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <img :src="item.img" />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Menu de selección</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-item
                  v-for="subItem in item.items"
                  link
                  :to="subItem.to"
                  :key="subItem.to"
                >
                  <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>

        <div v-for="item in items" :key="item.to">
          <v-tooltip right color="black">
            <template v-slot:activator="{ on }">
              <v-list-item
                link
                :to="item.to"
                v-on="on"
                :style="verificarPermiso(item.permiso) ? '' : 'display: none'"
              >
                <v-list-item-icon>
                  <v-icon v-if="!item.icon.includes('.png')">{{
                    item.icon
                  }}</v-icon>
                  <img
                    :src="require('@/assets/' + item.icon)"
                    alt=""
                    v-else
                    width="27px"
                  />
                </v-list-item-icon>

                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
            <span>{{ item.title }}</span>
          </v-tooltip>
        </div>
      </v-list>
    </v-list>

    <template v-slot:append>
      <v-tooltip right color="black">
        <template v-slot:activator="{ on }">
          <v-list-item @click="logout" class="red lighten-1" v-on="on">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>

            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </template>
        <span>Cerrar Sesión</span>
      </v-tooltip>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import ModalExpiracion from "@/components/ModalExpiracion.vue";
import { Idle } from "idlejs";
import jwtDecode from "jwt-decode";
export default {
  name: "Dashboard",
  components: {
    ModalExpiracion,
  },
  data() {
    return {
      dialog: false,
      mini: true,

      prisma: [
        {
          items: [
            { title: "Cierre de lote", to: "/cierre_lote_prisma" },
            { title: "Movimientos", to: "/movimientos_prisma" },

            { title: "Ejecutar proceso", to: "/ejecutar_proceso" },
            {
              title: "Transc. faltantes",
              to: "/transacciones_faltantes",
            },
          ],
          title: "Prisma",
          active:
            this.$router.currentRoute.path === "/cierre_lote_prisma" ||
            this.$router.currentRoute.path === "/movimientos_prisma" ||
            this.$router.currentRoute.path === "/ejecutar_proceso",
          action: "mdi-cash-multiple",
          img: "https://www.estaciones.com.ar/wp-content/uploads/2019/08/prisma-medio-de-pagos-lapos-telefono-reclamos-1.jpg",
        },
      ],

      items: [
        {
          title: "Rapipago",
          icon: "mdi-alpha-r-circle-outline",
          to: "/cierre_lote_rapipago",
          permiso: "psp.herramienta",
        },
        {
          title: "Multipago",
          icon: "mdi-alpha-m-circle-outline",
          to: "/multipago",
          permiso: "psp.herramienta",
        },
        {
          title: "API-Link",
          icon: "mdi-alpha-a-box-outline",
          to: "/cierre_lote_apilink",
          permiso: "psp.herramienta",
        },
        {
          title: "Webhook",
          icon: "mdi-webhook",
          to: "/webhook",
          permiso: "psp.herramienta",
        },
        {
          title: "Transferencias",
          icon: "mdi-cash-refund",
          to: "/transferencia-comisiones",
          permiso: "psp.herramienta.comisiones",
        },
        {
          title: "Reportes enviados",
          icon: "mdi-file-send-outline",
          to: "/reportes_enviados",
          permiso: "psp.herramienta",
        },
        {
          title: "LOG / Notificaciones",
          icon: "mdi-text-box-outline",
          to: "/log",
          permiso: "psp.herramienta",
        },
        /*  {
          title: "Notificaciones",
          icon: "mdi-bell-outline",
          to: "/notificaciones",
          permiso: "psp.herramienta",
        }, */
        {
          title: "Reporte pagos",
          icon: "mdi-chart-bar",
          to: "/reportes_graficos",
          permiso: "psp.herramienta.reporte",
        },
        /* {
          title: "Reportes cobranzas",
          icon: "mdi-file-download-outline",
          to: "/reportes_cobranzas",
        }, */
        {
          title: "Calculo comisiones",
          icon: "mdi-calculator",
          to: "/calculo_comisiones",
          permiso: "psp.herramienta",
        },
        /*    {
          title: "Transferencias",
          icon: "mdi-cash-fast",
          to: "/transferencias",
          permiso: "psp.herramienta",
        }, */
        {
          title: "Control Cobranzas",
          icon: "mdi-cash-clock",
          to: "/control_cobranzas",
          permiso: "psp.herramienta",
        },
        /*   {
          title: "Transf. Subcuentas",
          icon: "mdi-account-cash",
          to: "/transferencias_subcuentas",
          permiso: "psp.herramienta",
        }, */
      ],

      forzarMini: false,
    };
  },

  computed: {
    ...mapGetters(["username"]),
  },
  watch: {
    mini(newValue, oldValue) {
      if (oldValue) {
        newValue = oldValue;
        this.mini = newValue;
      }

      if (this.forzarMini) {
        newValue = false;
        this.mini = newValue;
        this.forzarMini = false;
      }

      window.localStorage.setItem("drawerMini", newValue);
    },
  },

  mounted() {
    const drawerMini = window.localStorage.getItem("drawerMini");

    if (drawerMini === "false") {
      this.mini = false;
      this.forzarMini = true;
    }

    const idle = new Idle()
      .whenNotInteractive()
      .within(60)
      .do(() => (this.dialog = true))
      .start();

    this.verificarPermiso();
  },

  methods: {
    logout() {
      this.$router.push("/login");
      window.localStorage.removeItem("userLogged");
    },

    verificarPermiso(permiso) {
      const token = window.localStorage.getItem("userLogged");

      const { permisos } = jwtDecode(token);

      return permisos.some((p) => p === permiso);
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  background: #56ccf2; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #2f80ed,
    #56ccf2
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #2f80ed,
    #56ccf2
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.v-list-item--active {
  color: white !important;
}
</style>
