<template>
  <div :class="['card', cardClass]">
    <div class="title-row">
      <div style="flex: 1">
        <q-skeleton type="text" width="60%" height="24px" class="q-mb-sm" />
        <q-skeleton type="text" width="40%" height="16px" />
      </div>
      <q-skeleton type="rect" width="80px" height="24px" style="border-radius: 12px" />
    </div>
    <div class="progress-wrap" style="margin-top: 16px">
      <div class="split">
        <q-skeleton type="text" width="30%" />
        <q-skeleton type="text" width="15%" />
      </div>
      <q-skeleton type="rect" height="12px" style="border-radius: 6px; margin-top: 8px" />
    </div>
    <div style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
      <q-skeleton type="rect" height="40px" style="border-radius: 8px" />
      <q-skeleton type="rect" height="40px" style="border-radius: 8px" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  cardClass: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* Any specific styles if needed, though they mostly inherit from Dashboard classes */
</style>
