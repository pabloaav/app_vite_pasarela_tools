<template>
  <div>
    <Drawer title="Más opciones" width="340px">
      <div>
        <v-tabs
          v-model="tab"
          background-color="grey lighten-4"
          color="black"
          centered
          center-active
          show-arrows
          active-class="grey lighten-2"
        >
          <v-tab class="text-capitalize"
            >Filtros<v-icon>mdi-filter-multiple-outline</v-icon>
          </v-tab>
          <v-tab class="text-capitalize"
            >Conciliar transferencias
            <v-icon>mdi-approximately-equal</v-icon>
          </v-tab>
          <v-tab class="text-capitalize"
            >Procesar movimientos
            <v-icon class="mx-2">mdi-update</v-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <!-- TAB FILTROS -->
          <v-tab-item class="px-3">
            <v-list>
              <p class="mb-2 mt-10 grey--text text--darken-1">
                Tipo de movimiento
              </p>
              <v-list-item-group
                v-model="tipoMovimiento"
                multiple
                class="mx-2"
                @change="setTipoMovimiento(tipoMovimiento)"
              >
                <v-list-item
                  v-for="(item, i) in itemsTipoMovimiento"
                  :key="i"
                  :value="item.label"
                  active-class="blue--text"
                  class="mb-2"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.label }} </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-checkbox
                        :input-value="active"
                        color="blue"
                      ></v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-list>
              <p class="mb-2 mt-4 grey--text text--darken-1">
                DB_CR (Débito - Crédito)
              </p>
              <v-list-item-group
                v-model="db_cr"
                multiple
                class="mx-2"
                @change="setDbCr(db_cr.toString())"
              >
                <v-list-item
                  v-for="item in itemsDbCr"
                  :key="item.id"
                  :value="item.id"
                  active-class="blue--text"
                  class="mb-2"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.label }} </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-checkbox
                        :input-value="active"
                        color="blue"
                      ></v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-btn text class="text-capitalize mt-10" @click="resetFilter()"
              >Limpiar
            </v-btn>

            <v-btn
              block
              class="mt-6 mb-5"
              color="primary font-weight-bold body-1"
              large
              dark
              @click="getBancoData()"
              >FILTRAR
            </v-btn>
          </v-tab-item>

          <!-- TAB CONCILIAR TRANSFERENCIAS -->
          <v-tab-item class="pa-3">
            <div class="my-3">
              <span>Fecha de <strong>inicio</strong>:</span>
              <v-chip small class="font-weight-medium mx-2">
                {{ fechaInicioFormat }}
              </v-chip>
            </div>
            <v-card>
              <v-date-picker
                v-model="fechaInicioConciliacion"
                locale="es"
                no-title
              ></v-date-picker>
            </v-card>
            <div class="mt-3 mb-3">
              <span>Fecha de <strong>finalización</strong>:</span>
              <v-chip small class="mx-2 font-weight-medium">
                {{ fechaFinFormat }}
              </v-chip>
            </div>
            <v-card>
              <v-date-picker
                v-model="fechaFinConciliacion"
                locale="es"
                no-title
                color="red"
              ></v-date-picker>
            </v-card>

            <v-menu v-model="menu" :close-on-content-click="false" offset-y top>
              <template v-slot:activator="{ on }">
                <v-btn
                  block
                  outlined
                  class="mt-8 font-weight-bold"
                  v-on="on"
                  :loading="loading"
                  >Conciliar
                  <v-icon class="mx-2"
                    >mdi-format-horizontal-align-right</v-icon
                  >
                </v-btn>
              </template>

              <v-card class="grey lighten-5">
                <v-card-title class="text-subtitle-1"
                  >Desea realizar la conciliación?</v-card-title
                >
                <v-card-actions>
                  <v-btn
                    text
                    @click="menu = false"
                    small
                    class="text-capitalize body-2"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn @click="conciliarTransferencias" small outlined>
                    Si, continuar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-tab-item>

          <v-tab-item class="pa-3">
            <v-menu
              v-model="menuProcesar"
              :close-on-content-click="false"
              offset-y
              top
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  block
                  outlined
                  class="mt-8 font-weight-bold"
                  v-on="on"
                  :loading="loading"
                  >PROCESAR
                  <v-icon class="mx-2">mdi-autorenew</v-icon>
                </v-btn>
              </template>

              <v-card class="grey lighten-5">
                <v-card-title class="text-subtitle-1"
                  >Desea procesar los movimientos?</v-card-title
                >
                <v-card-actions>
                  <v-btn
                    text
                    @click="menuProcesar = false"
                    small
                    class="text-capitalize body-2"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn @click="procesarMovimientos()" small outlined>
                    Si, continuar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </Drawer>

    <!-- CONTENTIDO PAGE MAIN -->
    <v-main class="mx-8">
      <!--FILTRO FECHA-->
      <v-row class="mt-2">
        <v-col
          cols="12"
          lg="10"
          xl="7"
          class="d-flex align-center"
          style="gap: 10px"
        >
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="formatDate(fechaInicio)"
                label="Fecha inicio"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                style="max-width: 170px"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date1"
              @input="menu1 = false"
              @change="setFechaInicio(date1)"
              locale="es"
              :max="limitarFechas.max"
            ></v-date-picker>
          </v-menu>

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
                style="max-width: 170px"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date2"
              @input="menu2 = false"
              locale="es"
              @change="setFechaFin(date2)"
              :max="limitarFechas.max"
            ></v-date-picker>
          </v-menu>

          <v-text-field
            label="Buscador"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>

          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item link @click="setDrawer(true)">
                <v-list-item-icon>
                  <v-icon>mdi-plus-box-multiple</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Más acciones</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn
            class="blue white--text ml-8"
            @click="
              {
                setNumber(1);
                getBancoData();
              }
            "
          >
            <v-icon left>mdi-filter-variant</v-icon> Filtrar
          </v-btn>
        </v-col>
      </v-row>

      <v-subheader class="font-weight-bold" v-if="!loadingTable"
        >Bancos
      </v-subheader>

      <!--TABLA DE TRANSACCIONES-->
      <TableBanco class="mb-4" />
    </v-main>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
