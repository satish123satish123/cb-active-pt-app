<template>
  <section class="screen">
    <div class="topbar">
      <q-btn class="back-btn" flat round dense icon="arrow_back" to="/"></q-btn>
      <div>
        <div class="screen-title">Appointments</div>
        <div class="screen-sub">Manage your clinic visits</div>
      </div>
    </div>
    <!-- Next appointment hero card -->
    <div class="section">
      <div class="card appointment">
        <div class="title-row">
          <div>
            <div class="eyebrow" style="color: rgba(255, 255, 255, 0.72)">Next Visit</div>
            <div class="title" style="color: #fff; font-size: 24px">Tomorrow, 10:30 AM</div>
            <div class="muted">April 10, 2026</div>
          </div>
          <span class="badge" style="background: rgba(255, 255, 255, 0.15); color: #fff"
            >Confirmed</span
          >
        </div>
        <div class="appointment-grid">
          <div class="appt-box">
            <div class="label">Therapist</div>
            <div class="value">Dr. Sharma</div>
          </div>
          <div class="appt-box">
            <div class="label">Location</div>
            <div class="value">CB Physiotherapy - GK II</div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px">
          <button class="btn" style="background: rgba(255, 255, 255, 0.16); color: #fff">
            Request Reschedule
          </button>
          <button class="btn" style="background: #fff; color: var(--brand)">Call Clinic</button>
        </div>
      </div>
    </div>

    <!-- Upcoming sessions -->
    <div class="section">
      <div class="card">
        <div class="title">Upcoming sessions</div>
        <div class="list" style="margin-top: 12px">
          <div class="list-item">
            <div class="split">
              <strong>Session 5</strong><span class="badge brand">2:00 PM</span>
            </div>
            <div class="muted" style="margin-top: 6px">April 15, 2026</div>
            <div class="muted" style="margin-top: 4px">Dr. Sharma • CB Physiotherapy - GK II</div>
          </div>
          <div class="list-item">
            <div class="split">
              <strong>Session 6 • Reassessment</strong><span class="badge brand">10:30 AM</span>
            </div>
            <div class="muted" style="margin-top: 6px">April 19, 2026</div>
            <div class="muted" style="margin-top: 4px">Dr. Sharma • CB Physiotherapy - GK II</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'

const authStore = useAuthStore()

// ── Loading / Error state ──
const loading = ref(true)
const error = ref('')

// ── Data ──
const upcoming = ref([])
const past = ref([])

// ── Helpers ──

// Unix timestamp (seconds as string) → "28 Mar 2026"
const formatDate = (ts) => {
  if (!ts) return '—'
  const d = new Date(parseInt(ts) * 1000)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// "Dr. Priya Sharma" or "Dr. Priya Sharma-PT" → "PS"
const getInitials = (name = '') => {
  const cleaned = name.replace(/[-—].*/g, '').trim() // strip suffix after dash
  const parts = cleaned
    .replace(/^Dr\.?\s*/, '')
    .trim()
    .split(/\s+/)
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}

// Slot — return as-is (full range like "05:00 PM To 05:45 PM" or "11:04 - 11:04")
const parseSlot = (slot = '') => {
  const s = slot?.trim()
  if (!s || s === '-') return '—'
  return s
}

// Map one API appointment object → UI object
const mapAppt = (item, index) => ({
  id: index,
  doctor: item.doctor_name?.trim() || 'Unknown Doctor',
  doctorInitials: getInitials(item.doctor_name),
  speciality: 'Physiotherapist',
  date: formatDate(item.date),
  time: parseSlot(item.scheduled_slot),
  status: item.status || 'Pending',
  clinic: item.hospital_name || 'CB Physiotherapy',
  // Upcoming fields
  expectedTreatment: item.modalities || item.treatment || 'Physiotherapy Session',
  // Past fields — modalities first, treatment as fallback
  treatmentGiven: item.modalities || item.treatment || '—',
  charges: parseFloat(item.charges) || 0,
  nextFollowup: '—',
})

// ── API Fetch ──
const fetchAppointments = async () => {
  loading.value = true
  error.value = ''
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('getAllAppointmentsForPatient', {
      patient_id: patientId,
      hospital_id: hospitalId,
    })

    const data = response.data?.response ?? {}
    if (!data) throw new Error('Invalid response')

    // upcoming_appointments → Upcoming tab
    const upcomingRaw = data.upcoming_appointments || []
    upcoming.value = upcomingRaw.map(mapAppt)

    // appointments → Past tab (backend already separates past from upcoming)
    past.value = (data.appointments || []).map(mapAppt)
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Failed to load appointments.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
}
button {
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  border: none;
  outline: none;
}

/* ── Animations ── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes pulseDot {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
}

/* ── Page ── */
.appt-page {
  font-family: 'Sora', sans-serif;
  background: linear-gradient(170deg, #eaf8f3 0%, #f4fbf8 50%, #edf9f5 100%);
  min-height: 100vh;
}

/* ── Page Title ── */
.page-title-row {
  animation: fadeUp 0.35s cubic-bezier(0.25, 0.8, 0.25, 1) both;
}
.page-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #7ab5ac;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 3px;
}
.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #0d2922;
  letter-spacing: -0.4px;
}

