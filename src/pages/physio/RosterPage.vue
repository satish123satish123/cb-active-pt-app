<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ HERO ============ -->
      <div class="hero" style="padding-bottom: 54px">
        <div class="hero-row">
          <div>
            <p class="subtle">Your shifts</p>
            <h2 class="font-sora">Roster</h2>
          </div>
          <div class="avatar">{{ avatarInitials }}</div>
        </div>
        <p class="subtle" style="margin-top: 8px">
          Next few days — tap a day to set working hours, leave, week-off or holiday. Changes need
          front-desk approval.
        </p>
      </div>

      <!-- ============ DAY CARDS ============ -->
      <div class="stack section">
        <div v-if="rosterLoading" class="card" style="text-align: center; color: var(--text-3)">
          Loading your roster…
        </div>
        <div v-else-if="!roster.length" class="card" style="text-align: center; color: var(--text-3)">
          No roster found.
        </div>
        <div v-for="(r, i) in roster" :key="r.date" class="card">
          <div class="between">
            <div>
              <strong>{{ dayName(r.date) }}{{ r.date === todayISO ? ' · Today' : '' }}</strong>
              <div class="muted">{{ fmtDate(r.date) }}</div>
            </div>
            <span v-if="r.kind === 'work' && r.hasTimes" class="badge success">
              {{ ampm(r.start) }} – {{ ampm(r.end) }}
            </span>
            <span v-else-if="r.kind === 'work'" class="badge success">Working</span>
            <span v-else-if="r.kind === 'not_set'" class="badge muted">Not set</span>
            <span v-else class="badge" :class="dayKinds[r.kind].badge">
              {{ dayKinds[r.kind].label }}
            </span>
          </div>
          <div class="row" style="margin-top: 12px; gap: 8px">
            <button class="btn ghost small grow" @click="openEdit(i)">Edit day</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ EDIT DAY BOTTOM SHEET ============ -->
    <div v-if="editIdx !== null" class="scrim" @click="closeEdit">
      <div class="sheet" @click.stop>
        <div class="grabber"></div>
        <h2 class="font-sora" style="margin: 0 0 12px; font-size: 19px">
          {{ dayName(roster[editIdx].date) }}, {{ fmtDate(roster[editIdx].date) }}
        </h2>

        <p class="field-label">Day type</p>
        <div class="chips">
          <button
            v-for="(k, key) in dayKinds"
            :key="key"
            class="chip"
            :class="{ active: draft.kind === key }"
            @click="setKind(key)"
          >
            {{ k.label === 'Working' || k.label === 'Week off' ? k.label : k.editLabel || k.label }}
          </button>
        </div>

        <template v-if="draft.kind === 'work'">
          <p class="field-label" style="margin-top: 16px">Shift start</p>
          <input v-model="draft.start" class="input" type="time" @change="autoEnd" />
          <p class="field-label" style="margin-top: 14px">Shift end</p>
          <input v-model="draft.end" class="input" type="time" />
          <p class="tiny" style="margin-top: 8px">
            Ends {{ SHIFT_HOURS }} hours after start automatically — adjust if needed.
          </p>
        </template>

        <button class="btn primary full" style="margin-top: 18px" @click="saveDay">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/authStore'
import { getPhysioRoster, resolveDoctorId } from './physioApi'
import { initials } from './physioDemoData'

const SHIFT_HOURS = 9

