<template>
  <div class="section">
    <div class="card" style="text-align: center; padding: 22px 16px">
      <div class="profile-avatar">
        {{ userInitials }}
      </div>
      <div class="title">{{ authStore.user?.username || 'Patient' }}</div>
      <div class="muted">Patient ID: {{ authStore.user?.patient || 'Unknown' }}</div>
      <div
        style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 12px"
      >
        <span class="badge brand" v-if="authStore.user?.active == '1'">Active Patient</span>
        <span class="badge" style="background: #fde8ec; color: #c0392b" v-else>Inactive</span>
        <span class="badge success">Profile Updated</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.username || 'P'
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
