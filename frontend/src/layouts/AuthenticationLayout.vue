<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'AuthenticationLayout',
}
</script>

<style lang="scss" scoped>
.authentication-layout-container {
  min-height: 100vh;
}
</style>
