<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ TOPBAR ============ -->
      <div class="topbar">
        <button class="back" aria-label="Back" @click="$router.back()">←</button>
        <div class="grow">
          <h2 class="font-sora">{{ headName }}</h2>
          <div class="muted" style="font-size: 12.5px">
            <template v-if="p">
              {{ [p.age ? p.age + 'y' : null, p.sex, p.phone].filter(Boolean).join(' · ') }}
            </template>
          </div>
        </div>
        <span v-if="p" class="badge" :class="p.billing_type === 'InPackage' ? 'brand' : 'muted'">
          {{ p.billing_type === 'InPackage' ? 'Package' : 'Per-visit' }}
        </span>
      </div>

      <!-- ============ LOADING / ERROR ============ -->
      <div v-if="loading" class="section">
        <div class="card" style="text-align: center; color: var(--text-3)">
          Loading patient details…
        </div>
      </div>

      <div v-else-if="error" class="section">
        <div class="card" style="text-align: center">
          <div class="muted">{{ error }}</div>
          <button class="retry" @click="load">Try again</button>
        </div>
      </div>

      <template v-else-if="data">
        <!-- ============ PROFILE ============ -->
        <div class="section">
          <div class="card">
            <span class="badge brand wrap">{{ p.condition || 'Condition not set' }}</span>
            <div class="kv">
              <div v-for="row in profileRows" :key="row[0]" class="kv-row">
                <span class="kv-k">{{ row[0] }}</span>
                <span class="kv-v">{{ row[1] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ============ BILLING ============ -->
        <div class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Billing</h3></div>
          <div class="card">
            <template v-if="pkg">
              <div class="between">
                <strong style="font-size: 14px">{{ pkg.payment_procedure }}</strong>
                <span v-if="pkg.charges_per_session" class="muted">
                  ₹{{ pkg.charges_per_session }}/session
                </span>
              </div>
              <!-- some active packages carry no session quota in the CRM, so only
                   show a count out of a total when there really is one -->
              <div class="muted" style="margin-top: 4px">
                <template v-if="pkg.total_sessions > 0">
                  {{ pkg.sessions_used }} of {{ pkg.total_sessions }} sessions used ·
                  {{ pkg.sessions_left }} left
                </template>
                <template v-else>
                  {{ pkg.sessions_used }} session{{ pkg.sessions_used === 1 ? '' : 's' }} used · no
                  session limit set
                </template>
              </div>
              <!-- the CRM lists these separately; without them used + left
                   does not add up to the total and the card looks wrong -->
              <div
                v-if="pkg.refunded_sessions || pkg.expired_sessions"
                class="tiny"
                style="margin-top: 4px; color: var(--danger)"
              >
                <template v-if="pkg.refunded_sessions">
                  {{ pkg.refunded_sessions }} refunded
                </template>
                <template v-if="pkg.refunded_sessions && pkg.expired_sessions"> · </template>
                <template v-if="pkg.expired_sessions">{{ pkg.expired_sessions }} expired</template>
              </div>
              <div v-if="pkg.total_sessions > 0" class="pkg-bar">
                <i :style="{ width: pkgPct + '%' }"></i>
              </div>
              <div class="tiny" style="margin-top: 6px">
                Started {{ fmtDay(pkg.started_on) }}
                <template v-if="pkg.is_subscription"> · subscription</template>
              </div>
            </template>
            <div v-else class="muted">Per-visit billing — no active package.</div>
          </div>

          <!-- an older API build has no billing block; showing zeroes
               would claim the patient has none, which is not the same thing -->
          <template v-if="billing">
            <!-- the four figures the CRM shows on its Payments tab -->
            <div class="bill-grid">
              <div v-for="t in billTiles" :key="t.label" class="card bill">
                <div class="tiny">{{ t.label }}</div>
                <div class="bill-v" :style="t.style">{{ t.value }}</div>
              </div>
            </div>

            <div class="section-title">
              <h3 class="font-sora" style="font-size: 14px">Transactions</h3>
              <span class="tiny">{{ transactions.length }} total</span>
            </div>

            <div v-if="transactions.length" class="scroll-box">
              <div v-for="t in transactions" :key="t.id" class="card">
                <div class="between">
                  <strong style="font-size: 13.5px">{{ t.remarks }}</strong>
                  <span class="tiny">{{ fmtDay(t.date) }}</span>
                </div>
                <div class="between" style="margin-top: 8px">
                  <span class="tiny">
                    {{ [t.paid_to, t.paid_via].filter(Boolean).join(' · ') || '—' }}
                  </span>
                  <span>
                    <span v-if="t.is_paid && t.credit" class="amt paid">
                      + {{ rupees(t.credit) }}
                    </span>
                    <span v-if="t.debit" class="amt">{{ rupees(t.debit) }}</span>
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="card" style="text-align: center; color: var(--text-3)">
              No transactions yet.
            </div>
          </template>
        </div>

        <!-- ============ AT A GLANCE ============ -->
        <div class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">At a glance</h3></div>
          <div class="stat-grid">
            <div v-for="s in statTiles" :key="s.label" class="card stat">
              <div class="stat-v">{{ s.value }}</div>
              <div class="tiny">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <!-- ============ NEXT APPOINTMENT ============ -->
        <div v-if="data.next_appointment" class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Next appointment</h3></div>
          <div class="card">
            <div class="between">
              <div>
                <strong>{{ fmtDay(data.next_appointment.date) }}</strong>
                <div class="tiny">
                  {{ data.next_appointment.s_time || 'Time not set' }}
                  <template v-if="data.next_appointment.physio">
                    · {{ data.next_appointment.physio }}
                  </template>
                </div>
              </div>
              <span class="badge" :class="visitBadge(data.next_appointment.status).cls">
                {{ visitBadge(data.next_appointment.status).label }}
              </span>
            </div>
          </div>
        </div>

        <!-- ============ LATEST FEEDBACK ============ -->
        <div v-if="data.feedback.length" class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Patient feedback</h3></div>
          <div v-for="f in data.feedback" :key="f.id" class="card">
            <div class="between">
              <span class="stars">
                <span v-for="n in 5" :key="n" :class="{ off: n > f.stars }">★</span>
                <span class="muted" style="margin-left: 6px">{{ f.rating_text }}</span>
              </span>
              <span class="tiny">{{ fmtDay(f.created_at) }}</span>
            </div>
            <div v-if="f.suggestion" class="muted" style="margin-top: 6px; font-style: italic">
              "{{ f.suggestion }}"
            </div>
          </div>
        </div>

        <!-- ============ EXERCISE PROGRAMME ============ -->
        <div v-if="data.programme" class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Exercise programme</h3></div>
          <div class="card">
            <div class="between">
              <strong style="font-size: 14px">{{ data.programme.name }}</strong>
              <span class="badge" :class="data.programme.is_active ? 'success' : 'muted'">
                {{ data.programme.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="muted" style="margin-top: 4px">
              {{ fmtDay(data.programme.start_date) }} – {{ fmtDay(data.programme.end_date) }}
            </div>
            <div v-if="data.programme.instructions" class="tiny" style="margin-top: 6px">
              {{ data.programme.instructions }}
            </div>
          </div>
        </div>

        <!-- ============ TIMELINE ============ -->
        <div class="section" style="margin-top: 12px">
          <div class="section-title">
            <h3 class="font-sora">Timeline</h3>
            <span class="tiny">{{ comments.length }} entries</span>
          </div>

          <div class="card">
            <textarea
              v-model="newComment"
              class="comment-box"
              rows="3"
              aria-label="Add a comment"
              placeholder="Add a comment about this patient…"
            ></textarea>
            <div v-if="commentError" class="tiny" style="color: var(--danger); margin-top: 6px">
              {{ commentError }}
            </div>
            <button class="post-btn" :disabled="!newComment.trim() || posting" @click="postComment">
              {{ posting ? 'Posting…' : 'Post comment' }}
            </button>
          </div>

          <div v-if="comments.length" class="scroll-box">
            <div v-for="c in comments" :key="c.id" class="card">
              <div class="between">
                <span class="badge muted wrap">{{ c.type }}</span>
                <span class="tiny">{{ fmtDay(c.created_at) }}</span>
              </div>
              <div style="margin-top: 8px; font-size: 13.5px">{{ c.remarks }}</div>
              <div v-if="c.author" class="tiny" style="margin-top: 6px">
                {{ c.author }}<template v-if="c.author_role"> · {{ c.author_role }}</template>
              </div>
            </div>
          </div>

          <div
            v-if="!comments.length"
            class="card"
            style="text-align: center; color: var(--text-3)"
          >
            No timeline entries yet.
          </div>
        </div>

        <!-- ============ VISIT HISTORY ============ -->
        <div class="section" style="margin-top: 12px">
          <div class="section-title">
            <h3 class="font-sora">Visit history</h3>
            <span class="tiny">{{ data.visits.length }} total</span>
          </div>

          <div v-if="data.visits.length" class="scroll-box">
            <div v-for="v in data.visits" :key="v.id" class="card">
              <div class="between">
                <div>
                  <strong>
                    {{ fmtDay(v.date) }}<template v-if="v.s_time">, {{ v.s_time }}</template>
                  </strong>
                  <div class="tiny">
                    {{ v.physio || 'Physio not set' }}
                    <template v-if="v.session_number"> · Session {{ v.session_number }}</template>
                    <template v-if="v.is_consultation"> · Consultation</template>
                  </div>
                </div>
                <span class="badge" :class="visitBadge(v.status).cls">
                  {{ visitBadge(v.status).label }}
                </span>
              </div>

              <div v-if="v.actual_session_start" class="tiny" style="margin-top: 6px">
                Session {{ v.actual_session_start
                }}<template v-if="v.actual_session_end"> – {{ v.actual_session_end }}</template>
              </div>

              <div v-if="v.payment_status" class="tiny" style="margin-top: 4px">
                <span
                  :style="{
                    color: v.payment_status === 'paid' ? 'var(--success)' : 'var(--warning)',
                  }"
                >
                  {{ v.payment_status === 'paid' ? 'Paid' : 'Unpaid' }}
                </span>
                <template v-if="v.invoice_amount"> · ₹{{ v.invoice_amount }}</template>
              </div>
            </div>
          </div>

          <div
            v-if="!data.visits.length"
            class="card"
            style="text-align: center; color: var(--text-3)"
          >
            No visits yet.
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import {
  addPhysioPatientComment,
  getPhysioPatientDetails,
  randHex32,
  resolveDoctorId,
  resolveHospitalId,
} from './physioApi'

const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')
const data = ref(null)

/* ---------------- timeline comments ---------------- */
const newComment = ref('')
const posting = ref(false)
const commentError = ref('')

const comments = computed(() => data.value?.comments || [])

async function postComment() {
  const text = newComment.value.trim()
  if (!text || posting.value) return

  posting.value = true
  commentError.value = ''
  try {
    const res = await addPhysioPatientComment({
      patient_id: Number(route.params.id),
      doctor_id: Number(resolveDoctorId(authStore.user)) || undefined,
      hospital_id: Number(resolveHospitalId(authStore.user)) || undefined,
      comment: text,
      // a repeated submit with the same id is ignored server-side
      unique_identifier: randHex32(),
    })
    if (res?.status === 'success') {
      // the server returns the refreshed list, so the new entry lands in order
      data.value.comments = res.data?.comments || comments.value
      newComment.value = ''
    } else {
      commentError.value = res?.message || 'Could not save the comment.'
    }
  } catch (e) {
    console.log('addPhysioPatientComment failed:', e)
    commentError.value = 'Could not save the comment — try again.'
  } finally {
    posting.value = false
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await getPhysioPatientDetails({
      patient_id: Number(route.params.id),
      hospital_id: Number(resolveHospitalId(authStore.user)) || undefined,
    })
    if (res?.status === 'success') {
      data.value = res.data
    } else {
      error.value = res?.message || 'Could not load this patient.'
    }
  } catch (e) {
    console.log('getPhysioPatientDetails failed:', e)
    error.value = 'Could not load this patient — check your connection and try again.'
  } finally {
    loading.value = false
  }
}
load()

const p = computed(() => data.value?.patient || null)
const pkg = computed(() => data.value?.package || null)

const headName = computed(() => {
  if (!p.value) return 'Patient'
  return [p.value.salutation, p.value.name].filter(Boolean).join(' ')
})

/** "2024-04-24" / "2025-11-14 11:03:00" → "Wed, 24 Apr 24" */
function fmtDay(value) {
  if (!value) return '—'
  const d = new Date(String(value).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  })
}

const profileRows = computed(() => {
  const x = p.value
  if (!x) return []
  return [
    ['Physio', x.physio || '—'],
    ['Clinic', x.hospital_name || '—'],
    ['Patient ID', x.patient_code || x.id],
    ['Address', [x.address, x.zip_code].filter(Boolean).join(', ') || '—'],
    ['Registered', fmtDay(x.registered_on)],
  ]
})

const pkgPct = computed(() => {
  if (!pkg.value?.total_sessions) return 0
  return Math.min(100, Math.round((pkg.value.sessions_used / pkg.value.total_sessions) * 100))
})

const billing = computed(() => data.value?.billing || null)
const transactions = computed(() => billing.value?.transactions || [])

const rupees = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

/** The CRM's four Payments figures. balance > 0 is owed, < 0 sits as credit. */
const billTiles = computed(() => {
  const b = billing.value
  if (!b) return []
  const owed = b.state === 'due'
  return [
    { label: 'Invoiced', value: rupees(b.invoiced) },
    { label: 'Paid', value: rupees(b.paid), style: { color: 'var(--success)' } },
    { label: 'Refunded', value: rupees(b.refunded) },
    {
      label: b.state === 'advance' ? 'Advance' : 'Due',
      value: rupees(Math.abs(b.balance)),
      style: { color: owed ? 'var(--warning)' : 'var(--success)' },
    },
  ]
})

const statTiles = computed(() => {
  const s = data.value?.stats
  if (!s) return []
  return [
    { label: 'Sessions done', value: s.treated },
    { label: 'Cancelled', value: s.cancelled },
    { label: 'First visit', value: fmtShort(s.first_visit) },
    { label: 'Last visit', value: fmtShort(s.last_visit) },
  ]
})

/** Compact date for the stat tiles: "24 Apr 24". */
function fmtShort(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

const VISIT_BADGE = {
  Treated: { label: 'Treated', cls: 'success' },
  Cancelled: { label: 'Cancelled', cls: 'danger' },
  Confirmed: { label: 'Confirmed', cls: 'info' },
  'Pending Confirmation': { label: 'To confirm', cls: 'pending' },
  Closed: { label: 'Closed', cls: 'muted' },
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
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  flex: none;
}

.section {
  padding: 0 16px;
}
.section-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 18px 4px 10px;
}
.section-title h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.grow {
  flex: 1;
  min-width: 0;
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

.kv {
  margin-top: 14px;
}
.kv-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  padding: 7px 0;
  border-bottom: 1px solid var(--line);
}
.kv-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.kv-k {
  color: var(--text-2);
  font-size: 12.5px;
  flex: none;
}
.kv-v {
  font-weight: 700;
  font-size: 13px;
  text-align: right;
  word-break: break-word;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.stat {
  padding: 14px;
}
.stat-v {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 2px;
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
/* long text (a full diagnosis, a timeline caption) has to wrap inside the
   card instead of running off the edge, so it drops the pill's nowrap */
.badge.wrap {
  white-space: normal;
  text-align: left;
  line-height: 1.4;
  padding: 6px 12px;
  border-radius: 14px;
  max-width: 100%;
}
.badge.brand {
  background: var(--brand-3);
  color: var(--brand);
}
.badge.success {
  background: #e6f7ed;
  color: var(--success);
}
.badge.warn {
  background: #fff4dd;
  color: var(--warning);
}
.badge.danger {
  background: #fde8ec;
  color: var(--danger);
}
.badge.info {
  background: #e6efff;
  color: var(--info);
}
.badge.pending {
  background: #efeaff;
  color: #6d4bff;
}
.badge.muted {
  background: #eef3f4;
  color: var(--text-2);
}

.stars {
  color: #e0a800;
  letter-spacing: 1px;
  font-size: 13px;
}
.stars .off {
  color: #d3e2e0;
}

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

.retry {
  width: 100%;
  margin-top: 12px;
  min-height: 42px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--text-2);
  font: inherit;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
.retry:hover {
  background: #f7fbfa;
}

.comment-box {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 10px 12px;
  font: inherit;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--text);
  background: #fff;
  outline: none;
  resize: vertical;
}
.comment-box:focus {
  border-color: var(--brand);
}
.post-btn {
  width: 100%;
  margin-top: 10px;
  min-height: 42px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);
  color: #fff;
  font: inherit;
  font-weight: 800;
  font-size: 13.5px;
  cursor: pointer;
}
.post-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* CRM keeps its Timeline in a fixed-height scroller; the long lists here do
   the same so the rest of the screen stays reachable */
.scroll-box {
  max-height: 420px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* breathing room so the cards' shadows are not clipped */
  padding: 2px;
  margin: 0 -2px;
}
.bill-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
}
/* these tiles sit in a grid, where the stacked-card margin knocks every tile
   after the first out of line and makes the row heights uneven */
.bill-grid .card + .card,
.stat-grid .card + .card {
  margin-top: 0;
}
/* keep all four reading as one set even when a value wraps */
.bill,
.stat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 74px;
}
.bill {
  padding: 14px;
}
.bill-v {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-top: 4px;
}
.amt {
  font-weight: 700;
  font-size: 13px;
}
.amt.paid {
  color: var(--success);
}
</style>
