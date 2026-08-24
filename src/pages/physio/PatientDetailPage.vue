<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ TOPBAR ============ -->
      <div class="topbar">
        <button class="back" @click="$router.back()">←</button>
        <div class="grow">
          <h2 class="font-sora">{{ head.name }}</h2>
          <div class="muted" style="font-size: 12.5px">
            {{ head.age }}{{ head.sex }}<template v-if="head.phone"> · {{ head.phone }}</template>
          </div>
        </div>
        <span v-if="liveData && liveData.session_number" class="badge brand">Session {{ liveData.session_number }}</span>
      </div>

      <!-- ============ LOADING / ERROR ============ -->
      <div v-if="loading" class="section">
        <div class="card" style="text-align: center; color: var(--text-3)">Loading patient details…</div>
      </div>

      <!-- =====================================================
           LIVE MODE — getPatientTreatmentDetails
      ====================================================== -->
      <template v-else-if="liveData">
        <!-- Condition + billing -->
        <div class="section">
          <div class="card">
            <span class="badge brand">{{ liveData.patient_details.current_condition || 'Condition not set' }}</span>
            <div v-if="liveData.patient_details.address" class="tiny" style="margin-top: 8px">
              📍 {{ liveData.patient_details.address }}
            </div>
            <template v-if="billing">
              <div style="margin-top: 14px">
                <div class="between">
                  <strong style="font-size: 14px">{{ billing.payment_procedure }}</strong>
                  <span class="muted">₹{{ billing.charges_per_session }}/session</span>
                </div>
                <div class="muted" style="margin-top: 4px">
                  {{ sessionsDone }} of {{ billing.total_sessions }} sessions
                  <template v-if="billing.expired_at"> · valid till {{ billing.expired_at }}</template>
                </div>
                <div class="pkg-bar">
                  <i :style="{ width: pkgPct + '%' }"></i>
                </div>
              </div>
            </template>
            <div v-else class="muted" style="margin-top: 12px">Billing: per-visit</div>
          </div>
        </div>

        <!-- Goals / milestones -->
        <div v-if="goals.length" class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Treatment goals</h3></div>
          <div v-for="g in goals" :key="g.id" class="card">
            <div class="between">
              <strong style="font-size: 13px">Sessions {{ g.session }}</strong>
              <span class="tiny">Reassess on session {{ g.reassessment_on }}</span>
            </div>
            <div v-for="gp in g.goal_progress" :key="gp.id" style="margin-top: 10px">
              <div class="muted" style="font-size: 12.5px">{{ gp.written_goal }}</div>
              <div class="between" style="margin-top: 4px">
                <span class="tiny">{{ gp.base_value }} → {{ gp.target_value }}
                  <template v-if="gp.achieved_value"> · achieved {{ gp.achieved_value }}</template>
                </span>
                <span class="badge" :class="gp.status === 'achieved' ? 'success' : 'muted'" style="min-height: 22px; font-size: 11px">
                  {{ gp.status === 'achieved' ? '✓ Achieved' : gp.status }}
                </span>
              </div>
              <div class="pkg-bar" style="margin-top: 6px">
                <i :style="{ width: (gp.progress_percentage || 0) + '%' }"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Visit history -->
        <div class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Visit history</h3></div>
          <div v-for="v in visits" :key="v.id" class="card">
            <div class="between">
              <div>
                <strong>{{ visitDate(v) }}<template v-if="v.s_time && v.s_time !== 'Select Timeslot'">, {{ v.s_time }}</template></strong>
                <div class="tiny">
                  {{ visitDoctor(v) }}<template v-if="v.session_number"> · Session {{ v.session_number }}</template>
                  <template v-if="v.is_consultation === '1'"> · Consultation</template>
                </div>
              </div>
              <span class="badge" :class="visitBadge(v.status).cls">{{ visitBadge(v.status).label }}</span>
            </div>
            <div v-if="v.actual_session_start" class="tiny" style="margin-top: 6px">
              Session {{ v.actual_session_start }}<template v-if="v.actual_session_end"> – {{ v.actual_session_end }}</template>
            </div>
          </div>
          <div v-if="!visits.length" class="card" style="text-align: center; color: var(--text-3)">No visits yet.</div>
        </div>
      </template>

      <!-- =====================================================
           DEMO MODE — unchanged demo patients
      ====================================================== -->
      <template v-else-if="demoP">
        <div class="section">
          <div class="card">
            <span class="badge brand">{{ demoP.condition }}</span>
            <div v-if="demoP.package" style="margin-top: 14px">
              <div class="between">
                <strong style="font-size: 14px">{{ demoP.package.name }}</strong>
                <span class="muted">{{ demoP.package.used }}/{{ demoP.package.total }} used</span>
              </div>
              <div class="pkg-bar">
                <i :style="{ width: (demoP.package.used / demoP.package.total) * 100 + '%' }"></i>
              </div>
            </div>
            <div v-else class="muted" style="margin-top: 12px">Billing: per-visit</div>
          </div>
        </div>

        <div v-if="demoP.feedback" class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Latest app feedback</h3></div>
          <div class="card" style="background: var(--grad-soft); border-color: #cfeee6">
            <div class="muted">
              Pain <strong style="color: var(--warning)">{{ demoP.feedback.pain }}/10</strong> · exercises
              felt <strong>{{ demoP.feedback.difficulty }}</strong> · {{ demoP.feedback.when }}
            </div>
            <div class="muted" style="margin-top: 4px; font-style: italic">"{{ demoP.feedback.note }}"</div>
          </div>
        </div>

        <div class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Visit history</h3></div>
          <div v-for="a in demoHistory" :key="a.id" class="card">
            <div class="between">
              <div>
                <strong>{{ a.date === todayISO ? 'Today' : fmtDate(a.date) }}, {{ a.time }}</strong>
                <div class="tiny">{{ demoVisitSummary(a) }}</div>
              </div>
              <span class="badge" :class="STATUS[a.status].cls">{{ STATUS[a.status].label }}</span>
            </div>
          </div>
          <div v-if="!demoHistory.length" class="card" style="text-align: center; color: var(--text-3)">No visits yet.</div>
        </div>
      </template>

      <!-- Not found / API failed -->
      <div v-else class="section">
        <div class="card" style="text-align: center; color: var(--text-3)">
          Could not load this patient's details.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { PATIENTS, APPTS, STATUS, todayISO, fmtDate } from './physioDemoData'
