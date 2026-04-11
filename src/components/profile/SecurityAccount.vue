<template>
  <div class="section">
    <div class="card soft">
      <!-- Section Header -->
      <div class="title-row" style="margin-bottom: 14px">
        <div style="display: flex; align-items: center; gap: 12px">
          <div class="section-icon" style="background: #edf5f3; color: var(--brand)">🔐</div>
          <div>
            <div class="title" style="margin: 0">Security &amp; Account</div>
            <div class="muted">Secure your access and manage sign-in options</div>
          </div>
        </div>
      </div>

      <!-- List rows -->
      <div class="list" style="gap: 0">
        <!-- Reset PIN -->
        <div class="flat-row" style="border-bottom: 1px solid var(--line)">
          <div class="row-left">
            <div class="row-icon" style="background: #edf5f3; color: var(--brand)">🔒</div>
            <div>
              <div class="row-label">Reset PIN</div>
              <div class="muted">Change your 4-digit access PIN</div>
            </div>
          </div>
          <span class="chevron">›</span>
        </div>

        <!-- Linked Phone -->
        <div class="flat-row" style="border-bottom: 1px solid var(--line)">
          <div class="row-left">
            <div class="row-icon" style="background: #edf5f3; color: #2a7da8">📱</div>
            <div>
              <div class="row-label">Linked Phone</div>
              <div class="muted">+91 98100 86624</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px">
            <span style="color: #78a8a2; font-weight: 700">Change</span>
            <span class="chevron">›</span>
          </div>
        </div>

        <!-- Biometric (toggle OFF) -->
        <div class="flat-row">
          <div class="row-left">
            <div class="row-icon" style="background: #f3eefb; color: #7a43d1">🛡️</div>
            <div>
              <div class="row-label">Biometric Login</div>
              <div class="muted">Use fingerprint / face to sign in</div>
            </div>
          </div>
          <!-- OFF toggle -->
          <div>
            <q-toggle size="xl" v-model="biometric" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const biometric = ref(true)
</script>

<style scoped>
.section-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.flat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 0;
  background: transparent;
}
.flat-row:last-child {
  padding-bottom: 0;
}

.row-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.row-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.row-label {
  font-size: 15px;
  font-weight: 800;
}

.chevron {
  font-size: 22px;
  color: var(--text-3);
}
</style>
