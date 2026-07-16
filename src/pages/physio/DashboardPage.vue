<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ HERO ============ -->
      <div class="hero">
        <div class="hero-row">
          <div>
            <p class="subtle">{{ dateLine }}</p>
            <h1 class="font-sora">Hi, {{ firstNameShort }} 👋</h1>
          </div>
          <div class="row" style="gap: 10px">
            <button class="icon-btn" title="Reset demo" @click="resetDemo">↻</button>
            <div class="avatar">{{ avatarInitials }}</div>
          </div>
        </div>

        <!-- Attendance (live: getPhysioRoster) -->
        <div style="margin-top: 14px">
          <!-- Loading -->
          <div v-if="rosterLoading" class="att-card" style="background: rgba(255, 255, 255, 0.12)">
            <div class="row" style="gap: 10px">
              <span style="font-size: 18px">⏳</span>
              <div style="font-weight: 800">Loading today's shift…</div>
            </div>
          </div>

          <!-- Off today (leave / week off / holiday) -->
          <div v-else-if="offToday" class="att-card" style="background: rgba(255, 255, 255, 0.12)">
            <div class="row" style="gap: 10px">
              <span style="font-size: 22px">🌴</span>
              <div>
                <div style="font-weight: 800">You're {{ offLabel }} today</div>
                <div class="subtle">{{ tomorrow.headline }} {{ tomorrow.sub }}</div>
              </div>
            </div>
          </div>

          <!-- Checked out -->
          <div v-else-if="checkedOutAt" class="att-card" style="background: rgba(255, 255, 255, 0.12)">
            <div class="row" style="gap: 10px">
              <span style="font-size: 22px">{{ tomorrow.emoji }}</span>
              <div>
                <div style="font-weight: 800">Checked out · {{ ampm(checkedOutAt) }}</div>
                <div class="subtle">{{ tomorrow.headline }} {{ tomorrow.sub }}</div>
              </div>
            </div>
          </div>

          <!-- On shift -->
          <div v-else-if="checkedInAt" class="att-card" style="border-color: rgba(124, 255, 178, 0.55)">
            <div class="between">
              <div class="row" style="gap: 10px">
                <span class="ph-dot" style="background: #7cffb2; box-shadow: 0 0 0 4px rgba(124, 255, 178, 0.25)"></span>
                <div>
                  <div style="font-weight: 800">On shift since {{ ampm(checkedInAt) }}</div>
                  <div class="subtle">Today {{ shiftStr }}</div>
                </div>
              </div>
              <button
                class="btn small"
                style="background: #fff; color: var(--danger); font-weight: 800"
                :disabled="checkoutBusy"
                @click="checkOut"
              >
                {{ checkoutBusy ? 'Checking out…' : 'Check out' }}
              </button>
            </div>
          </div>

          <!-- Not checked in -->
          <div v-else class="att-card attn">
            <div class="between">
              <div class="row" style="gap: 10px">
                <span style="font-size: 18px">⏰</span>
                <div>
                  <div style="font-weight: 800; color: var(--text)">Check in to start your shift</div>
                  <div style="font-size: 12.5px; color: #9a7212">Today {{ shiftStr }}</div>
                </div>
              </div>
              <button class="btn small primary pulse" :disabled="checkinBusy" @click="checkIn">
                {{ checkinBusy ? 'Checking in…' : 'Check in' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ STATS ============ -->
      <div class="stack section">
        <div class="row" style="gap: 10px">
          <div class="stat" :class="{ active: filter === 'all' }" @click="filter = 'all'">
            <div class="n">{{ todays.length }}</div>
            <div class="l">Patients today</div>
          </div>
          <div class="stat" :class="{ active: filter === 'waiting' }" @click="filter = 'waiting'">
            <div class="n" style="color: var(--warning)">{{ waitingCount }}</div>
            <div class="l">Waiting now</div>
          </div>
          <div class="stat" :class="{ active: filter === 'seen' }" @click="filter = 'seen'">
            <div class="n" style="color: var(--success)">{{ seenCount }}</div>
            <div class="l">Seen</div>
          </div>
        </div>
      </div>

      <!-- ============ PENDING CONFIRMATIONS ============ -->
      <div v-if="pending.length" class="section">
        <div class="section-title">
          <h3 class="font-sora">Needs your confirmation</h3>
          <span class="badge pending">{{ pending.length }}</span>
        </div>

        <div v-for="a in pending" :key="a.id" class="card" style="border-color: #ddd2ff">
          <div class="between">
            <div class="row" style="gap: 12px">
              <div class="q-avatar-ph" style="background: #efeaff; color: #6d4bff">
                {{ initials(a.patient.name) }}
              </div>
              <div>
                <div style="font-weight: 800">
                  {{ a.patient.name }}
                  <span class="tiny">· {{ a.patient.age }}{{ a.patient.sex }}</span>
                </div>
                <div class="muted" style="font-size: 12.5px">{{ a.patient.line2 }}</div>
                <div class="tiny" style="color: #6d4bff; font-weight: 700; margin-top: 2px">
                  {{ whenLabel(a) }} · {{ a.source || 'Booking' }}
                </div>
              </div>
            </div>
          </div>
          <div class="row" style="gap: 10px; margin-top: 12px">
            <button class="btn ghost small" style="flex: none; width: 38%" @click="decline(a)">Decline</button>
            <button class="btn primary small grow" @click="openConfirm(a)">Confirm appointment</button>
          </div>
        </div>
      </div>

      <!-- ============ TODAY'S QUEUE ============ -->
      <div class="section">
        <div class="section-title">
          <h3 class="font-sora">Today's queue{{ filterLabel ? ` · ${filterLabel}` : '' }}</h3>
          <span v-if="filter !== 'all'" class="link" @click="filter = 'all'">Show all</span>
          <span v-else class="muted" style="font-size: 12px">{{ clinicShort }}</span>
        </div>

        <template v-if="shown.length">
          <div v-for="a in activeList" :key="a.id" class="card q-card-ph">
            <div class="q-avatar-ph">{{ initials(a.patient.name) }}</div>
            <div class="grow">
              <div class="between">
                <div class="ph-time">{{ a.timeLabel }}</div>
                <span class="badge" :class="statusOf(a).cls">
                  <span class="ph-dot" :style="{ background: statusOf(a).color }"></span>{{ statusOf(a).label }}
                </span>
              </div>
              <div style="font-weight: 800; margin-top: 2px">
                {{ a.patient.name }}
                <span class="tiny">· {{ a.patient.age }}{{ a.patient.sex }}</span>
              </div>
              <div class="muted" style="font-size: 12.5px">{{ a.patient.line2 }}</div>
              <div class="chips">
                <span class="chip">{{ a.patient.billingChip }}</span>
                <span
                  v-if="a.patient.painChip"
                  class="chip"
                  style="background: #fff4dd; color: var(--warning); border-color: #ffe6b0"
                >
                  {{ a.patient.painChip }}
                </span>
              </div>
              <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap">
                <button v-if="a.status === 'checked_in'" class="btn primary small" @click="start(a)">
                  Start treatment →
                </button>
                <button v-else-if="a.status === 'in_treatment'" class="btn primary small" @click="start(a)">
                  Resume →
                </button>
                <button v-else-if="a.status === 'done'" class="btn secondary small" @click="invoice(a)">
                  Generate invoice →
                </button>
                <span v-else-if="a.status === 'invoiced'" class="badge warn">Awaiting payment at counter</span>
                <span v-else-if="a.status === 'booked'" class="tiny">Reception will check in</span>
                <button
                  v-if="['invoiced', 'paid'].includes(a.status) && !a.followUp"
                  class="btn secondary small"
                  @click="bookFollowUp(a)"
                >
                  Book follow-up →
                </button>
              </div>
            </div>
          </div>

          <template v-if="completedList.length">
            <div class="tiny" style="margin: 16px 4px 8px; color: var(--text-3); font-weight: 800; letter-spacing: 0.05em">
              COMPLETED
            </div>
            <div v-for="a in completedList" :key="a.id" class="card q-card-ph">
              <div class="q-avatar-ph">{{ initials(a.patient.name) }}</div>
              <div class="grow">
                <div class="between">
                  <div class="ph-time">{{ a.timeLabel }}</div>
                  <span class="badge success"><span class="ph-dot" style="background: #1f8a4d"></span>Paid</span>
                </div>
                <div style="font-weight: 800; margin-top: 2px">
                  {{ a.patient.name }}
                  <span class="tiny">· {{ a.patient.age }}{{ a.patient.sex }}</span>
                </div>
                <div class="muted" style="font-size: 12.5px">{{ a.patient.line2 }}</div>
                <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap">
                  <span class="badge success">✓ Complete</span>
                  <button v-if="!a.followUp" class="btn secondary small" @click="bookFollowUp(a)">
                    Book follow-up →
                  </button>
                </div>
              </div>
            </div>
          </template>
        </template>

        <div v-else-if="apptsLoading" class="card" style="text-align: center; color: var(--text-3)">
          Loading today's appointments…
        </div>
        <div v-else class="card" style="text-align: center; color: var(--text-3)">
          No {{ filter === 'all' ? 'confirmed patients for today yet' : filter + ' patients' }}.
        </div>
      </div>
    </div>

    <!-- ============ CONFIRM APPOINTMENT SHEET ============ -->
    <div v-if="confirmAppt" class="scrim" @click="closeConfirm">
      <div class="sheet" @click.stop>
        <div class="grabber"></div>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">Confirm appointment</h2>
        <p class="muted" style="margin: 0 0 14px">
          {{ confirmAppt.patient.name }} · {{ confirmAppt.patient.line2 }}
        </p>
        <div class="card" style="margin-bottom: 14px">
          <div class="between">
            <span class="muted">Date</span>
            <strong>{{ confirmAppt.date === todayISO ? 'Today' : whenLabel(confirmAppt).split(' · ')[0] }}</strong>
          </div>
        </div>
        <p class="field-label">Appointment time</p>
        <input v-model="confirmTime" class="input" type="time" />
        <p class="tiny" style="margin-top: 8px">
          Pre-filled with the requested slot — adjust to the time you'll actually see them.
        </p>
        <button class="btn primary full" style="margin-top: 16px" @click="doConfirm">Confirm appointment</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/authStore'
import { PHYSIO, PATIENTS, APPTS, STATUS, todayISO, initials } from './physioDemoData'
import { getPhysioRoster, getPhysioTodayAppointments, physioCheckin, physioCheckout, resolveDoctorId } from './physioApi'

const router = useRouter()
const authStore = useAuthStore()

/* ---------------- clock ---------------- */
const TODAY = new Date()
const dateLine = `${TODAY.toLocaleDateString('en-IN', { weekday: 'long' })}, ${TODAY.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`

function ampm(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`
}
function to24(t12) {
  // "04:45 PM" -> "16:45"
  if (!t12) return '00:00'
  const m = String(t12).trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!m) return t12 // already 24h
  let h = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'PM') h += 12
  return `${String(h).padStart(2, '0')}:${m[2]}`
}
function nowHM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/* ---------------- physio identity (name upgraded from roster API) ---------------- */
const doctorName = ref(authStore.user?.username || PHYSIO.name)
const clinicShort = ref('')
const firstNameShort = computed(() => {
  const clean = String(doctorName.value).replace(/^Dr\.?\s*/i, '')
  return clean.split(/[\s-]+/)[0] || clean
})
const avatarInitials = computed(() => initials(String(doctorName.value).replace(/^Dr\.?\s*/i, '')) || 'PT')

/* ---------------- attendance — LIVE via getPhysioRoster API ---------------- */
const rosterLoading = ref(true)
const todayRoster = ref(null) // { status, scheduled_start, scheduled_end, checkin, checkout }
const tomorrowRoster = ref(null)

const checkedInAt = computed(() => todayRoster.value?.checkin || null)
const checkedOutAt = computed(() => todayRoster.value?.checkout || null)
const OFF_STATUSES = ['leave', 'weekoff', 'week_off', 'holiday']
const offToday = computed(() => !!todayRoster.value && OFF_STATUSES.includes(todayRoster.value.status))

const OFF_LABEL = { leave: 'on leave', weekoff: 'on week off', week_off: 'on week off', holiday: 'on holiday' }
const offLabel = computed(() => OFF_LABEL[todayRoster.value?.status] || todayRoster.value?.status || '')

const shiftStr = computed(() => {
  const r = todayRoster.value
  if (r?.scheduled_start && r?.scheduled_end) return `${ampm(r.scheduled_start)} – ${ampm(r.scheduled_end)}`
  return '9:00 AM – 6:00 PM'
})

const tomorrow = computed(() => {
  const t = tomorrowRoster.value
  if (!t) return { emoji: '💪', headline: 'See you tomorrow!', sub: '' }
  if (t.status === 'working')
    return {
      emoji: '💪',
      headline: 'See you tomorrow!',
      sub: t.scheduled_start ? `${ampm(t.scheduled_start)} – ${ampm(t.scheduled_end)}` : '',
    }
  if (OFF_LABEL[t.status])
    return { emoji: '🌴', headline: `Tomorrow you're ${OFF_LABEL[t.status]}.`, sub: 'Rest well!' }
  return { emoji: '💪', headline: 'See you tomorrow!', sub: '' }
})

async function loadRoster() {
  rosterLoading.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await getPhysioRoster(doctorId)
    if (data?.status === 'success') {
      if (Array.isArray(data.roster)) {
        // New shape: roster: [ { date, status, scheduled_start, ... }, ... ]
        const tomorrowD = new Date(TODAY)
        tomorrowD.setDate(tomorrowD.getDate() + 1)
        const tomorrowISO = `${tomorrowD.getFullYear()}-${String(tomorrowD.getMonth() + 1).padStart(2, '0')}-${String(tomorrowD.getDate()).padStart(2, '0')}`
        todayRoster.value = data.roster.find((r) => r.date === todayISO) || data.roster[0] || null
        tomorrowRoster.value = data.roster.find((r) => r.date === tomorrowISO) || null
      } else {
        // Original shape: today_roster / tomorrow_roster objects
        todayRoster.value = data.today_roster || null
        tomorrowRoster.value = data.tomorrow_roster || null
      }
      if (data.doctor_name) doctorName.value = data.doctor_name
    }
  } catch (e) {
    console.log('getPhysioRoster failed:', e)
  } finally {
    rosterLoading.value = false
  }
}
loadRoster()

