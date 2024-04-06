<template>
  <v-dialog
    v-model="dialogDetalleMovimiento"
    max-width="80%"
    scrollable
    @click:outside="setDialogDetalleMovimiento(false)"
  >
    <v-card>
      <v-card-title class="text-h5 blue white--text">
        Detalle Prisma
      </v-card-title>
      <v-card-text>
        <div v-if="cargarMovimientos">
          <p class="black--text mt-5 mb-1 text-subtitle-1 font-weight-bold">
            Movimientos (Presentaciones)
          </p>
          <v-data-table
            :headers="headerMovimiento"
            :items="movimientos"
            class="elevation-1"
            hide-default-footer
            no-data-text="Sin registros para mostrar"
            disable-pagination
          >
            <template v-slot:[`item.FechaPresentacion`]="{ item }">
              {{ formatDate(item.FechaPresentacion, true) }}
            </template>
            <template v-slot:[`item.FechaOrigenCompra`]="{ item }">
              {{ formatDate(item.FechaOrigenCompra, true) }}
            </template>
            <template v-slot:[`item.FechaPago`]="{ item }">
              {{ formatDate(item.FechaPago, true) }}
            </template>
            <template v-slot:[`item.FechaPagoOrigenAjuste`]="{ item }">
              {{ formatDate(item.FechaPagoOrigenAjuste, true) }}
            </template>
            <template v-slot:[`item.Importe`]="{ item }">
              {{ formatImport(item.Importe) }}
            </template>
            <template v-slot:[`item.EstadoCab`]="{ item }">
              <v-chip
                :color="item.EstadoCab ? 'green' : 'red'"
                class="white--text"
              >
                {{ item.EstadoDet ? "SI" : "NO" }}
              </v-chip>
            </template>
            <template v-slot:[`item.EstadoDet`]="{ item }">
              <v-chip
                :color="item.EstadoDet ? 'green' : 'red'"
                class="white--text"
              >
                {{ item.EstadoDet ? "SI" : "NO" }}
              </v-chip>
            </template>
          </v-data-table>
        </div>

        <div v-if="cargarPagos" class="mt-8">
          <p class="black--text mt-5 mb-1 text-subtitle-1 font-weight-bold">
            Pagos (Liquidaciones)
          </p>
          <v-data-table
            :headers="headerPago"
            :items="pagos"
            class="elevation-1"
            hide-default-footer
            no-data-text="Sin registros para mostrar"
            disable-pagination
          >
            <template v-slot:[`item.FechaPresentacion`]="{ item }">
              {{ formatDate(item.FechaPresentacion, true) }}
            </template>
            <template v-slot:[`item.FechaPago`]="{ item }">
              {{ formatDate(item.FechaPago, true) }}</template
            >
            <template v-slot:[`item.ImporteBruto`]="{ item }">
              {{ formatImport(item.ImporteBruto) }}</template
            >
            <template v-slot:[`item.ImporteArancel`]="{ item }">
              {{ formatImport(item.ImporteArancel) }}</template
            >
            <template v-slot:[`item.ImporteNeto`]="{ item }">
              {{ formatImport(item.ImporteNeto) }}</template
            >
          </v-data-table>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="black"
          class="font-weight-bold"
          text
          @click="setDialogDetalleMovimiento(false)"
          >Aceptar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { formatDate, formatImport } from "@/helpers";
