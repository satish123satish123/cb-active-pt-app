<template>
  <div class="section">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
      <!-- Reset PIN -->
      <button class="card action-btn" @click="$router.push('/profile/reset-pin')">
        <div class="action-icon" style="background: #edf5f3; color: var(--brand)">🔐</div>
        <div style="font-size: 15px; font-weight: 800">Reset PIN</div>
      </button>

      <!-- Call Clinic -->
      <button class="card action-btn">
        <div class="action-icon" style="background: #edf5f3; color: var(--brand)">📞</div>
        <div style="font-size: 15px; font-weight: 800">Call Clinic</div>
      </button>
    </div>
  </div>
</template>

<script setup>
// presentational
</script>

<style scoped>
.action-btn {
  padding: 16px 14px;
  text-align: center;
  border: none;
  cursor: pointer;
}
.action-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 12px;
}
</style>