/* check-in — LIVE via physioCheckin API */
const checkinBusy = ref(false)
async function checkIn() {
  if (checkinBusy.value) return
  checkinBusy.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await physioCheckin(doctorId)
    if (data?.status === 'success') {
      const t = data.checkin || nowHM()
      if (todayRoster.value) todayRoster.value.checkin = t
      else todayRoster.value = { status: 'working', checkin: t, checkout: '' }
      Notify.create({ type: 'positive', message: data.message || 'Checked in successfully.' })
    } else {
      Notify.create({ type: 'negative', message: data?.message || 'Check-in failed' })
    }
  } catch (e) {
    console.log('physioCheckin failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Check-in failed — try again' })
  } finally {
    checkinBusy.value = false
  }
}
/* check-out — LIVE via physioCheckout API */
const checkoutBusy = ref(false)
async function checkOut() {
  if (checkoutBusy.value) return
  checkoutBusy.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await physioCheckout(doctorId)
    if (data?.status === 'success') {
      if (todayRoster.value) todayRoster.value.checkout = data.checkout || nowHM()
      Notify.create({ type: 'positive', message: data.message || 'Checked out successfully.' })
    } else {
      Notify.create({ type: 'negative', message: data?.message || 'Check-out failed' })
    }
  } catch (e) {
    console.log('physioCheckout failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Check-out failed — try again' })
  } finally {
    checkoutBusy.value = false
  }
}