import { getPatientTreatmentDetails, resolveHospitalId } from './physioApi'

const route = useRoute()
const authStore = useAuthStore()

/* demo patient? (ids like p1..p5) */
const demoP = PATIENTS[route.params.id] || null
const demoHistory = demoP ? APPTS.filter((a) => a.pid === demoP.id) : []
function demoVisitSummary(a) {
  return a.invoice && a.invoice.items
    ? a.invoice.items.map((it) => it.label.replace(' — package session', '')).join(', ')
    : '—'
}

/* ---------------- live — getPatientTreatmentDetails ---------------- */
const loading = ref(false)
const liveData = ref(null)

async function load() {
  if (demoP) return
  loading.value = true
  try {
    const data = await getPatientTreatmentDetails({
      patient_id: Number(route.params.id),
      hospital_id: Number(resolveHospitalId(authStore.user)),
    })
    if (data?.status === 'success') liveData.value = data.data
  } catch (e) {
    console.log('getPatientTreatmentDetails failed:', e)
  } finally {
    loading.value = false
  }
}
load()

const head = computed(() => {
  if (liveData.value) {
    const pd = liveData.value.patient_details
    return {
      name: pd.name,
      age: pd.age,
      sex: (pd.sex || '').charAt(0).toUpperCase(),
      phone: pd.phone,
    }
  }
  if (demoP) return { name: demoP.name, age: demoP.age, sex: demoP.sex, phone: demoP.phone }
  return { name: 'Patient', age: '', sex: '', phone: '' }
})

const billing = computed(() => (liveData.value?.Billing || [])[0] || null)
const sessionsDone = computed(() => Number(liveData.value?.session_number) || 0)
const pkgPct = computed(() => {
  const total = Number(billing.value?.total_sessions) || 0
  if (!total) return 0
  return Math.min(100, Math.round((sessionsDone.value / total) * 100))
})

const goals = computed(() => liveData.value?.reassessment_details?.results?.data || [])
const visits = computed(() => liveData.value?.visits || [])

function visitDate(v) {
  const ts = Number(v.date)
  if (!ts) return v.add_date || ''
  return new Date(ts * 1000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' })
}
function visitDoctor(v) {
  // "Dr. Nikhil Sharma - PT-Shohini-9" → "Dr. Nikhil Sharma - PT"
  const parts = String(v.visit || '').split('-')
  return parts.length > 2 ? parts.slice(0, -2).join('-').trim() : v.visit || ''
}
const VISIT_BADGE = {
  Treated: { label: 'Treated', cls: 'success' },
  Cancelled: { label: 'Cancelled', cls: 'danger' },
  Confirmed: { label: 'Confirmed', cls: 'muted' },
  'Pending Confirmation': { label: 'To confirm', cls: 'pending' },
}
const visitBadge = (s) => VISIT_BADGE[s] || { label: s || '—', cls: 'muted' }
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
  --brand-3: #d8f1eb;
  --warning: #c78810;
  --success: #1f8a4d;
  --info: #2563eb;
  --danger: #d9485f;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
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

.topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  position: sticky;
  top: 0;
  background: rgba(244, 248, 248, 0.92);
  backdrop-filter: blur(10px);
  z-index: 20;
}
.topbar h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.back {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section { padding: 0 16px; }
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
.between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.grow { flex: 1; }
.muted { color: var(--text-2); font-size: 13px; }
.tiny { color: var(--text-3); font-size: 12px; }

.card {
  background: var(--card);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  padding: 16px;
  border: 1px solid rgba(220, 231, 234, 0.85);
}
.card + .card { margin-top: 12px; }

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

.pkg-bar {
  height: 8px;
  background: #eef4f4;
  border-radius: 99px;
  overflow: hidden;
  margin-top: 8px;
}
.pkg-bar > i {
  display: block;
  height: 100%;
  background: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);
  border-radius: 99px;
}
</style>