/* ── Summary Row ── */
.summary-row {
  display: flex;
  gap: 10px;
  animation: fadeUp 0.38s 0.04s cubic-bezier(0.25, 0.8, 0.25, 1) both;
}
.summary-pill {
  flex: 1;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.82);
  border: 1.5px solid rgba(10, 126, 110, 0.1);
  box-shadow: 0 2px 10px rgba(10, 126, 110, 0.06);
}
.pill-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex-shrink: 0;
}
.pill-icon--upcoming {
  background: rgba(10, 126, 110, 0.1);
}
.pill-icon--past {
  background: rgba(13, 122, 156, 0.1);
}
.pill-num {
  font-size: 18px;
  font-weight: 800;
  color: #0d2922;
  line-height: 1;
}
.pill-label {
  font-size: 10.5px;
  color: #8ab5ae;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  margin-top: 1px;
}

/* ── Tab Bar ── */
.tab-bar {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 5px;
  display: flex;
  gap: 4px;
  border: 1px solid rgba(10, 126, 110, 0.1);
  animation: fadeUp 0.4s 0.06s cubic-bezier(0.25, 0.8, 0.25, 1) both;
}
.tab-btn {
  flex: 1;
  height: 38px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: all 0.2s ease;
  background: none;
}
.tab-active {
  background: linear-gradient(145deg, #0c9b80, #0a7e6e);
  color: white;
  box-shadow: 0 3px 12px rgba(10, 126, 110, 0.28);
}
.tab-inactive {
  color: #8ab5ae;
}
.tab-count {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  line-height: 1.4;
}
.tab-count--active {
  background: rgba(255, 255, 255, 0.22);
  color: white;
}
.tab-count--inactive {
  background: rgba(10, 126, 110, 0.1);
  color: #0a7e6e;
}

/* ── Cards Wrap ── */
.cards-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 14px;
}

/* ── Appointment Card ── */
.appt-card {
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  border: 1.5px solid rgba(0, 0, 0, 0.055);
  box-shadow: 0 3px 14px rgba(10, 126, 110, 0.07);
  animation: slideIn 0.35s cubic-bezier(0.25, 0.8, 0.25, 1) both;
}
.card-body {
  padding: 16px 16px 14px;
}