/* =====================================================================
   APPOINTMENTS — LIVE via getPhysioTodayAppointments API
   Normalised shape used by the template (same for API + demo fallback):
   { id, patient:{name,age,sex,line2,billingChip,painChip}, timeLabel,
     time24, date, status, source, followUp }
===================================================================== */
const apptsLoading = ref(true)
const usingDemo = ref(false)
const queue = ref([])

const API_STATUS_MAP = {
  'Pending Confirmation': 'pending',
  Confirmed: 'booked',
  Treated: 'done',
  Cancelled: 'declined',
}
const PT_STATUS_LINE = {
  Daily: 'Daily patient',
  InPackage: 'Package patient',
  NotConverted: 'New enquiry',
}

function normalizeApi(a, groupStatus) {
  let status = API_STATUS_MAP[a.status] || groupStatus || 'booked'
  if (status === 'done') {
    if (a.payment_status === 'paid') status = 'paid'
    else if (a.payment_status === 'pending') status = 'invoiced'
  }
  const billingChip =
    a.package_total_sessions
      ? `${a.package_quantity ?? 0}/${a.package_total_sessions} sessions`
      : a.patient_status === 'InPackage'
        ? 'Package'
        : 'Per-visit'
  return {
    id: a.id,
    date: a.date,
    time24: to24(a.s_time),
    timeLabel: a.s_time || '',
    status,
    source: 'New booking',
    followUp: null,
    patient: {
      name: a.patient_name,
      age: a.patient_age,
      sex: (a.patient_sex || '').charAt(0).toUpperCase(),
      line2: PT_STATUS_LINE[a.patient_status] || a.patient_status || '',
      billingChip,
      painChip: null,
    },
  }
}

