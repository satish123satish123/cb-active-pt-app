<template>
  <section class="screen">
    <ScreenHeader
      title="Visits"
      sub="Appointments, clinic details, invoices, and timeline access"
    />

    <!-- Upcoming -->
    <div class="section" v-if="upcomingAppointments.length > 0">
      <div v-for="(upcoming, idx) in upcomingAppointments" :key="'up-'+idx" class="visit-card upcoming" :style="{ marginBottom: idx < upcomingAppointments.length - 1 ? '12px' : '0' }">
        <div class="visit-top">
          <div class="visit-title-wrap">
            <div class="visit-kicker">Upcoming Appointment</div>
            <div class="visit-title">{{ upcoming.location }}</div>
          </div>
          <span class="visit-status confirmed">Confirmed</span>
        </div>

        <div class="visit-date-line">
          {{ upcoming.date }} <span v-if="upcoming.timeString">• From {{ upcoming.timeString }}</span> • Physiotherapist:
          {{ upcoming.physio }}
        </div>

        <div class="visit-subrow">
          <div class="visit-time-range" style="color: var(--text-2)">
            <span class="status-dot"></span> Scheduled clinic appointment
          </div>
          <div class="visit-actions">
            <button class="visit-link-btn ghosty">Request Reschedule</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline Link -->
    <div class="section">
      <div class="timeline-link-card">
        <div class="timeline-link-copy">
          <div class="timeline-link-title">Session Timeline</div>
          <div class="timeline-link-sub">
            See the clinical record of what happened medically during each visit.
          </div>
        </div>
        <button class="btn secondary small" @click="$router.push('/session-timeline')">Open</button>
      </div>
    </div>

    <!-- Past Appointments -->
    <div class="section">
      <div class="visit-section-head">
        <div>
          <div class="title">Past Appointments</div>
          <div class="muted">Completed and cancelled visits</div>
        </div>
        <span class="badge" style="background: #eaf8f3; color: var(--brand); font-weight: 700"
          >{{ pastAppointments.length }} Records</span
        >
      </div>

      <div class="visit-stack">
        <div
          v-for="(a, index) in pastAppointments"
          :key="index"
          class="visit-card"
          :class="{ cancelled: a.mappedStatus === 'cancelled' }"
        >
          <div class="visit-top">
            <div class="visit-title-wrap">
              <div class="visit-kicker">Past Appointment</div>
              <div class="visit-title">{{ a.location }}</div>
            </div>
            <span class="visit-status" :class="a.mappedStatus">
              {{ a.statusLabel }}
            </span>
          </div>

          <div class="visit-date-line">
            {{ a.date }} <span v-if="a.timeString">• From {{ a.timeString }}</span> • Physiotherapist: {{ a.physio }}
          </div>

          <div class="visit-subrow">
            <div class="visit-time-range">
              <span class="status-dot"></span>
              <template v-if="a.mappedStatus === 'cancelled'">
                Charges: {{ a.chargesFormatted }} • Appointment not attended
              </template>
              <template v-else> Charges: {{ a.chargesFormatted }} </template>
            </div>
            <div class="visit-actions">
              <q-btn v-if="a.invoice_url" flat outline color="primary" no-caps @click="openInvoicePdf(a.invoice_url)"
                >View Invoice</q-btn
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/authStore'
import ScreenHeader from 'src/components/ScreenHeader.vue'

const authStore = useAuthStore()

const upcomingAppointments = ref([])
const pastAppointments = ref([])
const loading = ref(true)

const fetchVisitsData = async () => {
  loading.value = true
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('getVisitsData', {
      patient_id: patientId,
      hospital_id: hospitalId
    })

    if (response.data?.status === 'success') {
      const data = response.data.visits_data
      
      upcomingAppointments.value = (data.upcoming_appointments || []).map(a => ({
        ...a,
        statusLabel: a.status,
        mappedStatus: a.status.toLowerCase(),
        location: a.clinic_name,
        physio: a.physio_name,
        timeString: a.time ? a.time.replace(/ - | To /ig, ' to ') : ''
      }))

      pastAppointments.value = (data.past_appointments || []).map(a => {
        let mappedStatus = a.status.toLowerCase()
        if (mappedStatus === 'treated') mappedStatus = 'completed'
        
        return {
          ...a,
          statusLabel: mappedStatus === 'completed' ? 'Completed' : (mappedStatus === 'cancelled' ? 'Cancelled' : a.status),
          mappedStatus,
          location: a.clinic_name,
          physio: a.physio_name,
          timeString: a.time ? a.time.replace(/ - | To /ig, ' to ') : '',
          chargesFormatted: `₹${Math.round(Number(a.gross_total || 0)).toLocaleString('en-IN')}`
        }
      })
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVisitsData()
})

function openInvoicePdf(url) {
  if (url) {
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
/* Fallback/Additional Styles if they aren't generated in style.scss */
.visit-section-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 14px;
}
.visit-section-head .title {
  font-size: 18px;
  font-weight: 800;
  color: #0d2922;
}
.visit-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.visit-card {
  position: relative;
  background: linear-gradient(180deg, #f8fbfb 0%, #f2f7f7 100%);
  border: 1px solid #dbe6e8;
  border-radius: 24px;
  padding: 18px;
  box-shadow:
    0 10px 24px rgba(16, 33, 42, 0.045),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.visit-card.upcoming {
  background: linear-gradient(180deg, #f6fbfa 0%, #eef5f4 100%);
  border-color: #d6e4e5;
}
.visit-card.cancelled {
  background: linear-gradient(180deg, #fafcfc 0%, #f3f6f7 100%);
  border-color: #e0e8eb;
  opacity: 1; /* Removing old opacity to emphasize the new gradient */
}
.visit-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.visit-kicker {
  font-size: 10px;
  font-weight: 800;
  color: #80929b;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 4px;
}
.visit-title {
  font-size: 16px;
  font-weight: 800;
  color: #0d2922;
}
.visit-status {
  font-size: 10.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}
.visit-status.confirmed {
  background: rgba(10, 126, 110, 0.1);
  color: #0a7e6e;
}
.visit-status.completed {
  background: rgba(10, 126, 110, 0.1);
  color: #0a7e6e;
}
.visit-status.cancelled {
  background: #fde8ec;
  color: #c0392b;
}
.visit-date-line {
  font-size: 13px;
  font-weight: bold;
  color: #0d2922;
  margin-bottom: 14px;
  line-height: 1.4;
}
.visit-subrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(10, 126, 110, 0.08);
  padding-top: 14px;
}
.visit-time-range {
  font-size: 12px;
  font-weight: bold;
  color: var(--text-2);
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-dot {
  width: 6px;
  height: 6px;
  background: #cbdcd8;
  border-radius: 50%;
  display: inline-block;
}
.visit-actions button {
  background: none;
  font-size: 12px;
  font-weight: 700;
  color: #0c9b80;
  border: 1px solid rgba(10, 126, 110, 0.15);
  padding: 6px 12px;
  border-radius: 8px;
}
.visit-actions button.ghosty {
  color: #0d2922;
}

.timeline-link-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, #f8fbfb 0%, #f1f6f6 100%);
  border: 1px solid rgba(10, 126, 110, 0.1);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 3px 14px rgba(10, 126, 110, 0.05);
}
.timeline-link-title {
  font-size: 16px;
  font-weight: 800;
  color: #0d2922;
  margin-bottom: 4px;
}
.timeline-link-sub {
  font-size: 12px;
  color: #8ab5ae;
  line-height: 1.3;
}
</style>
