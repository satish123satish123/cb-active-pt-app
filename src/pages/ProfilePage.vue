<template>
  <q-page class="q-pa-md q-pb-xl">
    
    <!-- Profile Backing Gradient & Avatar -->
    <div class="profile-header-container scale-in q-mb-xl">
      <div class="profile-gradient-bg"></div>
      
      <!-- Avatar hanging off the background -->
      <div class="avatar-wrapper flex flex-center">
        <q-avatar size="100px" class="avatar-glow">
          <img src="https://ui-avatars.com/api/?name=Dr+Saulihal&background=0D8ABC&color=fff&size=200" />
        </q-avatar>
      </div>
    </div>

    <!-- User Info Card -->
    <div class="q-pt-xl q-mt-md text-center scale-in-delay-1">
      <div class="text-h4 text-weight-bolder text-dark tracking-tight">Dr. Saulihal</div>
      <div class="text-subtitle1 text-grey-6 text-weight-medium q-mt-xs">Patient ID: #209485</div>
      <q-badge color="green-1" text-color="positive" class="q-mt-md text-weight-bold q-px-sm q-py-xs" rounded>Active Plan: Pro</q-badge>
    </div>

    <!-- Stats Row -->
    <div class="row justify-between q-mt-xl q-mb-lg scale-in-delay-2 q-gutter-x-sm">
      <div class="col" v-for="(stat, index) in stats" :key="index">
        <div class="glass-stat-card text-center q-pa-md">
          <div class="text-h5 text-weight-bolder text-primary tracking-tight">{{ stat.value }}</div>
          <div class="text-caption text-grey-7 text-uppercase text-weight-bold q-mt-xs" style="font-size: 0.65rem;">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Action Sections (Settings/Lists) -->
    <div class="q-mt-xl scale-in-delay-3">
      <div class="text-subtitle2 text-grey-6 text-uppercase text-weight-bold q-mb-md" style="letter-spacing: 1px;">My Account</div>
      
      <q-list class="glass-list-card q-mb-lg">
        <q-item clickable v-ripple class="q-pa-md" to="/profile/personal-info">
          <q-item-section avatar>
            <q-avatar color="blue-1" text-color="primary" icon="person" size="md" />
          </q-item-section>
          <q-item-section class="text-weight-bold text-dark text-body1">Personal Information</q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
        <q-separator inset />
        
        <q-item clickable v-ripple class="q-pa-md">
          <q-item-section avatar>
            <q-avatar color="green-1" text-color="positive" icon="medical_information" size="md" />
          </q-item-section>
          <q-item-section class="text-weight-bold text-dark text-body1">Diagnosis & Program</q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
        <q-separator inset />

        <q-item clickable v-ripple class="q-pa-md">
          <q-item-section avatar>
            <q-avatar color="purple-1" text-color="purple-8" icon="trending_up" size="md" />
          </q-item-section>
          <q-item-section class="text-weight-bold text-dark text-body1">Progress History</q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
      </q-list>

      <div class="text-subtitle2 text-grey-6 text-uppercase text-weight-bold q-mb-md" style="letter-spacing: 1px;">Preferences</div>
      
      <q-list class="glass-list-card q-mb-xl">
        <q-item clickable v-ripple class="q-pa-md">
          <q-item-section avatar>
            <q-avatar color="orange-1" text-color="orange-8" icon="notifications_active" size="md" />
          </q-item-section>
          <q-item-section class="text-weight-bold text-dark text-body1">Notification Settings</q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
        <q-separator inset />
        
        <q-item clickable v-ripple class="q-pa-md">
          <q-item-section avatar>
            <q-avatar color="indigo-1" text-color="indigo-8" icon="dark_mode" size="md" />
          </q-item-section>
          <q-item-section class="text-weight-bold text-dark text-body1">Theme Preferences</q-item-section>
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
        to="/"
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
import { ref } from 'vue'

const stats = ref([
  { label: 'Workouts', value: '42' },
  { label: 'Active Mins', value: '840' },
  { label: 'Level', value: 'Pro' }
])
</script>

<style scoped>
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

/* Hero Section */
.profile-header-container {
  position: relative;
  height: 120px;
}

.profile-gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 32px;
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  box-shadow: 0 15px 35px rgba(16, 185, 129, 0.2);
}

.avatar-wrapper {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
}

.avatar-glow {
  box-shadow: 0 12px 30px rgba(13, 138, 188, 0.3);
  border: 4px solid white;
  background-color: white;
}

/* Glass Stat Cards */
.glass-stat-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;
}

.glass-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.9);
}

/* List Menu */
.glass-list-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.glass-list-card .q-item {
  transition: background 0.3s ease;
}

.glass-list-card .q-item:hover {
  background: rgba(255, 255, 255, 1);
}

/* Logout Button */
.logout-btn {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(239, 68, 68, 0.2);
  height: 64px;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.05);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(254, 242, 242, 1) !important;
  box-shadow: 0 12px 30px rgba(239, 68, 68, 0.1);
  transform: translateY(-2px);
}
</style>
