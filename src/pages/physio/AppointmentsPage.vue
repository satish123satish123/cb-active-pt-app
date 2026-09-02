<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ HERO ============ -->
      <div class="hero" style="padding-bottom: 64px">
        <div class="hero-row">
          <div class="row" style="gap: 10px">
            <button class="icon-btn" aria-label="Back" @click="$router.push('/physio')">←</button>
            <div>
              <p class="subtle">Your schedule</p>
              <h2 class="font-sora">Appointments</h2>
            </div>
          </div>
        </div>
        <input
          v-model="search"
          class="search"
          type="search"
          placeholder="Search by patient name…"
          aria-label="Search by patient name"
        />
      </div>

      <!-- ============ FILTER CHIPS ============ -->
      <div class="stack">
        <div class="filters">
          <button
            v-for="f in FILTERS"
            :key="f.key"
            class="fchip"
            :class="{ on: filter === f.key }"
            @click="filter = f.key"
          >
            {{ f.label }}
            <span v-if="counts[f.key]" class="fcount">{{ counts[f.key] }}</span>
          </button>
        </div>

        <div class="section">
          <!-- partial-data notice: only while the range endpoint is unavailable -->
          <div v-if="partial && !loading" class="notice">
            Sirf aaj ka data mil raha hai — poori list ke liye backend update chahiye.
          </div>

          <div v-if="loading" class="card empty">Loading appointments…</div>

          <div v-else-if="failed" class="card empty">
            Appointments load nahi ho paaye.
            <div style="margin-top: 10px">
              <button class="btn" @click="load">Retry</button>
            </div>
          </div>

          <div v-else-if="!groups.length" class="card empty">
            {{ emptyLine }}
          </div>

          <!-- ============ DATE-GROUPED LIST ============ -->
          <div v-for="g in groups" :key="g.date" class="group">
            <div class="group-head">
              <span class="group-day">{{ g.dayLabel }}</span>
              <span class="group-date">{{ g.dateLabel }}</span>
              <span class="group-count">{{ g.items.length }}</span>
            </div>

            <button
              v-for="a in g.items"
              :key="a.id"
              class="appt"
              @click="openPatient(a)"
            >
              <div class="appt-time">
                <strong>{{ a.timeLabel }}</strong>
                <span class="tiny">{{ a.durationLabel }}</span>
              </div>
              <div class="appt-body">
                <div class="appt-name">
                  {{ a.nameLine }}
                  <span class="tiny">· {{ a.age }} {{ a.sex }}</span>
                </div>
                <div v-if="a.condition" class="appt-cond">{{ a.condition }}</div>
                <div class="appt-tags">
                  <span class="badge" :class="a.state.cls">{{ a.state.label }}</span>
                  <span v-if="a.packageChip" class="badge muted">{{ a.packageChip }}</span>
                </div>
              </div>
              <span class="appt-go" aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import {
  getPhysioAppointments,
  getPhysioTodayAppointments,
  resolveDoctorId,
} from './physioApi'

const router = useRouter()
const authStore = useAuthStore()

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'today', label: 'Today' },
  { key: 'past', label: 'Past' },
  { key: 'all', label: 'All' },
]

const filter = ref('upcoming')
const search = ref('')
const loading = ref(true)
const failed = ref(false)
/* true when the range endpoint is not live yet and we fell back to today's list */
const partial = ref(false)
const rows = ref([])

