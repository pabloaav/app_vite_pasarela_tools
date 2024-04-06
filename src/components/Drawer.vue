<template>
  <v-navigation-drawer v-model="drawer" temporary absolute right :width="width">
    <div class="pa-5 d-flex flex-column" style="gap: 20px">
      <p class="text-center font-weight-bold ma-0 text-h6">{{ title }}</p>
    </div>

    <slot />

    <template v-slot:append v-if="action">
      <div class="pa-4">
        <v-btn block color="primary" large tile @click="action">filtrar</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    title: String,
    action: Function,
    width: String,
  },
  name: "Drawer",

  computed: {
    drawer: {
      get() {
        return this.$store.getters["drawer"];
      },
      set(newDrawer) {
        this.$store.dispatch("setDrawer", newDrawer);
      },
    },
  },
};
</script>
