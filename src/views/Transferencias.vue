<template>
  <v-main class="mx-8 py-5">
    <v-subheader class="font-weight-bold mt-2"
      >Transferencia por movimiento_id
    </v-subheader>
    <v-row>
      <v-col cols="8">
        <v-form
          class="py-7 px-10 rounded"
          ref="form"
          style="border: 1px solid #ccc"
        >
          <p class="ma-0">Complete los campos</p>
          <!-- Transferencia bancaria -->
          <v-text-field
            label="Referencia bancaria"
            type="number"
            v-model="referencia_bancaria"
            :rules="[(v) => !!v || 'Referencia bancaria es requerido.']"
          />
          <!-- Numero de conciliacion bancaria -->
          <v-text-field
            label="Numero de conciliacion bancaria"
            type="number"
            v-model="numero_conciliacion_bancaria"
            :rules="[
              (v) => !!v || 'Numero de conciliacion bancaria es requerido.',
            ]"
          />
          <!-- lista -->
          <v-textarea
            class="mt-5"
            label="Movimientos id"
            v-model="lista"
            required
            color="dark"
            filled
          ></v-textarea>
          <!-- -------------------- BOTON TRANSFERIR ------------------------- -->
          <div class="d-flex justify-end mt-6 mb-4">
            <v-btn class="primary mt-8" :loading="loading" @click="transferir"
              >Transferir por movimiento
            </v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import transferenciaService from "@/services/transferencias";
export default {
  name: "Transferencias",
  data: () => ({
    loading: false,

    referencia_bancaria: "",
    numero_conciliacion_bancaria: "",
    lista: [],
  }),
  methods: {
    transferir() {
      if (this.$refs.form.validate()) {
        // realizando validacion del formulario

        // pidiendo al usuario su confirmacion
        this.$swal
          .fire({
            title: "¿Está seguro?",
            text: "Esta acción transferirá los pagos.",
            showDenyButton: true,
            icon: "warning",
            confirmButtonText: "Si, transferir",
            denyButtonText: "Cancelar",
          })
          .then(async ({ isConfirmed }) => {
            // Convert this.lista de string a array de numeros
            const listaArray = this.lista.split(",").map(Number);
            // si se confirma, realizar peticion
            if (isConfirmed) {
              try {
                const body = {
                  referencia_bancaria: this.referencia_bancaria,
                  numero_conciliacion_bancaria:
                    this.numero_conciliacion_bancaria,
                  lista: listaArray,
                };
                this.loading = true;

                const data =
                  await transferenciaService.transferenciaPorMovimiento(body);
                this.loading = false;

                if (!data) this.$toast.warning("Movimientos no encontrados.");
                else {
                  this.$toast.success("Transferencia realizada con éxito.");
                }
              } catch (error) {
                console.error(error);
                this.$toast.error("Error al realizar la transferencia.");
                this.loading = false;
              }
            }
          });
      }
    },
  },
};
</script>

<style scoped></style>
