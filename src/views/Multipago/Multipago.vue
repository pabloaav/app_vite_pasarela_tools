<template>
  <div>
    <Drawer title="Ejecutar proceso" width="380px">
      <div>
        <EjecutarProceso></EjecutarProceso>
      </div>
    </Drawer>
    <v-main class="mx-8">
      <!-- ------ FILTROS ----- -->
      <v-row align="center" class="mt-2">
        <v-col cols="12" xl="6" class="d-flex align-center" style="gap: 20px">
          <!-- ------------------ FECHA INICIO ------------------ -->
          <v-menu
            ref="menu1"
            v-model="menu1"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            min-width="auto"
            dark
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                prepend-icon="mdi-calendar"
                class="ml-5"
                label="Fecha inicio"
                readonly
                v-bind="attrs"
                v-on="on"
                persistent-hint
                :value="formatDate(fechaInicio)"
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

          <!-- ------------------ FECHA FIN ------------------  -->
          <v-menu
            ref="menu2"
            v-model="menu2"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            min-width="auto"
            dark
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                prepend-icon="mdi-calendar"
                class="ml-5"
                label="Fecha fin"
                readonly
                v-bind="attrs"
                v-on="on"
                persistent-hint
                :value="formatDate(fechaFin)"
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
          <!-- ------------------ CODIGO DE BARRA ------------------ -->
          <v-text-field
            label="Código de barra"
            v-model="codigoBarra"
            prepend-icon="mdi-barcode-scan"
            clearable
            clear-icon="mdi-delete"
            type="number"
            style="max-width: 560px"
          ></v-text-field>
          <!-- ------------------ OPCIONES PUNTOS ------------------  -->
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <!-- ------- opcion: ejecutar proceso ----------- -->
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
          <!-- ----------------- BOTON FILTRO -------------- -->
          <v-btn
            class="blue white--text ml-5"
            @click="
              () => {
                setNumber(1);
                getMultipagoData();
              }
            "
          >
            <v-icon left>mdi-filter-variant</v-icon> Filtrar
          </v-btn>
        </v-col>
      </v-row>

      <!-- ------TABLA MULTIPAGO ------- -->
      <v-subheader class="font-weight-bold"> Multipago </v-subheader>
      <TableMultipago />
    </v-main>
  </div>
</template>

<script>
import TableMultipago from "@/components/Multipago/TableMultipago.vue";
import Drawer from "@/components/Drawer.vue";
import EjecutarProceso from "@/views/Multipago/EjecutarProceso.vue";
import { formatDate } from "@/helpers";
import { mapActions, mapGetters, mapMutations } from "vuex";
import moment from "moment";
import cierre_lote from "@/services/cierre_lote";
export default {
  name: "Multipago",
  components: { TableMultipago, Drawer, EjecutarProceso },
  data() {
    return {
      menu1: false,
      menu2: false,

      date1: null,
      date2: null,

      limitarFechas: {
        max: new Date().toISOString().substr(0, 10),
      },

      loading: false,

      //methods
      formatDate,
      moment,
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
    this.getMultipagoData();
  },

  methods: {
    ...mapActions("cierre_lote", [
      "getMultipagoData",
      "setFechaInicio",
      "setFechaFin",
      "setNumber",
    ]),
    ...mapActions(["setDrawer"]),

    ...mapMutations("cierre_lote", ["reset"]),
  },
};
</script>

<style scoped></style>
