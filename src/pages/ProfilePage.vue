<template>
  <q-page class="profile-page q-pa-md q-pb-xl">
    
    <!-- Profile Banner & Avatar -->
    <div class="hero-profile-banner scale-in">
      <div class="banner-bg">
        <div class="deco-circle circle-1"></div>
        <div class="deco-circle circle-2"></div>
        <div class="deco-circle circle-3"></div>
      </div>
      
      <div class="avatar-wrapper flex flex-center">
        <div class="avatar-ring-container">
          <q-avatar size="105px" class="avatar-glow">
            <img :src="avatarUrl" />
          </q-avatar>
          <div class="avatar-ring"></div>
        </div>
      </div>
    </div>

    <!-- User Info Card -->
    <div class="user-info-section text-center scale-in-delay-1">
      <div class="user-name">{{ authStore.user?.username || 'Guest' }}</div>
      <div class="user-id">Patient ID: <span>#{{ authStore.user?.patient || 'Unknown' }}</span></div>
      
      <div class="active-plan-pill q-mt-sm">
        <span class="pulse-dot"></span>
        <span class="pill-text">Active Plan: Pro</span>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="row justify-between q-mt-xl q-mb-lg scale-in-delay-2 q-gutter-x-sm">
      <div class="col" v-for="(stat, index) in stats" :key="index">
        <div class="glass-stat-card text-center q-pa-md">
          <div class="text-h5 text-weight-bolder tracking-tight" style="color: #0A7E6E">{{ stat.value }}</div>
          <div class="text-caption text-grey-7 text-uppercase text-weight-bold q-mt-xs" style="font-size: 0.65rem;">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Action Sections (Settings/Lists) -->
    <div class="q-mt-xl scale-in-delay-3">
      <div class="text-subtitle2 text-grey-6 text-uppercase text-weight-bold q-mb-md" style="letter-spacing: 1px;">My Account</div>
      
      <q-list class="glass-list-card q-mb-xl">
        <q-item clickable v-ripple class="q-pa-md" to="/profile/personal-info">
          <q-item-section avatar>
            <q-avatar style="background: rgba(10,126,110,0.1); color: #0A7E6E" icon="person" size="md" />
          </q-item-section>
          <q-item-section class="text-weight-bold text-dark text-body1">Personal Information</q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
        <q-separator inset />
        
        <q-item clickable v-ripple class="q-pa-md" to="/profile/reset-pin">
          <q-item-section avatar>
            <q-avatar style="background: rgba(10,126,110,0.1); color: #0A7E6E" icon="lock_reset" size="md" />
          </q-item-section>
          <q-item-section class="text-weight-bold text-dark text-body1">Reset PIN</q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Logout Button -->
      <q-btn
        unelevated
        class="full-width logout-btn scale-in-delay-3"
        size="lg"
        no-caps
        @click="onLogout"
      >
        <div class="row flex-center">
          <q-icon name="logout" color="negative" class="q-mr-sm" size="20px" />
          <span class="text-weight-bold text-negative">Log Out</span>
        </div>
      </q-btn>
    </div>

    <!-- Bottom Nav Padding -->
    <div style="height: 100px;"></div>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref([
  { label: 'Workouts', value: '42' },
  { label: 'Active Mins', value: '840' },
  { label: 'Level', value: 'Pro' }
])

const avatarUrl = computed(() => {
  const name = authStore.user?.username || 'Guest'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A7E6E&color=fff&size=200`
})

const onLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

.profile-page {
  font-family: 'Sora', sans-serif;
  background: linear-gradient(170deg, #eaf8f3 0%, #f4fbf8 50%, #edf9f5 100%);
  min-height: 100vh;
}

/* Typography */
.tracking-tight {
  letter-spacing: -0.5px;
}

/* Animations */
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.scale-in {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.scale-in-delay-1 {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
}

.scale-in-delay-2 {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
}

.scale-in-delay-3 {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
  opacity: 0;
}

/* Hero Profile Banner */
.hero-profile-banner {
  position: relative;
  height: 140px;
  margin-top: 10px;
}

.banner-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 32px;
  background: linear-gradient(145deg, #0c9b80 0%, #0A7E6E 60%, #087a68 100%);
  box-shadow: 0 18px 40px rgba(10, 126, 110, 0.25);
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.circle-1 { top: -60px; right: -40px; width: 180px; height: 180px; background: rgba(255,255,255,0.06); }
.circle-2 { bottom: -40px; left: -20px; width: 120px; height: 120px; background: rgba(255,255,255,0.04); }
.circle-3 { top: 20px; left: 60px; width: 50px; height: 50px; background: rgba(255,255,255,0.08); }

/* Avatar Focus */
.avatar-wrapper {
  position: absolute;
  bottom: -55px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.avatar-ring-container {
  position: relative;
  border-radius: 50%;
  padding: 6px;
  background: white;
  box-shadow: 0 16px 35px rgba(10, 126, 110, 0.2);
}

.avatar-glow {
  border-radius: 50%;
  overflow: hidden;
}

.avatar-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px dashed rgba(10, 126, 110, 0.3);
  animation: spinSlow 20s linear infinite;
  pointer-events: none;
}

@keyframes spinSlow {
  100% { transform: rotate(360deg); }
}

/* User Info Section */
.user-info-section {
  padding-top: 64px;
  margin-bottom: 24px;
}

.user-name {
  font-family: 'Sora', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0d2922;
  letter-spacing: -0.6px;
  line-height: 1.2;
}

.user-id {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: #6a9e96;
  margin-top: 2px;
  font-weight: 500;
}
.user-id span {
  color: #0A7E6E;
  font-weight: 700;
}

/* Plan Pill */
.active-plan-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(10,126,110,0.04);
  border: 1.5px solid rgba(10,126,110,0.12);
  padding: 8px 16px 8px 14px;
  border-radius: 30px;
  box-shadow: 0 4px 14px rgba(10,126,110,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: default;
}
.active-plan-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(10,126,110,0.08);
  background: rgba(10,126,110,0.06);
}
.pill-text {
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  color: #0A7E6E;
  letter-spacing: 0.2px;
}
.pulse-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  animation: pulseRing 2s infinite cubic-bezier(0.66, 0, 0, 1);
}
@keyframes pulseRing {
  100% { box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); }
}

/* Glass Stat Cards */
.glass-stat-card {
  background: rgba(255, 255, 255, 0.88);
  border-radius: 20px;
  border: 1.5px solid rgba(10, 126, 110, 0.08);
  box-shadow: 0 2px 16px rgba(10, 126, 110, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.glass-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(10, 126, 110, 0.1);
  background: white;
}

/* List Menu */
.glass-list-card {
  background: rgba(255, 255, 255, 0.88);
  border-radius: 22px;
  border: 1.5px solid rgba(10, 126, 110, 0.08);
  box-shadow: 0 2px 16px rgba(10, 126, 110, 0.05);
  overflow: hidden;
}

.glass-list-card .q-item {
  transition: background 0.2s ease;
  padding: 16px 20px;
}

.glass-list-card .q-item:hover {
  background: white;
}

/* Logout Button */
.logout-btn {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88) !important;
  border: 1.5px solid rgba(239, 68, 68, 0.15);
  height: 60px;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.05);
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: white !important;
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.1);
  transform: translateY(-2px);
}
</style>
