<template>
  <div class="section">
    <div class="card" style="text-align: center; padding: 22px 16px">
      <div class="profile-avatar">
        <template v-if="profileData && profileData.img_url">
           <img :src="profileData.img_url" style="width: 100%; height: 100%; border-radius: 26px; object-fit: cover;" />
        </template>
        <template v-else>
           {{ userInitials }}
        </template>
      </div>
      <div class="title">{{ userName }}</div>
      <div class="muted">Patient ID: {{ patientId }}</div>
      <div
        style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 12px"
      >
        <span class="badge brand" v-if="isActive">Active Patient</span>
        <span class="badge" style="background: #fde8ec; color: #c0392b" v-else>Inactive</span>
        <span class="badge success">Profile Updated</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()
const profileData = inject('profileData')

const userName = computed(() => profileData.value?.name || authStore.user?.username || 'Patient')
const patientId = computed(() => profileData.value?.patient_id || authStore.user?.patient || 'Unknown')
const isActive = computed(() => profileData.value?.is_active == '1' || authStore.user?.active == '1')

const userInitials = computed(() => {
  const name = userName.value || 'P'
  return name.charAt(0).toUpperCase()
})
</script>

<style scoped>
.profile-avatar {
  width: 86px;
  height: 86px;
  border-radius: 26px;
  background: var(--grad);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 900;
  margin: 0 auto 14px;
  box-shadow: var(--shadow-md);
}
</style>