function normalizeDemo(a) {
  const p = PATIENTS[a.pid]
  return {
    id: a.id,
    date: a.date,
    time24: a.time,
    timeLabel: ampm(a.time),
    status: a.status,
    source: a.source || 'Booking',
    followUp: a.followUp,
    patient: {
      name: p.name,
      age: p.age,
      sex: p.sex,
      line2: p.condition,
      billingChip: p.package ? `${p.package.used}/${p.package.total} sessions` : 'Per-visit',
      painChip: p.feedback ? `Pain ${p.feedback.pain}/10 from app` : null,
    },
    _demo: true,
  }
}

async function loadAppointments() {
  apptsLoading.value = true
  usingDemo.value = false
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await getPhysioTodayAppointments(doctorId)
    if (data?.status !== 'success') throw new Error('bad response')
    const g = data.appointments || {}
    queue.value = [
      ...(g.pending_confirmation || []).map((a) => normalizeApi(a, 'pending')),
      ...(g.confirmed || []).map((a) => normalizeApi(a, 'booked')),
      ...(g.treated || []).map((a) => normalizeApi(a, 'done')),
      ...(g.other || []).map((a) => normalizeApi(a, 'booked')),
    ]
    if (data.doctor_name) doctorName.value = data.doctor_name
  } catch (e) {
    console.log('getPhysioTodayAppointments failed — falling back to demo data:', e)
    usingDemo.value = true
    queue.value = APPTS.filter((a) => a.status !== 'declined').map(normalizeDemo)
  } finally {
    apptsLoading.value = false
  }
}
loadAppointments()