/* ---------------- dates ---------------- */
const ymd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const TODAY_ISO = ymd(new Date())
const shifted = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return ymd(d)
}
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function dayLabelFor(iso) {
  if (iso === TODAY_ISO) return 'Today'
  if (iso === shifted(1)) return 'Tomorrow'
  if (iso === shifted(-1)) return 'Yesterday'
  const [y, m, d] = iso.split('-').map(Number)
  return DAYS[new Date(y, m - 1, d).getDay()]
}
function dateLabelFor(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]}${y === new Date().getFullYear() ? '' : ' ' + y}`
}

/* "09:45 AM To 10:30 AM" → "45 min" */
function durationOf(slot) {
  const parts = String(slot || '').split(/\s+To\s+/i)
  if (parts.length !== 2) return ''
  const mins = (t) => {
    const m = String(t).trim().match(/^(\d{1,2}):(\d{2})\s*([AP])M$/i)
    if (!m) return null
    let h = Number(m[1]) % 12
    if (m[3].toUpperCase() === 'P') h += 12
    return h * 60 + Number(m[2])
  }
  const a = mins(parts[0])
  const b = mins(parts[1])
  if (a === null || b === null || b <= a) return ''
  return `${b - a} min`
}

/* ---------------- one row ---------------- */
const titleCase = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase())

/* The badge folds CRM status and payment state into the one thing a physio scans
   for: is this visit still ahead, done and settled, or done and owing. */
function stateOf(a) {
  if (a.status === 'Cancelled') return { label: 'Cancelled', cls: 'danger' }
  if (a.status === 'Pending Confirmation') return { label: 'Awaiting confirmation', cls: 'pending' }
  if (a.status === 'Treated') {
    if (a.payment_status === 'paid') return { label: 'Paid', cls: 'success' }
    if (a.payment_status === 'unpaid' || a.payment_status === 'pending')
      return { label: 'Payment due', cls: 'warn' }
    return { label: 'Not invoiced', cls: 'info' }
  }
  return { label: 'Confirmed', cls: 'info' }
}

function normalize(a) {
  return {
    id: a.id,
    patientId: a.patient_id,
    date: a.date,
    timeLabel: a.s_time || '',
    durationLabel: durationOf(a.time_slot),
    nameLine: [a.salutation, titleCase(a.patient_name)].filter(Boolean).join(' '),
    age: a.patient_age,
    sex: (a.patient_sex || '').charAt(0).toUpperCase(),
    condition: a.current_condition || '',
    state: stateOf(a),
    packageChip: a.package_total_sessions
      ? `${a.package_quantity ?? 0}/${a.package_total_sessions} sessions`
      : a.patient_status === 'InPackage'
        ? 'Package'
        : '',
    sortKey: `${a.date} ${to24(a.s_time)}`,
  }
}

/* "01:30 PM" → "13:30", so string sorting stays chronological */
function to24(t) {
  const m = String(t || '').trim().match(/^(\d{1,2}):(\d{2})\s*([AP])M$/i)
  if (!m) return '00:00'
  let h = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'P') h += 12
  return `${String(h).padStart(2, '0')}:${m[2]}`
}

/* ---------------- load ---------------- */
async function load() {
  loading.value = true
  failed.value = false
  partial.value = false
  try {
    const doctorId = Number(resolveDoctorId(authStore.user))
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const res = await getPhysioAppointments({
      doctor_id: doctorId,
      from: shifted(-180),
      to: shifted(180),
    })
    if (res?.status !== 'success' || !Array.isArray(res.appointments)) throw new Error('bad shape')
    rows.value = res.appointments.map(normalize)
  } catch (e) {
    /* The range endpoint does not exist yet. Fall back to today's list so the screen
       still works, and say so rather than passing it off as the full history. */
    console.log('getPhysioAppointments unavailable — falling back to today:', e)
    try {
      const res = await getPhysioTodayAppointments(Number(resolveDoctorId(authStore.user)))
      const buckets = res?.appointments || {}
      rows.value = Object.values(buckets).flat().filter(Boolean).map(normalize)
      partial.value = true
    } catch (e2) {
      console.log('getPhysioTodayAppointments failed too:', e2)
      failed.value = true
    }
  } finally {
    loading.value = false
  }
}
load()

/* ---------------- filter + group ---------------- */
const inFilter = (a, key) =>
  key === 'all' ||
  (key === 'today' && a.date === TODAY_ISO) ||
  (key === 'upcoming' && a.date >= TODAY_ISO) ||
  (key === 'past' && a.date < TODAY_ISO)

const counts = computed(() => {
  const c = { upcoming: 0, today: 0, past: 0, all: rows.value.length }
  for (const a of rows.value) {
    if (a.date >= TODAY_ISO) c.upcoming++
    if (a.date === TODAY_ISO) c.today++
    if (a.date < TODAY_ISO) c.past++
  }
  return c
})

const groups = computed(() => {
  const q = search.value.trim().toLowerCase()
  const list = rows.value.filter(
    (a) => inFilter(a, filter.value) && (!q || a.nameLine.toLowerCase().includes(q)),
  )
  // upcoming reads forward from today; past reads backward from the most recent
  const desc = filter.value === 'past'
  list.sort((x, y) => (desc ? y.sortKey.localeCompare(x.sortKey) : x.sortKey.localeCompare(y.sortKey)))

  const out = []
  let current = null
  for (const a of list) {
    if (!current || current.date !== a.date) {
      current = { date: a.date, dayLabel: dayLabelFor(a.date), dateLabel: dateLabelFor(a.date), items: [] }
      out.push(current)
    }
    current.items.push(a)
  }
  return out
})

const emptyLine = computed(() => {
  if (search.value.trim()) return `"${search.value.trim()}" ka koi appointment nahi mila.`
  return {
    upcoming: 'Koi aane wala appointment nahi.',
    today: 'Aaj koi appointment nahi.',
    past: 'Koi purana appointment nahi.',
    all: 'Abhi koi appointment nahi.',
  }[filter.value]
})

function openPatient(a) {
  if (a.patientId) router.push(`/physio/patients/${a.patientId}`)
}
</script>

<style scoped>
/* ============ design tokens (physio design system) ============ */
.ph-page {
  --bg: #f4f8f8;
  --card: #ffffff;
  --text: #10212a;
  --text-2: #5a6c76;
  --text-3: #8da0aa;
  --line: #dce7ea;
  --brand: #0a7e6e;
  --brand-3: #d8f1eb;
  --danger: #d9485f;
  --warning: #c78810;
  --success: #1f8a4d;
  --info: #2563eb;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
  --shadow-md: 0 14px 34px rgba(16, 33, 42, 0.1);
  --grad: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);

  background: var(--bg);
  max-width: 460px;
  margin: 0 auto;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
.ph-screen {
  min-height: 100vh;
  padding-bottom: 90px;
}

/* ============ hero ============ */
.hero {
  background: var(--grad);
  color: #fff;
  padding: 18px 18px 70px;
  position: relative;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: var(--shadow-md);
}
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at left 30% bottom 20%, rgba(255, 255, 255, 0.1), transparent 22%);
  pointer-events: none;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}
.hero-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.hero h2 {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.25;
}
.hero p {
  margin: 0;
}
.subtle {
  color: rgba(255, 255, 255, 0.84);
  font-size: 13px;
}
.icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 17px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}
.search {
  position: relative;
  z-index: 1;
  margin-top: 14px;
  width: 100%;
  min-height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  padding: 0 14px;
  outline: none;
}
.search::placeholder {
  color: rgba(255, 255, 255, 0.72);
}
.search:focus {
  background: rgba(255, 255, 255, 0.24);
  border-color: rgba(255, 255, 255, 0.6);
}

/* ============ layout ============ */
.stack {
  margin-top: -52px;
  position: relative;
  z-index: 4;
}
.section {
  padding: 0 16px;
}
.row {
  display: flex;
  align-items: center;
}
.tiny {
  color: var(--text-3);
  font-size: 12px;
  font-weight: 600;
}

/* ============ filter chips ============ */
.filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 16px 14px;
  scrollbar-width: none;
}
.filters::-webkit-scrollbar {
  display: none;
}
.fchip {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(220, 231, 234, 0.9);
  background: #fff;
  color: var(--text-2);
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}
.fchip.on {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}
.fcount {
  font-size: 11px;
  font-weight: 800;
  padding: 1px 7px;
  border-radius: 999px;
  background: rgba(16, 33, 42, 0.08);
  color: inherit;
}
.fchip.on .fcount {
  background: rgba(255, 255, 255, 0.24);
}

/* ============ cards / states ============ */
.card {
  background: var(--card);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  padding: 16px;
  border: 1px solid rgba(220, 231, 234, 0.85);
}
.empty {
  text-align: center;
  color: var(--text-3);
  font-size: 14px;
}
.notice {
  background: #fff4dd;
  border: 1px solid #ffe6b0;
  color: var(--warning);
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 12.5px;
  font-weight: 600;
  margin-bottom: 12px;
}
.btn {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--text-2);
  border-radius: 12px;
  min-height: 40px;
  padding: 0 16px;
  font-family: inherit;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

/* ============ date group ============ */
.group + .group {
  margin-top: 20px;
}
.group-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 0 4px 8px;
}
.group-day {
  font-weight: 800;
  font-size: 14px;
  letter-spacing: -0.01em;
}
.group-date {
  color: var(--text-3);
  font-size: 12.5px;
  font-weight: 600;
  flex: 1;
}
.group-count {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-2);
  background: #eef3f4;
  border-radius: 999px;
  padding: 2px 8px;
}

/* ============ appointment row ============ */
.appt {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  text-align: left;
  background: var(--card);
  border: 1px solid rgba(220, 231, 234, 0.85);
  border-radius: 18px;
  box-shadow: var(--shadow-sm);
  padding: 14px;
  font-family: inherit;
  color: var(--text);
  cursor: pointer;
}
.appt + .appt {
  margin-top: 10px;
}
.appt:active {
  transform: scale(0.995);
}
.appt-time {
  flex: none;
  width: 66px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 1px;
}
.appt-time strong {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.appt-body {
  flex: 1;
  min-width: 0;
}
.appt-name {
  font-weight: 800;
  font-size: 14px;
}
.appt-cond {
  color: var(--text-2);
  font-size: 12.5px;
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.appt-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.appt-go {
  flex: none;
  color: var(--text-3);
  font-size: 20px;
  line-height: 1;
  align-self: center;
}

/* badges */
.badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}
.badge.success { background: #e6f7ed; color: var(--success); }
.badge.warn { background: #fff4dd; color: var(--warning); }
.badge.danger { background: #fde8ec; color: var(--danger); }
.badge.info { background: #e6efff; color: var(--info); }
.badge.pending { background: #efeaff; color: #6d4bff; }
.badge.muted { background: #eef3f4; color: var(--text-2); }

.font-sora {
  font-family: 'Sora', ui-sans-serif, system-ui, sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  .appt:active { transform: none; }
}
</style>
