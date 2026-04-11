<template>
  <div class="section">
    <div class="card soft">
      <!-- Section Header -->
      <div class="title-row" style="margin-bottom: 14px">
        <div style="display: flex; align-items: center; gap: 12px">
          <div class="section-icon" style="background: #f1f1f1; color: #444">⚙️</div>
          <div>
            <div class="title" style="margin: 0">App Preferences</div>
            <div class="muted">Personalize your app experience</div>
          </div>
        </div>
      </div>

      <div class="list" style="gap: 0">
        <!-- Exercise Reminders (toggle ON) -->
        <div class="flat-row" style="border-bottom: 1px solid var(--line)">
          <div class="row-left">
            <div class="row-icon" style="background: #edf5f3; color: var(--brand)">🔔</div>
            <div>
              <div class="row-label">Exercise Reminders</div>
              <div class="muted">Daily push notifications</div>
            </div>
          </div>
          <div>
            <q-toggle size="xl" v-model="reminders" />
          </div>
        </div>

        <!-- Language -->
        <div class="flat-row">
          <div class="row-left">
            <div class="row-icon" style="background: #f3f3f3; color: #333">🌐</div>
            <div>
              <div class="row-label">Language</div>
              <div class="muted">App display language</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px">
            <span style="color: #78a8a2; font-weight: 700">English</span>
            <span class="chevron">›</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const reminders = ref(true)
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

/* Toggle */
.toggle {
  width: 56px;
  height: 32px;
  border-radius: 999px;
  position: relative;
  flex-shrink: 0;
}
.toggle.on {
  background: var(--grad);
}
.toggle.off {
  background: #d9e7e4;
}
.toggle-thumb {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 3px;
  box-shadow: var(--shadow-sm);
}
.toggle.on .toggle-thumb {
  right: 3px;
}
.toggle.off .toggle-thumb {
  left: 3px;
}
</style>
