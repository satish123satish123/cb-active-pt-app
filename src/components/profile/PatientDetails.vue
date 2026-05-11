<template>
  <div class="section">
    <div class="card soft">
      <!-- Section Header -->
      <div class="title-row" style="margin-bottom:14px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div class="section-icon" style="background:#edf5f3;color:var(--brand);">👤</div>
          <div>
            <div class="title" style="margin:0;">Patient Details</div>
            <div class="muted">Basic information linked to your care profile</div>
          </div>
        </div>
      </div>

      <!-- KV rows -->
      <div class="kv" style="margin-top:4px;">
        <div class="kv-row">
          <div class="kv-key">Phone</div>
          <div class="kv-val">+{{ countryCode }} {{ phone }}</div>
        </div>
        <div class="kv-row">
          <div class="kv-key">Email</div>
          <div class="kv-val">{{ email }}</div>
        </div>
        <div class="kv-row">
          <div class="kv-key">Preferred Clinic</div>
          <div class="kv-val">{{ clinicName }}</div>
        </div>
        <div class="kv-row">
          <div class="kv-key">Address</div>
          <div class="kv-val">{{ address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()
const profileData = inject('profileData')

const phone = computed(() => profileData.value?.phone || authStore.user?.phone || 'Not provided')
const countryCode = computed(() => profileData.value?.country_code || authStore.user?.country_code || '91')
const email = computed(() => profileData.value?.email || authStore.user?.email || 'Not provided')
const clinicName = computed(() => profileData.value?.clinic_name || authStore.user?.clinic_name || 'CB Physiotherapy')
const address = computed(() => profileData.value?.address || authStore.user?.address || 'Not provided')
</script>

<style scoped>
.section-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
</style>
