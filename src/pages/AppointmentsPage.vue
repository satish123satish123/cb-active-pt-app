<template>
  <q-page class="appt-page q-pb-xl">

    <!-- ── Page Title ── -->
    <div class="page-title-row q-px-md q-pt-lg q-pb-sm">
      <div class="page-label">Your Schedule</div>
      <div class="page-title">Appointments</div>
    </div>

    <!-- ── Summary Pills ── -->
    <div class="summary-row q-px-md q-mb-sm">
      <div class="summary-pill">
        <div class="pill-icon pill-icon--upcoming flex flex-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div>
          <div class="pill-num">{{ upcoming.length }}</div>
          <div class="pill-label">Upcoming</div>
        </div>
      </div>
      <div class="summary-pill">
        <div class="pill-icon pill-icon--past flex flex-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d7a9c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div>
          <div class="pill-num">{{ past.length }}</div>
          <div class="pill-label">Past</div>
        </div>
      </div>
    </div>

    <!-- ── Tab Bar ── -->
    <div class="tab-bar q-mx-md q-mb-sm">
      <button class="tab-btn" :class="activeTab === 'upcoming' ? 'tab-active' : 'tab-inactive'" @click="activeTab = 'upcoming'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Upcoming
        <span class="tab-count" :class="activeTab === 'upcoming' ? 'tab-count--active' : 'tab-count--inactive'">
          {{ upcoming.length }}
        </span>
      </button>
      <button class="tab-btn" :class="activeTab === 'past' ? 'tab-active' : 'tab-inactive'" @click="activeTab = 'past'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Past
        <span class="tab-count" :class="activeTab === 'past' ? 'tab-count--active' : 'tab-count--inactive'">
          {{ past.length }}
        </span>
      </button>
    </div>

    <!-- ── Loading State ── -->
    <div v-if="loading" class="q-px-md" style="padding-top:14px;">
      <div v-for="n in 3" :key="n" class="appt-skeleton q-mb-md">
        <div class="skel-bar"></div>
        <div style="padding:16px">
          <div class="skel-line" style="width:60%;height:14px;margin-bottom:8px;"></div>
          <div class="skel-line" style="width:40%;height:10px;margin-bottom:16px;"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div class="skel-line" style="height:48px;border-radius:12px;"></div>
            <div class="skel-line" style="height:48px;border-radius:12px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Error State ── -->
    <div v-else-if="error" class="q-px-md q-py-xl text-center">
      <q-icon name="wifi_off" size="44px" color="grey-4" />
      <div class="q-mt-sm text-grey-6 text-body2">{{ error }}</div>
      <q-btn flat no-caps color="positive" label="Retry" class="q-mt-sm text-weight-bold" @click="fetchAppointments" />
    </div>

    <!-- ═══════════════════════════════════ -->
    <!-- TAB CONTENT (only when loaded)      -->
    <!-- ═══════════════════════════════════ -->
    <template v-else>

    <!-- UPCOMING TAB -->
    <div v-if="activeTab === 'upcoming'" class="cards-wrap q-px-md">

      <!-- Empty State -->
      <div v-if="upcoming.length === 0" class="empty-state">
        <div class="empty-icon flex flex-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="empty-title">No Upcoming Appointments</div>
        <div class="empty-sub">You're all clear! Your next appointment will appear here once scheduled.</div>
      </div>

      <!-- Upcoming Cards -->
      <div v-for="(appt, i) in upcoming" :key="appt.id" class="appt-card" :style="{ animationDelay: (i * 0.07) + 's' }">
        <!-- Status colour bar -->
        <div class="status-bar" :class="'status-bar--' + appt.status.toLowerCase()"></div>
        <div class="card-body">

          <!-- Doctor Row -->
          <div class="doc-row">
            <div class="doc-avatar flex flex-center">{{ appt.doctorInitials }}</div>
            <div class="doc-info">
              <div class="doc-name">{{ appt.doctor }}</div>
              <div class="doc-spec">{{ appt.speciality }}</div>
            </div>
            <span class="status-badge" :class="'badge--' + appt.status.toLowerCase()">
              {{ appt.status }}
            </span>
          </div>

          <!-- Info Grid -->
          <div class="info-grid">
            <div class="info-cell">
              <div class="info-lbl">Date</div>
              <div class="info-val">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ appt.date }}
              </div>
            </div>
            <div class="info-cell">
              <div class="info-lbl">Time</div>
              <div class="info-val">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ appt.time }}
              </div>
            </div>
            <div class="info-cell">
              <div class="info-lbl">Clinic</div>
              <div class="info-val">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ appt.clinic }}
              </div>
            </div>
            <div class="info-cell">
              <div class="info-lbl">Expected Treatment</div>
              <div class="info-val" style="font-size:12px;">{{ appt.expectedTreatment }}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card-actions">
            <button class="btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.72 17z"/></svg>
              Contact Clinic
            </button>
            <button class="btn-ghost flex flex-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════ -->
    <!-- PAST TAB                            -->
    <!-- ═══════════════════════════════════ -->
    <div v-if="activeTab === 'past'" class="cards-wrap q-px-md">

      <!-- Empty State -->
      <div v-if="past.length === 0" class="empty-state">
        <div class="empty-icon flex flex-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="empty-title">No Past Appointments</div>
        <div class="empty-sub">Your appointment history will show up here once you've had your first session.</div>
      </div>

      <!-- Past Cards -->
      <div v-for="(appt, i) in past" :key="appt.id" class="appt-card" :style="{ animationDelay: (i * 0.07) + 's' }">
        <div class="status-bar" :class="'status-bar--' + appt.status.toLowerCase()"></div>
        <div class="card-body">

          <!-- Doctor Row -->
          <div class="doc-row">
            <div class="doc-avatar doc-avatar--past flex flex-center">{{ appt.doctorInitials }}</div>
            <div class="doc-info">
              <div class="doc-name">{{ appt.doctor }}</div>
              <div class="doc-spec">{{ appt.speciality }}</div>
            </div>
            <span class="status-badge" :class="'badge--' + appt.status.toLowerCase()">
              {{ appt.status }}
            </span>
          </div>

          <!-- Info Grid -->
          <div class="info-grid">
            <div class="info-cell">
              <div class="info-lbl">Date</div>
              <div class="info-val">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ appt.date }}
              </div>
            </div>
            <div class="info-cell">
              <div class="info-lbl">Time</div>
              <div class="info-val">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {{ appt.time }}
              </div>
            </div>
            <div class="info-cell info-cell--full">
              <div class="info-lbl">Clinic</div>
              <div class="info-val">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ appt.clinic }}
              </div>
            </div>
            <div class="info-cell info-cell--full">
              <div class="info-lbl">Treatment Given</div>
              <div class="info-val" style="font-size:12px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {{ appt.treatmentGiven }}
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Past Extras -->
          <div class="past-extras">
            <!-- Charges -->
            <div class="charge-row row justify-between items-center">
              <div class="charge-lbl">Session Charges</div>
              <div class="charge-amt">₹{{ appt.charges.toLocaleString() }}</div>
            </div>
            <!-- Follow-up -->
            <div class="followup-row row items-center" style="gap:10px;">
              <span class="followup-dot"></span>
              <span class="followup-txt">Next Follow-up</span>
              <span class="followup-date">{{ appt.nextFollowup }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="card-actions">
            <button class="btn-primary btn-primary--past">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              View Summary
            </button>
            <button class="btn-ghost flex flex-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A7E6E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </button>
          </div>

        </div>
      </div>
    </div>

    </template><!-- end v-else (loaded state) -->

    <div style="height: 100px"></div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import { api } from 'src/boot/axios'

const authStore = useAuthStore()
const activeTab = ref('upcoming')

// ── Loading / Error state ──
const loading = ref(true)
const error   = ref('')

// ── Data ──
const upcoming = ref([])
const past     = ref([])

// ── Helpers ──

// Unix timestamp (seconds as string) → "28 Mar 2026"
const formatDate = (ts) => {
  if (!ts) return '—'
  const d = new Date(parseInt(ts) * 1000)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// "Dr. Priya Sharma" or "Dr. Priya Sharma-PT" → "PS"
const getInitials = (name = '') => {
  const cleaned = name.replace(/[-—].*/g, '').trim()   // strip suffix after dash
  const parts   = cleaned.replace(/^Dr\.?\s*/, '').trim().split(/\s+/)
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
}



// Slot "11:00 AM To 11:15 AM" → "11:00 AM" or " - " → "—"
const parseSlot = (slot = '') => {
  if (!slot || slot.trim() === '-' || slot.trim() === '') return '—'
  return slot.split(/\s+[Tt]o\s+/)[0].trim()
}

// Map one API appointment object → UI object
const mapAppt = (item, index) => ({
  id:              index,
  doctor:          item.doctor_name?.trim() || 'Unknown Doctor',
  doctorInitials:  getInitials(item.doctor_name),
  speciality:      'Physiotherapist',
  date:            formatDate(item.date),
  time:            parseSlot(item.scheduled_slot),
  status:          item.status || 'Pending',
  clinic:          authStore.user?.hospital_name || authStore.user?.clinic_name || 'CB Physiotherapy',
  // Upcoming fields
  expectedTreatment: item.treatment || item.modalities || 'Physiotherapy Session',
  // Past fields
  treatmentGiven:  item.treatment || item.modalities || 'Physiotherapy Session',
  charges:         parseFloat(item.charges) || 0,
  nextFollowup:    '—',
})

// ── API Fetch ──
const fetchAppointments = async () => {
  loading.value = true
  error.value   = ''
  try {
    const patientId  = authStore.user_id || authStore.user?.id
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.get('getAllAppointmentsForPatient', {
      params: { patient_id: patientId, hospital_id: hospitalId },
    })

    const data = response.data?.response
    if (!data) throw new Error('Invalid response')

    // upcoming_appointments → Upcoming tab
    const upcomingRaw = data.upcoming_appointments || []
    upcoming.value = upcomingRaw.map(mapAppt)

    // appointments → Past tab (exclude items already in upcoming by matching status)
    const allRaw  = data.appointments || []
    // Past = appointments whose status is NOT Confirmed / Scheduled
    const upcomingStatuses = new Set(['confirmed', 'scheduled', 'rescheduled'])
    past.value = allRaw
      .filter(a => !upcomingStatuses.has((a.status || '').toLowerCase()))
      .map(mapAppt)

  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Failed to load appointments.'
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchAppointments() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; }
button { font-family: 'Sora', sans-serif; cursor: pointer; border: none; outline: none; }

/* ── Animations ── */
@keyframes fadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.6; transform:scale(1.3); } }

/* ── Page ── */
.appt-page {
  font-family: 'Sora', sans-serif;
  background: linear-gradient(170deg, #eaf8f3 0%, #f4fbf8 50%, #edf9f5 100%);
  min-height: 100vh;
}

/* ── Page Title ── */
.page-title-row { animation: fadeUp .35s cubic-bezier(.25,.8,.25,1) both; }
.page-label {
  font-size: 11.5px; font-weight: 600; color: #7ab5ac;
  letter-spacing: .8px; text-transform: uppercase;
  font-family: 'DM Sans', sans-serif; margin-bottom: 3px;
}
.page-title { font-size: 24px; font-weight: 800; color: #0d2922; letter-spacing: -.4px; }

/* ── Summary Row ── */
.summary-row {
  display: flex; gap: 10px;
  animation: fadeUp .38s .04s cubic-bezier(.25,.8,.25,1) both;
}
.summary-pill {
  flex: 1; border-radius: 14px; padding: 12px 14px;
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.82);
  border: 1.5px solid rgba(10,126,110,0.1);
  box-shadow: 0 2px 10px rgba(10,126,110,0.06);
}
.pill-icon {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
}
.pill-icon--upcoming { background: rgba(10,126,110,0.1); }
.pill-icon--past     { background: rgba(13,122,156,0.1); }
.pill-num   { font-size: 18px; font-weight: 800; color: #0d2922; line-height: 1; }
.pill-label { font-size: 10.5px; color: #8ab5ae; font-family: 'DM Sans', sans-serif; font-weight: 500; margin-top: 1px; }

/* ── Tab Bar ── */
.tab-bar {
  background: rgba(255,255,255,0.7);
  border-radius: 16px; padding: 5px;
  display: flex; gap: 4px;
  border: 1px solid rgba(10,126,110,0.1);
  animation: fadeUp .4s .06s cubic-bezier(.25,.8,.25,1) both;
}
.tab-btn {
  flex: 1; height: 38px; border-radius: 12px;
  font-size: 13.5px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all .2s ease; background: none;
}
.tab-active   { background: linear-gradient(145deg,#0c9b80,#0A7E6E); color: white; box-shadow: 0 3px 12px rgba(10,126,110,0.28); }
.tab-inactive { color: #8ab5ae; }
.tab-count {
  font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 10px; line-height: 1.4;
}
.tab-count--active   { background: rgba(255,255,255,0.22); color: white; }
.tab-count--inactive { background: rgba(10,126,110,0.1);   color: #0A7E6E; }

/* ── Cards Wrap ── */
.cards-wrap { display: flex; flex-direction: column; gap: 12px; padding-top: 14px; }

/* ── Appointment Card ── */
.appt-card {
  border-radius: 20px; overflow: hidden;
  background: rgba(255,255,255,0.9);
  border: 1.5px solid rgba(0,0,0,0.055);
  box-shadow: 0 3px 14px rgba(10,126,110,0.07);
  animation: slideIn .35s cubic-bezier(.25,.8,.25,1) both;
}
.card-body { padding: 16px 16px 14px; }

/* Status bar */
.status-bar          { height: 3.5px; }
.status-bar--confirmed   { background: linear-gradient(90deg,#0c9b80,#3dba8a); }
.status-bar--pending     { background: linear-gradient(90deg,#f0a500,#f5c842); }
.status-bar--cancelled   { background: linear-gradient(90deg,#e74c3c,#ff7675); }
.status-bar--rescheduled { background: linear-gradient(90deg,#8e44ad,#bb8fce); }

/* Doctor Row */
.doc-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.doc-avatar {
  width: 46px; height: 46px; border-radius: 14px; flex-shrink: 0;
  font-size: 16px; font-weight: 700; color: white;
  background: linear-gradient(145deg,#0c9b80,#0A7E6E);
  box-shadow: 0 3px 10px rgba(10,126,110,0.28);
  font-family: 'Sora', sans-serif;
}
.doc-avatar--past { background: linear-gradient(145deg,#0d7a9c,#0a5f7a); }
.doc-info  { flex: 1; min-width: 0; }
.doc-name  { font-size: 15px; font-weight: 700; color: #0d2922; }
.doc-spec  { font-size: 12px; color: #8ab5ae; font-family: 'DM Sans', sans-serif; margin-top: 2px; }

/* Status Badge */
.status-badge {
  flex-shrink: 0; font-size: 10.5px; font-weight: 700; letter-spacing: .3px;
  padding: 4px 10px; border-radius: 20px; font-family: 'DM Sans', sans-serif;
}
.badge--confirmed   { background: rgba(10,126,110,0.1);  color: #0A7E6E; }
.badge--pending     { background: rgba(240,165,0,0.12);  color: #d4920a; }
.badge--cancelled   { background: rgba(231,76,60,0.1);   color: #c0392b; }
.badge--rescheduled { background: rgba(142,68,173,0.1);  color: #7d3c98; }

/* Info Grid */
.info-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;
}
.info-cell {
  background: rgba(10,126,110,0.04); border-radius: 12px; padding: 10px 12px;
  border: 1px solid rgba(10,126,110,0.08);
}
.info-cell--full { grid-column: 1 / -1; }
.info-lbl {
  font-size: 9.5px; font-weight: 600; color: #9abfba;
  letter-spacing: .5px; text-transform: uppercase;
  font-family: 'DM Sans', sans-serif; margin-bottom: 4px;
}
.info-val {
  font-size: 13px; font-weight: 600; color: #0d2922;
  font-family: 'DM Sans', sans-serif; line-height: 1.3;
  display: flex; align-items: center; gap: 6px;
}

/* Card Actions */
.card-actions { display: flex; gap: 8px; }
.btn-primary {
  flex: 1; height: 40px; border-radius: 12px;
  background: linear-gradient(145deg,#0c9b80,#0A7E6E);
  color: white; font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  box-shadow: 0 3px 12px rgba(10,126,110,0.28);
  transition: transform .12s ease;
}
.btn-primary:active { transform: scale(.97); }
.btn-primary--past {
  background: linear-gradient(145deg,#0d7a9c,#0a5f7a);
  box-shadow: 0 3px 12px rgba(13,122,156,0.28);
}
.btn-ghost {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  background: rgba(10,126,110,0.07); border: 1px solid rgba(10,126,110,0.12);
  transition: background .15s;
}
.btn-ghost:hover { background: rgba(10,126,110,0.12); }

/* Divider */
.divider { height: 1px; background: rgba(10,126,110,0.07); margin: 2px 0 12px; }

/* Past Extras */
.past-extras { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
.charge-row {
  background: linear-gradient(135deg,rgba(10,126,110,0.07),rgba(10,126,110,0.04));
  border: 1px solid rgba(10,126,110,0.12); border-radius: 12px; padding: 10px 14px;
}
.charge-lbl { font-size: 12px; font-weight: 600; color: #5a9e96; font-family: 'DM Sans', sans-serif; }
.charge-amt { font-size: 16px; font-weight: 800; color: #0A7E6E; font-family: 'Sora', sans-serif; }
.followup-row {
  background: rgba(240,165,0,0.07); border: 1px solid rgba(240,165,0,0.18);
  border-radius: 12px; padding: 10px 14px;
}
.followup-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #f0a500; flex-shrink: 0; animation: pulseDot 2s ease infinite;
}
.followup-txt  { font-size: 12.5px; font-weight: 600; color: #a07000; font-family: 'DM Sans', sans-serif; }
.followup-date { font-size: 12px; color: #b8860b; font-family: 'DM Sans', sans-serif; margin-left: auto; font-weight: 600; }

/* Empty State */
.empty-state {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 48px 20px; text-align: center;
}
.empty-icon {
  width: 72px; height: 72px; border-radius: 20px;
  background: rgba(10,126,110,0.08); border: 1.5px solid rgba(10,126,110,0.12);
}
.empty-title { font-size: 16px; font-weight: 700; color: #0d2922; }
.empty-sub   { font-size: 13px; color: #8ab5ae; font-family: 'DM Sans', sans-serif; line-height: 1.5; }

/* Skeleton Loader */
@keyframes skelShimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.appt-skeleton {
  background: white; border-radius: 20px; overflow: hidden;
  border: 1.5px solid rgba(10,126,110,0.08);
  box-shadow: 0 3px 14px rgba(10,126,110,0.07);
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