const statusOf = (a) => STATUS[a.status] || STATUS.booked

/* ---------------- derived lists ---------------- */
const filter = ref('all')
const live = computed(() => queue.value.filter((a) => a.status !== 'declined'))
const pending = computed(() =>
  live.value.filter((a) => a.status === 'pending').sort((x, y) => (x.date + x.time24).localeCompare(y.date + y.time24)),
)
const todays = computed(() => live.value.filter((a) => a.date === todayISO && a.status !== 'pending'))
const waitingCount = computed(() => todays.value.filter((a) => ['booked', 'checked_in'].includes(a.status)).length)
const seenCount = computed(() => todays.value.filter((a) => ['done', 'invoiced', 'paid'].includes(a.status)).length)

const shown = computed(() => {
  let s = todays.value.slice()
  if (filter.value === 'waiting') s = s.filter((a) => ['booked', 'checked_in'].includes(a.status))
  else if (filter.value === 'seen') s = s.filter((a) => ['done', 'invoiced', 'paid'].includes(a.status))
  s.sort((a, b) => {
    const ca = a.status === 'paid' ? 1 : 0
    const cb = b.status === 'paid' ? 1 : 0
    return ca !== cb ? ca - cb : a.time24.localeCompare(b.time24)
  })
  return s
})
const activeList = computed(() => shown.value.filter((a) => a.status !== 'paid'))
const completedList = computed(() => shown.value.filter((a) => a.status === 'paid'))
const filterLabel = computed(() => ({ all: '', waiting: 'Waiting now', seen: 'Seen' })[filter.value])

