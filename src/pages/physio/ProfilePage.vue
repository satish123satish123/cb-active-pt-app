<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ HERO ============ -->
      <div class="hero" style="padding-bottom: 54px">
        <div class="hero-row">
          <div>
            <p class="subtle">Physiotherapist</p>
            <h2 class="font-sora">{{ doctorName }}</h2>
          </div>
          <div class="avatar">{{ avatarInitials }}</div>
        </div>
        <p class="subtle" style="margin-top: 8px">{{ clinic }}</p>
      </div>

      <div class="stack section">
        <!-- ============ ATTENDANCE (live: getPhysioRoster + checkin/checkout) ============ -->
        <div class="card">
          <div class="between">
            <strong>Attendance</strong>
            <span v-if="rosterLoading" class="badge muted">Loading…</span>
            <span v-else-if="offToday" class="badge muted">🌴 {{ offLabel }} today</span>
            <span v-else-if="checkedOutAt" class="badge muted">Checked out {{ ampm(checkedOutAt) }}</span>
            <span v-else-if="checkedInAt" class="badge success">On shift since {{ ampm(checkedInAt) }}</span>
            <span v-else class="badge muted">Not checked in</span>
          </div>
          <div class="tiny" style="margin-top: 8px">Today's shift: {{ shiftStr }}</div>
          <div v-if="!rosterLoading && !offToday && !checkedOutAt" class="row" style="margin-top: 12px; gap: 10px">
            <button v-if="checkedInAt" class="btn danger grow" :disabled="attBusy" @click="showCheckoutConfirm = true">
              {{ attBusy ? 'Checking out…' : 'Check out' }}
            </button>
            <button v-else class="btn primary grow" :disabled="attBusy" @click="checkIn">
              {{ attBusy ? 'Checking in…' : 'Check in for shift' }}
            </button>
          </div>
        </div>

        <!-- ============ ACCOUNT ============ -->
        <div class="card">
          <strong>Account</strong>
          <div class="muted" style="margin-top: 4px">Sign out of the physio workspace.</div>
          <button class="btn ghost full" style="margin-top: 12px" @click="logout">Log out</button>
        </div>
      </div>
    </div>

    <!-- ============ CHECK-OUT CONFIRMATION ============ -->
    <div v-if="showCheckoutConfirm" class="scrim scrim-center" @click="showCheckoutConfirm = false">
      <div class="sheet dialog" @click.stop>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">End your shift?</h2>
        <p class="muted" style="margin: 0 0 16px">
          You'll be checked out for the day. Make sure all your patients are done.
        </p>
        <div class="row" style="gap: 10px">
          <button class="btn ghost" style="flex: none; width: 38%" @click="showCheckoutConfirm = false">
            Cancel
          </button>
          <button class="btn danger grow" :disabled="attBusy" @click="confirmCheckOut">
            {{ attBusy ? 'Checking out…' : 'Yes, check out' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/authStore'
import { PHYSIO, ampm, initials } from './physioDemoData'
import { getPhysioRoster, physioCheckin, physioCheckout, resolveDoctorId } from './physioApi'

const router = useRouter()
const authStore = useAuthStore()

/* ---------------- identity (name live from roster API; clinic static for now) ---------------- */
const doctorName = ref(authStore.user?.username || PHYSIO.name)
const avatarInitials = computed(() => initials(String(doctorName.value).replace(/^Dr\.?\s*/i, '')) || 'PT')
const clinic =
  authStore.user?.hospital_name ||
  (authStore.user?.hospital_id ? `Hospital #${authStore.user.hospital_id}` : PHYSIO.clinic)

/* ---------------- attendance — LIVE (same wiring as dashboard) ---------------- */
const rosterLoading = ref(true)
const todayRoster = ref(null)
const attBusy = ref(false)

const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const todayISO = isoDate(new Date())

const checkedInAt = computed(() => todayRoster.value?.checkin || null)
const checkedOutAt = computed(() => todayRoster.value?.checkout || null)
const OFF_LABEL = { leave: 'On leave', weekoff: 'Week off', week_off: 'Week off', holiday: 'Holiday' }
const offToday = computed(() => !!todayRoster.value && !!OFF_LABEL[todayRoster.value.status])
const offLabel = computed(() => OFF_LABEL[todayRoster.value?.status] || '')

const shiftStr = computed(() => {
  const r = todayRoster.value
  if (r?.scheduled_start && r?.scheduled_end) return `${ampm(r.scheduled_start)} – ${ampm(r.scheduled_end)}`
  return '9:00 AM – 6:00 PM'
})

async function loadRoster() {
  rosterLoading.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await getPhysioRoster(doctorId)
    if (data?.status === 'success') {
      if (Array.isArray(data.roster)) {
        todayRoster.value = data.roster.find((r) => r.date === todayISO) || data.roster[0] || null
      } else {
        todayRoster.value = data.today_roster || null
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

function nowHM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function checkIn() {
  const st = todayRoster.value?.status
  if (st && st !== 'working') {
    Notify.create({ type: 'warning', message: 'Your roster is not set for today — contact the clinic admin.' })
    return
  }
  if (attBusy.value) return
  attBusy.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
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
    attBusy.value = false
  }
}

const showCheckoutConfirm = ref(false)
async function confirmCheckOut() {
  showCheckoutConfirm.value = false
  await checkOut()
}

async function checkOut() {
  if (attBusy.value) return
  attBusy.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
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
    attBusy.value = false
  }
}

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.ph-page {
  --bg: #f4f8f8;
  --card: #ffffff;
  --text: #10212a;
  --text-2: #5a6c76;
  --text-3: #8da0aa;
  --line: #dce7ea;
  --brand: #0a7e6e;
  --danger: #d9485f;
  --success: #1f8a4d;
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
  padding-bottom: 98px;
  animation: ph-fade 0.25s ease;
}
@keyframes ph-fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

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
.badge.muted { background: #eef3f4; color: var(--text-2); }

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
.btn:disabled {
  opacity: 0.65;
}
.btn.primary {
  background: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn.danger {
  background: #fff0f2;
  color: var(--danger);
}
.btn.ghost {
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--line);
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

/* centered dialog variant */
.scrim-center {
  align-items: center;
  padding: 0 24px;
}
.sheet.dialog {
  border-radius: 22px;
  max-width: 400px;
  animation: ph-pop 0.22s ease;
}
@keyframes ph-pop {
  from { transform: scale(0.94); opacity: 0.5; }
  to { transform: scale(1); opacity: 1; }
}
</style>