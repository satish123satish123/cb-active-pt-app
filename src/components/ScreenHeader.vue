<template>
  <div class="topbar">
    <q-btn class="back-btn" flat round dense icon="arrow_back" @click="$router.back()"></q-btn>
    <div>
      <div class="screen-title">{{ title }}</div>
      <div class="screen-sub">{{ sub }}</div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  title: { type: String, required: true },
  sub: { type: String, default: '' },
})
</script>
