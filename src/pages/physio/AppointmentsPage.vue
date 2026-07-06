<template>
  <section class="screen">
    <!-- Hero / Header -->
    <div class="hero" style="padding-bottom: 50px;">
      <div class="hero-row">
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="icon-btn" @click="$router.push('/physio')">◀</button>
          <div>
            <h5 class="q-ma-none text-weight-bold">My Visits</h5>
            <div class="subtle">Manage schedules & sessions</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Stack -->
    <div class="stack" style="margin-top: -30px; padding: 0 16px;">
      <!-- Tab Switcher Card -->
      <div class="card soft" style="margin-bottom: 16px; padding: 6px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; text-align: center;">
          <div
            v-for="tab in ['Today', 'Upcoming', 'Past']"
            :key="tab"
            @click="activeTab = tab"
            :style="{
              background: activeTab === tab ? 'var(--brand)' : 'transparent',
              color: activeTab === tab ? '#fff' : 'var(--text-2)',
              fontWeight: activeTab === tab ? '700' : 'normal'
            }"
            style="padding: 10px 4px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; font-size: 13px;"
          >
            {{ tab }}
          </div>
        </div>
      </div>

      <!-- Appointments List -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div
          v-for="appt in filteredAppointments"
          :key="appt.id"
          class="card"
          style="padding: 16px; border: 1px solid rgba(220, 231, 234, 0.85);"
        >
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-weight: 800; font-size: 15px; color: var(--text);">
                {{ appt.patientName }}
              </div>
              <div style="color: var(--brand); font-weight: 700; font-size: 13px; margin-top: 2px;">
                {{ appt.time }}
              </div>
            </div>
            <span class="badge" :class="appt.status === 'Completed' ? 'success' : 'brand'">
              {{ appt.status }}
            </span>
          </div>

          <div style="margin-top: 12px; padding: 10px; background: var(--bg-soft); border-radius: var(--radius-sm); font-size: 13px;">
            <div class="muted" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">
              Planned treatment
            </div>
            <div style="margin-top: 2px; color: var(--text);">{{ appt.treatment }}</div>
          </div>

          <div
            v-if="activeTab === 'Today' && appt.status !== 'Completed'"
            style="margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;"
          >
            <button class="btn primary small" style="padding: 8px 12px;">
              Start Session
            </button>
            <button class="btn secondary small" style="padding: 8px 12px;">
              Reschedule
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredAppointments.length === 0"
          style="text-align: center; padding: 50px 20px;"
          class="muted"
        >
          No appointments scheduled under {{ activeTab.toLowerCase() }} visits.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('Today')

const appointments = ref([
  {
    id: 1,
    patientName: 'Rohan Malhotra',
    time: '10:30 AM (Today)',
    treatment: 'TENS Therapy, Soft Tissue Mobilisation',
    status: 'Scheduled',
    tab: 'Today',
  },
  {
    id: 2,
    patientName: 'Anjali Sharma',
    time: '11:15 AM (Today)',
    treatment: 'Laser Therapy, Maitland Joint Mobilisation',
    status: 'Scheduled',
    tab: 'Today',
  },
  {
    id: 3,
    patientName: 'Kabir Das',
    time: '02:00 PM (Tomorrow)',
    treatment: 'Therapeutic Exercise, Muscle Energy Technique',
    status: 'Scheduled',
    tab: 'Upcoming',
  },
  {
    id: 4,
    patientName: 'Shubham Roy',
    time: '09:00 AM (July 2, 2026)',
    treatment: 'Dry Needling, Ultrasound Therapy',
    status: 'Scheduled',
    tab: 'Upcoming',
  },
  {
    id: 5,
    patientName: 'Preeti Singh',
    time: '04:00 PM (Yesterday)',
    treatment: 'Manual Manipulation, Rotator Cuff Strengthening',
    status: 'Completed',
    tab: 'Past',
  },
])

const filteredAppointments = computed(() => {
  return appointments.value.filter((a) => a.tab === activeTab.value)
})
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
</style>