/* Status bar */
.status-bar {
  height: 3.5px;
}
.status-bar--confirmed {
  background: linear-gradient(90deg, #0c9b80, #3dba8a);
}
.status-bar--pending {
  background: linear-gradient(90deg, #f0a500, #f5c842);
}
.status-bar--cancelled {
  background: linear-gradient(90deg, #e74c3c, #ff7675);
}
.status-bar--rescheduled {
  background: linear-gradient(90deg, #8e44ad, #bb8fce);
}

/* Doctor Row */
.doc-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.doc-avatar {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 700;
  color: white;
  background: linear-gradient(145deg, #0c9b80, #0a7e6e);
  box-shadow: 0 3px 10px rgba(10, 126, 110, 0.28);
  font-family: 'Sora', sans-serif;
}
.doc-avatar--past {
  background: linear-gradient(145deg, #0d7a9c, #0a5f7a);
}
.doc-info {
  flex: 1;
  min-width: 0;
}
.doc-name {
  font-size: 15px;
  font-weight: 700;
  color: #0d2922;
}
.doc-spec {
  font-size: 12px;
  color: #8ab5ae;
  font-family: 'DM Sans', sans-serif;
  margin-top: 2px;
}

/* Status Badge */
.status-badge {
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 4px 10px;
  border-radius: 20px;
  font-family: 'DM Sans', sans-serif;
}
.badge--confirmed {
  background: rgba(10, 126, 110, 0.1);
  color: #0a7e6e;
}
.badge--pending {
  background: rgba(240, 165, 0, 0.12);
  color: #d4920a;
}
.badge--cancelled {
  background: rgba(231, 76, 60, 0.1);
  color: #c0392b;
}
.badge--rescheduled {
  background: rgba(142, 68, 173, 0.1);
  color: #7d3c98;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}
.info-cell {
  background: rgba(10, 126, 110, 0.04);
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(10, 126, 110, 0.08);
}
.info-cell--full {
  grid-column: 1 / -1;
}
.info-lbl {
  font-size: 9.5px;
  font-weight: 600;
  color: #9abfba;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 4px;
}
.info-val {
  font-size: 13px;
  font-weight: 600;
  color: #0d2922;
  font-family: 'DM Sans', sans-serif;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 6px;
}
.info-val--wrap {
  align-items: flex-start;
  white-space: normal;
  overflow-wrap: anywhere;
}

/* Card Actions */
.card-actions {
  display: flex;
  gap: 8px;
}
.btn-primary {
  flex: 1;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(145deg, #0c9b80, #0a7e6e);
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 3px 12px rgba(10, 126, 110, 0.28);
  transition: transform 0.12s ease;
}
.btn-primary:active {
  transform: scale(0.97);
}
.btn-primary--past {
  background: linear-gradient(145deg, #0d7a9c, #0a5f7a);
  box-shadow: 0 3px 12px rgba(13, 122, 156, 0.28);
}
.btn-ghost {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
  background: rgba(10, 126, 110, 0.07);
  border: 1px solid rgba(10, 126, 110, 0.12);
  transition: background 0.15s;
}
.btn-ghost:hover {
  background: rgba(10, 126, 110, 0.12);
}

/* Divider */
.divider {
  height: 1px;
  background: rgba(10, 126, 110, 0.07);
  margin: 2px 0 12px;
}

/* Past Extras */
.past-extras {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}
.charge-row {
  background: linear-gradient(135deg, rgba(10, 126, 110, 0.07), rgba(10, 126, 110, 0.04));
  border: 1px solid rgba(10, 126, 110, 0.12);
  border-radius: 12px;
  padding: 10px 14px;
}
.charge-lbl {
  font-size: 12px;
  font-weight: 600;
  color: #5a9e96;
  font-family: 'DM Sans', sans-serif;
}
.charge-amt {
  font-size: 16px;
  font-weight: 800;
  color: #0a7e6e;
  font-family: 'Sora', sans-serif;
}
.followup-row {
  background: rgba(240, 165, 0, 0.07);
  border: 1px solid rgba(240, 165, 0, 0.18);
  border-radius: 12px;
  padding: 10px 14px;
}
.followup-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f0a500;
  flex-shrink: 0;
  animation: pulseDot 2s ease infinite;
}
.followup-txt {
  font-size: 12.5px;
  font-weight: 600;
  color: #a07000;
  font-family: 'DM Sans', sans-serif;
}
.followup-date {
  font-size: 12px;
  color: #b8860b;
  font-family: 'DM Sans', sans-serif;
  margin-left: auto;
  font-weight: 600;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 20px;
  text-align: center;
}
.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(10, 126, 110, 0.08);
  border: 1.5px solid rgba(10, 126, 110, 0.12);
}
.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #0d2922;
}
.empty-sub {
  font-size: 13px;
  color: #8ab5ae;
  font-family: 'DM Sans', sans-serif;
  line-height: 1.5;
}

/* Skeleton Loader */
@keyframes skelShimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}
.appt-skeleton {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1.5px solid rgba(10, 126, 110, 0.08);
  box-shadow: 0 3px 14px rgba(10, 126, 110, 0.07);
}
.skel-bar {
  height: 3.5px;
  background: linear-gradient(90deg, #e0f2ee, #c8eae4, #e0f2ee);
  background-size: 800px 100%;
  animation: skelShimmer 1.4s ease infinite;
}
.skel-line {
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: skelShimmer 1.4s ease infinite;
}
</style>
