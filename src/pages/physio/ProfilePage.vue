<template>
  <section class="screen">
    <!-- Hero / Header -->
    <div class="hero" style="padding-bottom: 50px;">
      <div class="hero-row">
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="icon-btn" @click="$router.push('/physio')">◀</button>
          <div>
            <h5 class="q-ma-none text-weight-bold">My Profile</h5>
            <div class="subtle">Account & professional settings</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Stack -->
    <div class="stack" style="margin-top: -30px; padding: 0 16px; display: flex; flex-direction: column; gap: 16px;">
      
      <!-- Doctor Profile Card -->
      <div class="card" style="text-align: center; padding: 24px 16px;">
        <div style="width: 80px; height: 80px; background: var(--brand-3); color: var(--brand); font-size: 32px; font-weight: 800; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; border: 3px solid #fff; box-shadow: var(--shadow-sm);">
          {{ doctorInitial }}
        </div>
        <div style="font-weight: 800; font-size: 18px; color: var(--text);">
          Dr. {{ authStore.user?.username || 'Therapist' }}
        </div>
        <div class="muted" style="font-size: 13px; margin-top: 2px;">
          Senior Physiotherapist
        </div>
      </div>

      <!-- Professional Details -->
      <div class="card">
        <div class="title" style="font-size: 15px; margin-bottom: 12px; color: var(--brand);">Professional Info</div>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span class="muted">Department</span>
            <span style="font-weight: 700; color: var(--text);">Orthopedics & Sports</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span class="muted">License/Reg No.</span>
            <span style="font-weight: 700; color: var(--text);">PT-103928</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span class="muted">Active Hospital ID</span>
            <span style="font-weight: 700; color: var(--text);">{{ authStore.user?.hospital_id || 'HMS-GK-II' }}</span>
          </div>
        </div>
      </div>

      <!-- Contact Details -->
      <div class="card">
        <div class="title" style="font-size: 15px; margin-bottom: 12px; color: var(--brand);">Contact Details</div>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span class="muted">Email</span>
            <span style="font-weight: 700; color: var(--text);">{{ authStore.user?.email || 'physio@curebooth.in' }}</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span class="muted">Phone</span>
            <span style="font-weight: 700; color: var(--text);">{{ authStore.user?.phone || '+91 9999999999' }}</span>
          </div>
        </div>
      </div>

      <!-- Sign Out Button -->
      <div>
        <button class="btn full signout-btn" @click="onLogout">↪ Sign Out</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const doctorInitial = computed(() => {
  const name = authStore.user?.username || 'T'
  return name.charAt(0).toUpperCase()
})

const onLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.signout-btn {
  background: #fff;
  color: #d63f1e;
  border: 1.5px solid #f0c3ba;
  font-size: 16px;
  font-weight: 800;
  padding: 12px;
  border-radius: var(--radius-sm);
  width: 100%;
}
</style>
