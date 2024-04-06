<template>
  <div>
    <Drawer title="Ejecutar proceso" width="380px">
      <div>
        <EjecutarProceso></EjecutarProceso>
      </div>
    </Drawer>
    <v-main class="mx-8">
      <!--FILTROS-->
      <v-row align="center" class="mt-2">
        <v-col cols="12" class="d-flex align-center" style="gap: 20px">
          <!-- FECHA INICIO -->
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="formatDate(fechaInicio)"
                label="Fecha inicio"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                style="max-width: 160px"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date1"
              @input="menu1 = false"
              locale="es"
              @change="setFechaInicio(date1)"
              :max="limitarFechas.max"
            ></v-date-picker>
          </v-menu>

          <!-- FECHA FIN -->
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="formatDate(fechaFin)"
                label="Fecha fin"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                style="max-width: 160px"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date2"
              @change="setFechaFin(date2)"
              @input="menu2 = false"
              locale="es"
              :max="limitarFechas.max"
            ></v-date-picker>
          </v-menu>

          <!-- CODIGO DE BARRA -->
          <v-text-field
            label="Código de barra"
            v-model="codigoBarra"
            prepend-icon="mdi-barcode-scan"
            clearable
            clear-icon="mdi-delete"
            type="number"
            style="max-width: 560px"
          ></v-text-field>
          <!-- tres puntos opciones -->
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item link @click="caducarPagos()">
                <v-list-item-icon>
                  <v-icon>mdi-cash-remove</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Caducar pagos intentos</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="setDrawer(true)">
                <v-list-item-icon>
                  <v-icon>mdi-plus-box-multiple</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Ejecutar proceso</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            class="blue white--text ml-5"
            @click="
              () => {
                setNumber(1);
                getRapipagoData();
              }
            "
          >
            <v-icon left>mdi-filter-variant</v-icon> Filtrar
          </v-btn>
        </v-col>
      </v-row>
      <v-subheader class="font-weight-bold" v-if="!loadingTable"
        >Rapipago</v-subheader
      >
      <!-- <p class="mt-2 font-weight-medium">Cierre de lote > Rapipagoo</p> -->
      <!--TABLA-->
      <TableRapipago />
    </v-main>
  </div>
</template>

<script>
import { formatDate, formatImport } from "@/helpers";
import TableRapipago from "@/components/CierreLote/TableRapipago.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import moment from "moment";
import cierre_lote from "@/services/cierre_lote";
import Drawer from "@/components/Drawer.vue";
import EjecutarProceso from "./EjecutarProceso.vue";

export default {
  name: "RapipagoView",
  components: { TableRapipago, Drawer, EjecutarProceso },
  data() {
    return {
      expanded: [],
      formatDate: formatDate,
      formatImport: formatImport,
      date1: null,
      date2: null,

      limitarFechas: {
        max: new Date().toISOString().substr(0, 10),
      },

      menu1: false, //fecha inicio
      menu2: false, //fecha fin

      loading: false,
    };
  },

  computed: {
    ...mapGetters("cierre_lote", ["fechaInicio", "fechaFin", "loadingTable"]),

    codigoBarra: {
      get() {
        return this.$store.getters["cirre_lote/codigoBarra"];
      },
      set(newCode) {
        this.$store.dispatch("cierre_lote/setCodigoBarra", newCode);
      },
    },
  },

  mounted() {
    this.date1 = moment(this.fechaInicio).format("YYYY-MM-DD");
    this.reset();
    this.getRapipagoData();
  },
  methods: {
    ...mapActions("cierre_lote", [
      "getRapipagoData",
      "setFechaInicio",
      "setFechaFin",
      "setNumber",
    ]),
    ...mapActions(["setDrawer"]),

    ...mapMutations("cierre_lote", ["reset"]),

    async caducarPagos() {
      this.$swal
        .fire({
          title: "¿Está seguro?",
          text: "Esta acción caducará los pagos intentos",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Sí, caducar",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              this.loading = true;
              const data = await cierre_lote.caducarPagosIntentosOffline();
              this.loading = false;
              this.$swal.fire({
                text: "Cantidad de pagos itentos caducados: " + data,
                icon: "success",
              });
            } catch (error) {
              console.error(error);
              this.loading = false;
            }
          }
        });
    },
  },
};
</script>

<style scoped></style>
