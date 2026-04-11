<template>
  <section class="screen">
    <ScreenHeader
      title="Visits"
      sub="Appointments, clinic details, invoices, and timeline access"
    />

    <!-- Upcoming -->
    <div class="section" v-if="upcoming">
      <div class="visit-card upcoming">
        <div class="visit-top">
          <div class="visit-title-wrap">
            <div class="visit-kicker">Upcoming Appointment</div>
            <div class="visit-title">{{ upcoming.location }}</div>
          </div>
          <span class="visit-status confirmed">Confirmed</span>
        </div>

        <div class="visit-date-line">
          {{ upcoming.date }} • From {{ upcoming.from }} to {{ upcoming.to }} • Physiotherapist:
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
          :class="{ cancelled: a.status === 'cancelled' }"
        >
          <div class="visit-top">
            <div class="visit-title-wrap">
              <div class="visit-kicker">Past Appointment</div>
              <div class="visit-title">{{ a.location }}</div>
            </div>
            <span class="visit-status" :class="a.status">
              {{ a.status === 'cancelled' ? 'Cancelled' : 'Completed' }}
            </span>
          </div>

          <div class="visit-date-line">
            {{ a.date }} • From {{ a.from }} to {{ a.to }} • Physiotherapist: {{ a.physio }}
          </div>

          <div class="visit-subrow">
            <div class="visit-time-range">
              <span class="status-dot"></span>
              <template v-if="a.status === 'cancelled'">
                Charges: {{ a.charges }} • Appointment not attended
              </template>
              <template v-else> Charges: {{ a.charges }} </template>
            </div>
            <div class="visit-actions">
              <q-btn flat outline color="primary" no-caps @click="openInvoicePdf(a.id)"
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
import { computed } from 'vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'
import { Notify } from 'quasar'

const appointments = [
  {
    title: 'Clinic Appointment',
    day: 'Sunday, 13 Apr',
    date: 'April 13, 2026',
    time: '10:30 AM',
    from: '10:30 AM',
    to: '11:15 AM',
    physio: 'Dr. Sharma',
    location: 'CB Physiotherapy - GK II',
    status: 'confirmed',
    charges: null,
  },
  {
    title: 'Clinic Appointment',
    day: 'Friday, 05 Apr',
    date: 'April 5, 2026',
    time: '2:00 PM',
    from: '2:00 PM',
    to: '2:45 PM',
    physio: 'Dr. Sharma',
    location: 'CB Physiotherapy - GK II',
    status: 'completed',
    charges: '₹1,000',
  },
  {
    title: 'Clinic Appointment',
    day: 'Tuesday, 02 Apr',
    date: 'April 2, 2026',
    time: '10:30 AM',
    from: '10:30 AM',
    to: '11:30 AM',
    physio: 'Dr. Sharma',
    location: 'CB Physiotherapy - GK II',
    status: 'completed',
    charges: '₹2,000',
  },
  {
    title: 'Clinic Appointment',
    day: 'Thursday, 28 Mar',
    date: 'March 28, 2026',
    time: '12:00 PM',
    from: '12:00 PM',
    to: '1:00 PM',
    physio: 'Dr. Sharma',
    location: 'CB Physiotherapy - GK II',
    status: 'cancelled',
    charges: '₹0',
  },
]

const upcoming = computed(() => appointments.find((a) => a.status === 'confirmed'))
const pastAppointments = computed(() => appointments.filter((a) => a.status !== 'confirmed'))

function openInvoicePdf(id) {
  console.log(id)
  Notify.create({
    message: 'Downloading invoice...',
    color: 'primary',
    position: 'top',
    timeout: 2000,
    spinner: true,
  })
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
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(10, 126, 110, 0.1);
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 3px 14px rgba(10, 126, 110, 0.05);
}
.visit-card.upcoming {
}
.visit-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.visit-kicker {
  font-size: 9.5px;
  font-weight: 700;
  color: #8ab5ae;
  text-transform: uppercase;
  letter-spacing: 0.8px;
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
.visit-card.cancelled {
  opacity: 0.8;
}
.visit-date-line {
  font-size: 13px;
  font-weight: 600;
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
  font-size: 11px;
  font-weight: 600;
  color: #8ab5ae;
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
  background: rgba(255, 255, 255, 0.9);
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
