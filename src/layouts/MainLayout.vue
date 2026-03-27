<template>
  <q-layout 
    view="lHh lpr lFf" 
    class="desktop-constrained"
    container 
  >
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Cleaned up MainLayout for a more app-like experience.
// Removed the default drawer and essential links as requested.
</script>

<style scoped>
/* Mobile app body styling can be placed here or in app.scss */
</style>
