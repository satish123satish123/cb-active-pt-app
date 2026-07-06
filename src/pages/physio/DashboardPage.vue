<template>
  <section class="screen">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-row">
        <div>
          <div class="subtle">Welcome back, Dr.</div>
          <h5 class="q-ma-none text-weight-bold">{{ authStore.user?.username || 'Therapist' }}</h5>
        </div>
        <button class="icon-btn">
          🔔<span class="pill-count">2</span>
        </button>
      </div>
    </div>

    <div class="stack">
      <!-- Practice Status / Stats -->
      <div class="section">
        <div class="card grad">
          <div class="title-row">
            <div>
              <div class="eyebrow">Practice Overview</div>
              <div class="title" style="color: var(--brand)">Today's Status</div>
            </div>
            <span class="badge success">Active</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; text-align: center;">
            <div style="background: rgba(255, 255, 255, 0.6); padding: 12px 8px; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.03);">
              <div style="font-size: 20px; font-weight: 800; color: var(--brand);">6</div>
              <div class="muted" style="font-size: 11px;">Visits Today</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.6); padding: 12px 8px; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.03);">
              <div style="font-size: 20px; font-weight: 800; color: var(--brand);">14</div>
              <div class="muted" style="font-size: 11px;">Active Patients</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.6); padding: 12px 8px; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.03);">
              <div style="font-size: 20px; font-weight: 800; color: var(--brand);">88%</div>
              <div class="muted" style="font-size: 11px;">Compliance</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section">
        <div class="card soft" style="margin-top: 14px;">
          <div class="title">Quick Actions</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px;">
            <button class="btn primary small" style="padding: 10px;" @click="$router.push('/physio/patients')">
              👥 View Patients
            </button>
            <button class="btn secondary small" style="padding: 10px;" @click="$router.push('/physio/appointments')">
              📅 Today's Visits
            </button>
          </div>
        </div>
      </div>

      <!-- Today's Schedule -->
      <div class="section">
        <div class="card" style="margin-top: 14px;">
          <div class="title-row">
            <div>
              <div class="eyebrow">Schedule</div>
              <div class="title">Next Appointments</div>
            </div>
            <button class="btn text small" style="color: var(--brand)" @click="$router.push('/physio/appointments')">See all</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
            <!-- Appointment Item 1 -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-soft); border-radius: var(--radius-sm);">
              <div>
                <div style="font-weight: 700; font-size: 14px;">Rohan Malhotra</div>
                <div class="muted" style="font-size: 12px;">10:30 AM • Knee Assessment</div>
              </div>
              <span class="badge brand">In 15m</span>
            </div>

            <!-- Appointment Item 2 -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-soft); border-radius: var(--radius-sm);">
              <div>
                <div style="font-weight: 700; font-size: 14px;">Anjali Sharma</div>
                <div class="muted" style="font-size: 12px;">11:15 AM • Laser Therapy</div>
              </div>
              <span class="badge upcoming">Upcoming</span>
            </div>

            <!-- Appointment Item 3 -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: var(--bg-soft); border-radius: var(--radius-sm);">
              <div>
                <div style="font-weight: 700; font-size: 14px;">Kabir Das</div>
                <div class="muted" style="font-size: 12px;">02:00 PM • Exercise Checkup</div>
              </div>
              <span class="badge upcoming">Upcoming</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from 'src/stores/authStore'
const authStore = useAuthStore()
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}
.badge.success {
  background: var(--brand-3);
  color: var(--brand);
}
.badge.brand {
  background: var(--brand);
  color: #fff;
}
.badge.upcoming {
  background: #edf1f3;
  color: var(--text-2);
}
</style>
