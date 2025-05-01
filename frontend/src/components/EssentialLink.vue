<template>
  <q-item
    clickable
    :to="route"
    class="sidebar-item"
    :class="currentRoute(route) ? 'sidebar-item-active' : ''"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    route: {
      type: String,
      default: null,
    },

    icon: {
      type: String,
      default: '',
    },
  },
  methods: {
    currentRoute(route: string) {
      return route === '/' ? this.$route.path === route : this.$route.path.startsWith(route)
    },
  },
})
</script>
<style lang="scss" scoped>
.sidebar-item {
  color: brown;
  margin: 0px 8px;
}
.sidebar-item:hover {
  color: black;
  margin: 0px 8px;
  border-radius: 5px;
}
.sidebar-item-active {
  background-color: $secondary;
  color: $dark;
  margin: 0px 8px;
  border-radius: 5px;
  font-weight: 700;
  .q-icon {
    color: $dark !important;
  }
  .q-item__label {
    color: $dark !important;
  }
}
</style>