/* ---------------- dates ---------------- */
const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const TODAY = new Date()
const todayISO = isoDate(TODAY)
const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
const dayName = (iso) => new Date(iso + 'T00:00').toLocaleDateString('en-IN', { weekday: 'long' })
const fmtDate = (iso) =>
  new Date(iso + 'T00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
function ampm(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`
}
function addHoursStr(t, h) {
  const [hh, mm] = t.split(':').map(Number)
  const tot = (((hh * 60 + mm + h * 60) % 1440) + 1440) % 1440
  return `${String(Math.floor(tot / 60)).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`
}

/* ---------------- physio identity ---------------- */
const authStore = useAuthStore()
const doctorName = ref(authStore.user?.username || 'Physio')
const avatarInitials = computed(() => initials(String(doctorName.value).replace(/^Dr\.?\s*/i, '')) || 'PT')

/* ---------------- roster demo data (API later) ---------------- */
const dayKinds = {
  work: { label: 'Working', badge: 'success' },
  weekoff: { label: 'Week off', badge: 'muted' },
  leave: { label: 'On leave', badge: 'info', editLabel: 'Leave' },
  holiday: { label: 'Holiday', badge: 'pending' },
}
const KIND_FROM_API = {
  working: 'work',
  work: 'work',
  weekoff: 'weekoff',
  week_off: 'weekoff',
  leave: 'leave',
  holiday: 'holiday',
  not_set: 'not_set',
}

/* ---------------- roster — LIVE via getPhysioRoster API ---------------- */
const rosterLoading = ref(true)
const roster = ref([])

function demoRoster() {
  return [
    { date: isoDate(TODAY), kind: 'work', start: '09:00', end: '18:00' },
    { date: isoDate(addDays(TODAY, 1)), kind: 'work', start: '09:00', end: '18:00' },
    { date: isoDate(addDays(TODAY, 2)), kind: 'work', start: '12:00', end: '21:00' },
    { date: isoDate(addDays(TODAY, 3)), kind: 'weekoff', start: '09:00', end: '18:00' },
    { date: isoDate(addDays(TODAY, 4)), kind: 'holiday', start: '09:00', end: '18:00' },
  ]
}

async function loadRoster() {
  rosterLoading.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await getPhysioRoster(doctorId)
    if (data?.status !== 'success') throw new Error('bad response')
    if (data.doctor_name) doctorName.value = data.doctor_name
    const list = Array.isArray(data.roster)
      ? data.roster
      : [data.today_roster, data.tomorrow_roster].filter(Boolean)
    roster.value = list.map((r) => ({
      date: r.date,
      kind: KIND_FROM_API[r.status] || 'not_set',
      start: r.scheduled_start || '09:00',
      end: r.scheduled_end || '18:00',
      hasTimes: !!(r.scheduled_start && r.scheduled_end),
    }))
  } catch (e) {
    console.log('getPhysioRoster failed — falling back to demo roster:', e)
    roster.value = demoRoster()
  } finally {
    rosterLoading.value = false
  }
}
loadRoster()

/* ---------------- edit sheet (UI only — API later) ---------------- */
const editIdx = ref(null)
const draft = reactive({ kind: 'work', start: '09:00', end: '18:00' })

function openEdit(i) {
  const r = roster.value[i]
  draft.kind = r.kind
  draft.start = r.start
  draft.end = r.end
  editIdx.value = i
}
function closeEdit() {
  editIdx.value = null
}
function setKind(k) {
  draft.kind = k
}
function autoEnd() {
  if (draft.start) draft.end = addHoursStr(draft.start, SHIFT_HOURS)
}
/* TODO(API): call the roster-update endpoint here when backend delivers it —
   currently saves locally only, resets on refresh. */
function saveDay() {
  const r = roster.value[editIdx.value]
  r.kind = draft.kind
  if (draft.kind === 'work') {
    r.start = draft.start
    r.end = draft.end
    r.hasTimes = true
  }
  closeEdit()
  Notify.create({ message: 'Day updated' })
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
  --brand-2: #0f9886;
  --brand-3: #d8f1eb;
  --danger: #d9485f;
  --warning: #c78810;
  --success: #1f8a4d;
  --info: #2563eb;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
  --shadow-md: 0 14px 34px rgba(16, 33, 42, 0.1);
  --shadow-lg: 0 22px 50px rgba(16, 33, 42, 0.14);
  --grad: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);
  --grad-soft: linear-gradient(135deg, #edf9f6 0%, #e5f3f5 100%);

  background: var(--bg);
  max-width: 460px;
  margin: 0 auto;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}
.ph-screen {
  min-height: 100vh;
  padding-bottom: 98px;
  animation: ph-fade 0.25s ease;
}
@keyframes ph-fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
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
  position: relative;
  z-index: 1;
}
.hero p {
  margin: 0;
  position: relative;
  z-index: 1;
}
.subtle {
  color: rgba(255, 255, 255, 0.84);
  font-size: 13px;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.35);
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
  gap: 12px;
}
.between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.grow {
  flex: 1;
}
.muted {
  color: var(--text-2);
  font-size: 13px;
}
.tiny {
  color: var(--text-3);
  font-size: 12px;
}

/* ============ cards ============ */
.card {
  background: var(--card);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  padding: 16px;
  border: 1px solid rgba(220, 231, 234, 0.85);
}
.card + .card {
  margin-top: 12px;
}

/* badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.badge.success { background: #e6f7ed; color: var(--success); }
.badge.info { background: #e6efff; color: var(--info); }
.badge.pending { background: #efeaff; color: #6d4bff; }
.badge.muted { background: #eef3f4; color: var(--text-2); }

/* chips */
.chip {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #f0f6f6;
  color: var(--text-2);
  border: 1px solid var(--line);
  cursor: pointer;
}
.chip.active {
  background: var(--brand);
  color: #fff;
  border-color: var(--brand);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

/* buttons */
.btn {
  border: none;
  cursor: pointer;
  border-radius: 14px;
  min-height: 46px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition: 0.18s ease;
}
.btn:active {
  transform: scale(0.985);
}
.btn.primary {
  background: var(--grad);
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn.ghost {
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--line);
}
.btn.small {
  min-height: 36px;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 13px;
}
.btn.full {
  width: 100%;
}

/* fields */
.field-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-2);
  margin: 0 0 6px 2px;
  letter-spacing: 0.01em;
}
.input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 11px 12px;
  background: #fff;
  color: var(--text);
  outline: none;
  font-size: 15px;
}
.input:focus {
  border-color: var(--brand-2);
  box-shadow: 0 0 0 3px rgba(15, 152, 134, 0.12);
}

/* ============ bottom sheet ============ */
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(16, 33, 42, 0.45);
  z-index: 40;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ph-fade 0.2s ease;
}
.sheet {
  width: 100%;
  max-width: 460px;
  background: #fff;
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
  padding: 18px 18px calc(18px + env(safe-area-inset-bottom));
  max-height: 86vh;
  overflow: auto;
  animation: ph-slideup 0.26s ease;
}
@keyframes ph-slideup {
  from { transform: translateY(40px); opacity: 0.6; }
  to { transform: translateY(0); opacity: 1; }
}
.grabber {
  width: 40px;
  height: 5px;
  border-radius: 99px;
  background: var(--line);
  margin: 0 auto 14px;
}
</style>