function whenLabel(a) {
  const day = a.date === todayISO
    ? 'Today'
    : new Date(a.date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  return `${day} · ${a.timeLabel}`
}

/* ---------------- confirm appointment sheet ---------------- */
const confirmAppt = ref(null)
const confirmTime = ref('')
function openConfirm(a) {
  confirmAppt.value = a
  confirmTime.value = a.time24
}
function closeConfirm() {
  confirmAppt.value = null
}
/* TODO(API): call the confirm-appointment endpoint here when backend delivers it. */
function doConfirm() {
  const a = confirmAppt.value
  if (confirmTime.value) {
    a.time24 = confirmTime.value
    a.timeLabel = ampm(confirmTime.value)
  }
  a.status = 'booked'
  closeConfirm()
  Notify.create({ type: 'positive', message: 'Appointment confirmed ✓' })
}
/* TODO(API): call the decline endpoint here when backend delivers it. */
function decline(a) {
  a.status = 'declined'
  Notify.create({ message: 'Appointment declined' })
}

/* ---------------- flow actions (flow screens still run on demo data) ---------------- */
function start(a) {
  if (a.status === 'checked_in') a.status = 'in_treatment'
  router.push(`/physio/treatment/${a._demo ? a.id : 'a1'}`)
}
function invoice(a) {
  router.push(`/physio/invoice/${a._demo ? a.id : 'a1'}`)
}
function bookFollowUp(a) {
  router.push(`/physio/followup/${a._demo ? a.id : 'a1'}`)
}
function resetDemo() {
  window.location.reload()
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
.hero h1 {
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 4px 0 0;
  line-height: 1.2;
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
.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

/* attendance card */
.att-card {
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 16px;
  padding: 12px 14px;
  color: #fff;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;
}
.att-card .subtle {
  color: rgba(255, 255, 255, 0.82);
  font-size: 12.5px;
}
.att-card.attn {
  background: #fff7e9;
  border-color: #f4d58a;
  color: var(--text);
}
@keyframes ph-attnpulse {
  0% { box-shadow: 0 0 0 0 rgba(10, 126, 110, 0.5); }
  70% { box-shadow: 0 0 0 12px rgba(10, 126, 110, 0); }
  100% { box-shadow: 0 0 0 0 rgba(10, 126, 110, 0); }
}
.pulse {
  animation: ph-attnpulse 1.8s infinite;
}

/* ============ layout helpers ============ */
.stack {
  margin-top: -52px;
  position: relative;
  z-index: 4;
}
.section {
  padding: 0 16px;
}
.section + .section {
  margin-top: 14px;
}
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 18px 4px 10px;
}
.section-title h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.section-title .link {
  color: var(--brand);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
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

/* stats */
.stat {
  flex: 1;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  transition: 0.15s;
}
.stat.active {
  border-color: var(--brand);
  background: var(--grad-soft);
  box-shadow: var(--shadow-sm);
}
.stat:active {
  transform: scale(0.98);
}
.stat .n {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.stat .l {
  font-size: 11px;
  color: var(--text-2);
  font-weight: 700;
}

/* queue card */
.q-card-ph {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
}
.q-avatar-ph {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: var(--grad-soft);
  color: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex: none;
}
.ph-time {
  font-weight: 800;
  font-size: 15px;
}
.ph-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
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
.badge.brand { background: var(--brand-3); color: var(--brand); }
.badge.success { background: #e6f7ed; color: var(--success); }
.badge.warn { background: #fff4dd; color: var(--warning); }
.badge.danger { background: #fde8ec; color: var(--danger); }
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
.btn.secondary {
  background: var(--brand-3);
  color: var(--brand);
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
.btn.full {
  width: 100%;
}

/* bottom sheet */
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