import TableBanco from "@/components/TableBanco.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { formatDate } from "@/helpers";
import moment from "moment";
import bancoService from "@/services/banco";
import Drawer from "../components/Drawer.vue";

export default {
  name: "BancoView",
  components: {
    Dashboard,
    TableBanco,
    Drawer,
  },
  data() {
    return {
      date1: null,
      date2: null,
      fechaInicioConciliacion: moment().format("yyyy-MM-DD"),
      fechaFinConciliacion: moment().format("yyyy-MM-DD"),
      tab: 0,
      menu: false,
      menuProcesar: false,

      formatDate: formatDate,

      limitarFechas: {
        max: new Date().toISOString().substr(0, 10),
      },

      menu1: false,
      menu2: false,

      tipoMovimiento: [],
      db_cr: [],
      itemsTipoMovimiento: [
        { label: "522 - Prisma", id: 522 },
        { label: "17 - Transferencia", id: 17 },
        { label: "17 - Debin", id: 17 },
        { label: "84 - Rapipago", id: 84 },
        { label: "523 - Reversion", id: 523 },
        { label: "202 - Transferencia revertida", id: 202 },
      ],
      itemsDbCr: [
        { id: 1, label: "1 - Débito" },
        { id: 2, label: "2 - Crédito" },
      ],

      loading: false,
    };
  },
  mounted() {
    this.date1 = moment(this.fechaInicio).format("YYYY-MM-DD");

    this.reset();
    this.getBancoData();
  },
  methods: {
    ...mapActions([
      "getBancoData",
      "setFechaInicio",
      "setFechaFin",
      "setTipoMovimiento",
      "setDbCr",
      "setNumber",
      "setDrawer",
    ]),

    ...mapMutations(["reset"]),

    async conciliarTransferencias() {
      const fechaInicio = moment(this.fechaInicioConciliacion);
      const fechaFin = moment(this.fechaFinConciliacion);
      //validaciones

      //fecha de inicio mayor a fecha fin
      if (fechaInicio.isAfter(fechaFin)) {
        const error = "La fecha de inicio no puede ser mayor a la fecha fin.";
        return this.$toast.error(error);
      }

      // rango superior a 1 mes
      if (fechaFin.diff(fechaInicio, "days") >= 31) {
        const error = "El rango de fechas no puede ser mayor a 1 mes.";
        return this.$toast.error(error);
      }

      try {
        const params = {
          FechaInicio: this.fechaInicioConciliacion + "T00:00:00.000Z",
          FechaFin: this.fechaFinConciliacion + "T23:59:59.999Z",
        };

        this.menu = false;
        this.loading = true;
        await bancoService.conciliacionTransferencia(params);

        this.loading = false;
        this.$swal.fire({
          text: "Conciliación de transferencias exitosa! ",
          icon: "success",
        });
      } catch (error) {
        console.error(error);
        this.$toast.error("No se pudo realizar la conciliación");
        this.loading = false;
      }
    },

    async procesarMovimientos() {
      try {
        this.menuProcesar = false;
        this.loading = true;
        const data = await bancoService.procesarMovimientos();
        this.loading = false;

        if (data.data.archivos_procesados === 0) throw data.data.log_error;

        this.$toast.success(
          "Cantidad de archivos procesados: ",
          data.data.archivos_procesados
        );
      } catch (error) {
        this.loading = false;
        const errorMsj = error?.response?.data?.message || error;
        this.$toast.error(errorMsj);
        console.error("error", error);
      }
    },

    resetFilter() {
      this.db_cr = [];
      this.tipoMovimiento = [];
    },
  },

  computed: {
    ...mapGetters(["fechaInicio", "fechaFin", "loadingTable"]),

    fechaInicioFormat() {
      return this.fechaInicioConciliacion
        ? moment(this.fechaInicioConciliacion).format("DD-MM-YYYY")
        : "";
    },
    fechaFinFormat() {
      return this.fechaFinConciliacion
        ? moment(this.fechaFinConciliacion).format("DD-MM-YYYY")
        : "";
    },

    search: {
      get() {
        return this.$store.getters["search"];
      },
      set(newSearch) {
        this.$store.dispatch("setSearch", newSearch);
      },
    },
  },
};
</script>

<style scoped></style>
