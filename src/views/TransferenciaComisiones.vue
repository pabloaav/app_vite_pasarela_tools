<template>
  <v-main class="mx-8">
    <v-row>
      <v-col>
        <v-subheader class="font-weight-bold mt-2">
          Transferencias de comisiones
        </v-subheader>

        <div
          class="py-7 px-10 rounded"
          style="border: 1px solid #ccc; max-width: 410px"
        >
          <span class="mx-3">SELECCIONE UNA FECHA: </span>
          <v-chip small class="ml-2 font-weight-medium mb-2">
            {{ formatFecha }}
          </v-chip>
          <v-date-picker
            class="ml-4 mb-3"
            elevation="1"
            v-model="fecha"
            locale="es"
            color="teal"
          ></v-date-picker>

          <v-btn
            class="mt-6"
            outlined
            block
            :loading="loading"
            @click="transferirComisones"
            >transferir
          </v-btn>
        </div>
      </v-col>

      <v-col>
        <v-subheader class="font-weight-bold mt-2">
          Transferencias de clientes
        </v-subheader>
        <v-form
          class="py-7 px-10 rounded"
          ref="form"
          style="border: 1px solid #ccc"
        >
          <v-select
            :items="clientes"
            v-model="clienteId"
            :rules="[(v) => !!v || 'Debe seleccionar un cliente']"
            item-value="id"
            item-text="cliente"
            label="Cliente"
            class="mt-4"
          ></v-select>
          <v-btn
            class="mt-6"
            outlined
            block
            :loading="loading2"
            @click="transferirClientes"
            >transferir
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import transferenciaService from "@/services/transferencias";
import reportesServices from "@/services/reportes";
import { formatDate } from "@/helpers";
export default {
  name: "TransferenciaComisiones",
  data: () => ({
    loading: false,
    loading2: false,
    //transferencia de comisiones
    fecha: null,
    formatDate,
    //trasnferencia de clientes
    clientes: null,
    clienteId: null,
  }),
  computed: {
    formatFecha() {
      return this.fecha ? formatDate(this.fecha) : "";
    },
  },
  mounted() {
    this.getClientes();
  },
  methods: {
    transferirComisones() {
      if (!this.fecha) {
        return this.$swal.fire({
          title: "Campo obligatorio",
          text: "Debe seleccionar una fecha",
          icon: "error",
        });
      }

      // pidiendo comfirmación al usuario
      this.$swal
        .fire({
          title: "¿Está seguro?",
          text: "Esta acción transferirá las comisiones",
          icon: "warning",
          showDenyButton: true,
          confirmButtonText: "Si, Transfererir",
          denyButtonText: "Cancelar",
        })
        .then(async (result) => {
          // si el usuario confirma llamada al endpoint
          if (result.isConfirmed) {
            try {
              const params = {
                fecha_inicio: this.fecha + "T00:00:00-03:00",
                fecha_fin: this.fecha + "T00:00:00-03:00",
                retiro_automatico: true,
              };

              this.loading = true;

              const { resultado } =
                await transferenciaService.transferenciasComisiones(params);

              this.loading = false;
              this.$toast.success(resultado.resultado);
            } catch (error) {
              this.$toast.error("Error al transferir comisiones.");
              this.loading = false;
            }
          }
        });
    },
    async getClientes() {
      const params = {
        CargarImpuestos: false,
        CargarCuentas: false,
        CargarRubros: false,
      };

      const { data } = await reportesServices.obtenerClientes(params);

      this.clientes = data;
    },
    transferirClientes() {
      if (this.$refs.form.validate()) {
        // pidiendo comfirmación al usuario
        this.$swal
          .fire({
            title: "¿Está seguro?",
            text: "Esta acción realizará la transferencias de clientes",
            icon: "warning",
            showDenyButton: true,
            confirmButtonText: "Si, Transfererir",
            denyButtonText: "Cancelar",
          })
          .then(async ({ isConfirmed }) => {
            // si el usuario confirma llamada al endpoint
            if (isConfirmed) {
              try {
                const params = {
                  Id: this.clienteId,
                };

                this.loading2 = true;

                const { message } =
                  await transferenciaService.transferenciasClientes(params);

                this.loading2 = false;

                this.$toast.success(message);
              } catch (error) {
                this.$toast.error(
                  "Error al realizar transferencias automáticas de clientes."
                );
                this.loading2 = false;
              }
            }
          });
      }
    },
  },
};
</script>