export default {
  name: "DetallePrisma",
  props: {
    movimientos: Array,
    pagos: Array,
  },
  data() {
    return {
      headerMovimiento: [
        { text: "MovCabeceraId", value: "MovCabeceraId", sortable: false },
        { text: "MovDetalleId", value: "MovDetalleId", sortable: false },
        {
          text: "FechaOrigenCompra",
          value: "FechaOrigenCompra",
          sortable: false,
        },
        {
          text: "FechaPresentacion",
          value: "FechaPresentacion",
          sortable: false,
        },
        {
          text: "FechaPago",
          value: "FechaPago",
          sortable: false,
          width: "120px",
        },
        {
          text: "Empresa",
          value: "Empresa",
          sortable: false,
        },
        {
          text: "ComercioNro",
          value: "ComercioNro",
          sortable: false,
        },
        {
          text: "EstablecimientoNro",
          value: "EstablecimientoNro",
          sortable: false,
        },
        {
          text: "Codop",
          value: "Codop",
          sortable: false,
        },
        {
          text: "ImporteTotal",
          value: "ImporteTotal",
          sortable: false,
        },
        {
          text: "SignoImporteTotal",
          value: "SignoImporteTotal",
          sortable: false,
        },
        {
          text: "TipoRegistro",
          value: "TipoRegistro",
          sortable: false,
        },
        {
          text: "TipoAplicacion",
          value: "TipoAplicacion",
          sortable: false,
        },
        {
          text: "Lote",
          value: "Lote",
          sortable: false,
        },
        {
          text: "NroCupon",
          value: "NroCupon",
          sortable: false,
        },
        {
          text: "Importe",
          value: "Importe",
          sortable: false,
        },
        {
          text: "SignoImporte",
          value: "SignoImporte",
          sortable: false,
        },
        {
          text: "NroCuota",
          value: "NroCuota",
          sortable: false,
        },
        {
          text: "PlanCuota",
          value: "PlanCuota",
          sortable: false,
        },
        {
          text: "NroLiquidacion",
          value: "NroLiquidacion",
          sortable: false,
        },
        {
          text: "ContracargoOrigen",
          value: "ContracargoOrigen",
          sortable: false,
        },
        {
          text: "Moneda",
          value: "Moneda",
          sortable: false,
        },
        {
          text: "IdCf",
          value: "IdCf",
          sortable: false,
          width: "220px",
        },
        {
          text: "CfExentoIva",
          value: "CfExentoIva",
          sortable: false,
          width: "170px",
        },
        {
          text: "FechaPagoOrigenAjuste",
          value: "FechaPagoOrigenAjuste",
          sortable: false,
        },
        {
          text: "PorcentDescArancel",
          value: "PorcentDescArancel",
          sortable: false,
        },
        {
          text: "Arancel",
          value: "Arancel",
          sortable: false,
        },
        {
          text: "SignoArancel",
          value: "SignoArancel",
          sortable: false,
        },
        {
          text: "TnaCf",
          value: "TnaCf",
          sortable: false,
        },
        {
          text: "ImporteCostoFinanciero",
          value: "ImporteCostoFinanciero",
          sortable: false,
        },
        {
          text: "SignoImporteCostoFinanciero",
          value: "SignoImporteCostoFinanciero",
          sortable: false,
        },
        {
          text: "BanderaEstablecimiento",
          value: "BanderaEstablecimiento",
          sortable: false,
        },
        {
          text: "NroAutorizacionXl",
          value: "NroAutorizacionXl",
          sortable: false,
        },
        {
          text: "Contracargovisa",
          value: "Contracargovisa",
          sortable: false,
          width: "200px",
        },
        {
          text: "Contracargomaster",
          value: "Contracargomaster",
          sortable: false,
          width: "200px",
        },
        {
          text: "Tipooperacion",
          value: "Tipooperacion",
          sortable: false,
          width: "240px",
        },
        {
          text: "Rechazotransaccionprincipal",
          value: "Rechazotransaccionprincipal",
          sortable: false,
        },
        {
          text: "Rechazotransaccionsecundario",
          value: "Rechazotransaccionsecundario",
          sortable: false,
        },
        {
          text: "Motivoajuste",
          value: "Motivoajuste",
          sortable: false,
          width: "200px",
        },
        {
          text: "EstadoCab",
          value: "EstadoCab",
          sortable: false,
        },
        {
          text: "EstadoDet",
          value: "EstadoDet",
          sortable: false,
        },
      ],

      headerPago: [
        { text: "PagoCabeceraId", value: "PagoCabeceraId", sortable: false },
        { text: "PagoDetalleId", value: "PagoDetalleId", sortable: false },
        { text: "Empresa", value: "Empresa", sortable: false },
        {
          text: "FechaPresentacion",
          value: "FechaPresentacion",
          sortable: false,
        },
        {
          text: "FechaPago",
          value: "FechaPago",
          sortable: false,
          width: "120px",
        },
        { text: "TipoRegistro", value: "TipoRegistro", sortable: false },
        { text: "Moneda", value: "Moneda", sortable: false },
        { text: "ComercioNro", value: "ComercioNro", sortable: false },
        {
          text: "EstablecimientoNro",
          value: "EstablecimientoNro",
          sortable: false,
        },
        { text: "LiquidacionNro", value: "LiquidacionNro", sortable: false },
        { text: "LiquidacionTipo", value: "LiquidacionTipo", sortable: false },
        { text: "RetencionSello", value: "RetencionSello", sortable: false },
        {
          text: "SignoRetencionSello",
          value: "SignoRetencionSello",
          sortable: false,
        },
        {
          text: "ProvinciaRetencionSello",
          value: "ProvinciaRetencionSello",
          sortable: false,
        },
        { text: "ImporteBruto", value: "ImporteBruto", sortable: false },
        {
          text: "SignoImporteBruto",
          value: "SignoImporteBruto",
          sortable: false,
        },
        { text: "ImporteArancel", value: "ImporteArancel", sortable: false },
        {
          text: "SignoImporteArancel",
          value: "SignoImporteArancel",
          sortable: false,
        },
        {
          text: "ImporteNeto",
          value: "ImporteNeto",
          sortable: false,
        },
        {
          text: "SignoImporteNeto",
          value: "SignoImporteNeto",
          sortable: false,
        },
        {
          text: "RetencionEspecialSobreIibb",
          value: "RetencionEspecialSobreIibb",
          sortable: false,
        },
        {
          text: "SignoRetencionEspecial",
          value: "SignoRetencionEspecial",
          sortable: false,
        },
        {
          text: "RetencionIvaEspecial",
          value: "RetencionIvaEspecial",
          sortable: false,
        },
        {
          text: "SignoRetencionIvaEspecial",
          value: "SignoRetencionIvaEspecial",
          sortable: false,
        },
        {
          text: "PercepcionIngresoBruto",
          value: "PercepcionIngresoBruto",
          sortable: false,
        },
        {
          text: "SignoPercepcionIb",
          value: "SignoPercepcionIb",
          sortable: false,
        },
        {
          text: "RetencionIvaD1",
          value: "RetencionIvaD1",
          sortable: false,
        },
        {
          text: "SignoRetencionIva_d1",
          value: "SignoRetencionIva_d1",
          sortable: false,
        },
        {
          text: "CostoCuotaEmitida",
          value: "CostoCuotaEmitida",
          sortable: false,
        },
        {
          text: "SignoCostoCuotaEmitida",
          value: "SignoCostoCuotaEmitida",
          sortable: false,
        },
        {
          text: "RetencionIvaCuota",
          value: "RetencionIvaCuota",
          sortable: false,
        },
        {
          text: "SignoRetencionIvaCuota",
          value: "SignoRetencionIvaCuota",
          sortable: false,
        },
        {
          text: "RetencionIva",
          value: "RetencionIva",
          sortable: false,
        },
        {
          text: "SignoRetencionIva",
          value: "SignoRetencionIva",
          sortable: false,
        },
        {
          text: "RetencionGanacias",
          value: "RetencionGanacias",
          sortable: false,
        },
        {
          text: "SignoRetencionGanacias",
          value: "SignoRetencionGanacias",
          sortable: false,
        },
        {
          text: "RetencionIngresoBruto",
          value: "RetencionIngresoBruto",
          sortable: false,
        },
        {
          text: "SignoRetencionIngresoBruto",
          value: "SignoRetencionIngresoBruto",
          sortable: false,
        },
      ],
      formatDate,
      formatImport,
    };
  },
  computed: {
    ...mapGetters("cierre_lote", ["cargarPagos", "cargarMovimientos"]),
    dialogDetalleMovimiento: {
      get() {
        return this.$store.state.cierre_lote.dialogDetalleMovimiento;
      },
      set(value) {
        this.setDialogDetalleMovimiento(value);
      },
    },
  },
  methods: {
    ...mapActions("cierre_lote", ["setDialogDetalleMovimiento"]),
  },
};
</script>
