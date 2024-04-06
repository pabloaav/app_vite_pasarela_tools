<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400px" class="elevation-2">
      <v-card>
        <v-toolbar color="blue" dark
          >Actualizar cierre de lote prisma ___ ID: {{ editItem.Id }}</v-toolbar
        >
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="formatDate(fechaCierre)"
                      label="Fecha de cierre"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :hint="
                        'Fecha almacenada: ' + formatDate(editItem.fecha_cierre)
                      "
                      persistent-hint
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fechaCierre"
                    @input="menu = false"
                    locale="es"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  label="En disputa"
                  v-model="editItem.disputa"
                ></v-checkbox>
              </v-col>
              <v-col cols="6">
                <v-checkbox
                  label="En observación"
                  v-model="editItem.enobservacion"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="editarItem">
            Guardar cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "EditPrisma",
  data() {
    return {
      editItem: {
        Id: "",
        fecha_cierre: null,
        disputa: false,
        enobservacion: false,
      },

      fechaCierre: null,
    };
  },
};
</script>
