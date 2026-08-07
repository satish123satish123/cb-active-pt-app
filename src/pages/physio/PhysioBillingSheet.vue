<template>
  <div class="bill-screen">
    <div class="bill-inner">
      <div class="topbar">
        <button class="back" @click="closeSheet">←</button>
        <div class="grow">
          <h2 class="font-sora">Billing</h2>
          <div class="muted" style="font-size: 12.5px">{{ patientName }}</div>
        </div>
      </div>

      <PhysioStepper :step="2" />

      <div v-if="loading" class="section" style="margin-top: 14px">
        <div class="card muted" style="text-align: center">Loading billing details…</div>
      </div>

      <!-- STEP 1: items -->
      <template v-else-if="billStep === 'items'">
        <div class="section" style="margin-top: 8px">
          <p class="muted" style="margin: 0 2px">
            Tap the treatment(s) given in this session.
            <template v-if="activePkg"> The package treatment is taken from their package automatically while sessions last.</template>
          </p>
        </div>

        <!-- Package progress card -->
        <div v-if="activePkg" class="section" style="margin-top: 6px">
          <div class="card" :style="usingPackageNow ? 'border-color:#cfeee6' : ''">
            <div class="between">
              <strong style="font-size: 14px">{{ activePkg.payment_procedure }}</strong>
              <span v-if="usingPackageNow" class="badge brand">Using 1 session</span>
              <span v-else class="badge muted">Not used today</span>
            </div>
            <div class="muted" style="margin-top: 6px">
              {{ pkgUsed }} of {{ pkgTotal }} used · <strong>{{ pkgLeft }} left</strong>
            </div>
            <div class="pkg-bar"><i :style="{ width: pkgTotal ? (pkgUsed / pkgTotal * 100) + '%' : '0%' }"></i></div>
          </div>
        </div>

        <!-- Treatment given -->
        <div class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Treatment given</h3></div>
          <input v-model="search" class="input" placeholder="Search procedures…" style="margin-bottom: 10px" />
          <div class="card">
            <div
              v-for="t in procedures"
              :key="t.id"
              class="pick"
              :class="{ on: isSel(t) }"
              style="margin-bottom: 10px"
              @click="toggleSel(t)"
            >
              <div class="check" :class="{ on: isSel(t) }">
                <template v-if="isSel(t)">✓</template><span v-else style="color: #8da0aa">+</span>
              </div>
              <div class="grow">
                <div style="font-weight: 700; font-size: 14px">{{ t.category }}</div>
                <div v-if="txInPackage(t)" class="tiny" style="color: #0a7e6e">
                  In package — comes from package<template v-if="txCovered(t)"> (1 session)</template>
                </div>
                <div v-else-if="t.description" class="tiny">{{ t.description }}</div>
              </div>
              <div class="muted" style="flex: none">
                <span v-if="txCovered(t)" style="color: #0a7e6e; font-weight: 700">Included</span>
                <span v-else>{{ inr(t.c_price) }}</span>
              </div>
            </div>
            <div v-if="!procedures.length" class="tiny" style="text-align: center; padding: 10px 0">No match.</div>
          </div>
        </div>

        <!-- Discount (hidden when the package is covering this session) -->
        <div v-if="!usingPackageNow" class="section" style="margin-top: 12px">
          <div class="card">
            <div class="row" style="gap: 10px; align-items: center">
              <span class="field-label" style="margin: 0; flex: none">Discount ₹</span>
              <input v-model.number="discount" class="input grow" type="number" min="0" placeholder="0" />
            </div>
            <p class="tiny" style="margin-top: 8px">Applies to charged items only — packages are never discounted.</p>
          </div>
        </div>

        <!-- Bill -->
        <div class="section" style="margin-top: 12px">
          <div class="section-title"><h3 class="font-sora">Bill</h3></div>
          <div class="card">
            <template v-if="sel.length">
              <div v-for="t in sel" :key="'inv-' + t.id" class="inv-row">
                <span>{{ t.category }}</span>
                <strong v-if="txCovered(t)">Included</strong>
                <strong v-else>{{ inr(t.c_price) }}</strong>
              </div>
              <div v-if="Number(discount) && !usingPackageNow" class="inv-row">
                <span style="color: #1f8a4d">Discount</span>
                <strong style="color: #1f8a4d">− {{ inr(discount) }}</strong>
              </div>
            </template>
            <div v-else class="muted" style="text-align: center; padding: 8px 0">No treatment selected yet.</div>
            <div class="inv-total">
              <span>To collect at counter</span>
              <span>{{ inr(grandTotal) }}</span>
            </div>
            <p v-if="sel.length && grandTotal === 0" class="tiny" style="margin-top: 10px">
              Fully covered by package — nothing to collect today.
            </p>
          </div>
        </div>

        <div class="section" style="margin-top: 12px; padding-bottom: 110px">
          <div class="card" style="background: #fff4dd; border-color: #ffe6b0">
            <strong style="font-size: 13px">💳 Payment is taken at the counter</strong>
            <div class="muted" style="margin-top: 4px">You're only generating the bill — reception collects and marks it paid.</div>
          </div>
        </div>

        <div class="sticky-foot">
          <button class="btn ghost" style="flex: none; width: 34%" @click="closeSheet">Skip</button>
          <button class="btn primary grow" :disabled="busy || !sel.length" @click="onGenerateBill">
            {{ busy ? 'Generating…' : 'Generate bill →' }}
          </button>
        </div>
      </template>

      <!-- STEP 2: collect payment -->
      <template v-else>
        <div class="section" style="margin-top: 12px; padding-bottom: 110px">
          <div class="card">
            <div class="between">
              <span class="muted">Invoice total</span>
              <strong style="font-size: 20px">{{ inr(payInfo?.gross_total) }}</strong>
            </div>
          </div>
          <p class="field-label" style="margin-top: 14px">Paid to</p>
          <div class="chips">
            <button
              v-for="opt in payToOptions"
              :key="opt.value"
              class="chip dur"
              :class="{ 'chip-active': payTo && payTo.value === opt.value }"
              style="flex: 1; justify-content: center; padding: 9px 0"
              @click="selectPayTo(opt)"
            >
              {{ opt.label }}
            </button>
          </div>
          <template v-if="payTo">
            <p class="field-label" style="margin-top: 14px">Paid via</p>
            <div v-if="methodsLoading" class="tiny" style="padding: 6px 2px">Loading options…</div>
            <div v-else class="chips">
              <button
                v-for="m in methods"
                :key="m.id"
                class="chip dur"
                :class="{ 'chip-active': paySel && paySel.id === m.id }"
                style="flex: 0 0 auto; padding: 9px 14px"
                @click="paySel = m"
              >
                {{ m.paid_via }}
              </button>
              <span v-if="!methods.length" class="tiny">No options for {{ payTo.label }} — pick another.</span>
            </div>
          </template>
        </div>
        <div class="sticky-foot">
          <button class="btn ghost" style="flex: none; width: 40%" @click="$emit('done', 'invoiced')">
            Pay at counter
          </button>
          <button class="btn primary grow" :disabled="busy || !paySel" @click="markPaid">
            {{ busy ? 'Saving…' : `Mark ${inr(payInfo?.gross_total)} paid` }}
          </button>
        </div>
      </template>

      <!-- OUT-OF-PACKAGE REASON POPUP -->
      <div v-if="showOopReason" class="oop-scrim" @click="showOopReason = false">
        <div class="oop-dialog" @click.stop>
          <h2 class="font-sora" style="margin: 0 0 6px; font-size: 18px">Out-of-package treatment</h2>
          <p class="muted" style="margin: 0 0 12px">
            This patient has an active package, but the selected procedure is not covered by it. Please provide a
            reason for invoicing outside the package.
          </p>
          <input v-model="oopReason" class="input" placeholder="Reason…" />
          <div class="row" style="gap: 10px; margin-top: 16px">
            <button class="btn ghost" style="flex: none; width: 34%" @click="showOopReason = false">Cancel</button>
            <button class="btn primary grow" :disabled="oopBusy || !oopReason.trim()" @click="submitOopReason">
              {{ oopBusy ? 'Saving…' : 'OK — continue' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/authStore'
import PhysioStepper from './PhysioStepper.vue'
import {
  getAppointmentInvoiceDetails, addPayment, patientDeposit,
  getPaidViaByPaymentMethod, encodeWithSalt, randHex32,
  saveInvoiceReviewReason, deleteInvoiceReviewReason,
  resolveDoctorId, resolveHospitalId,
} from './physioApi'

const props = defineProps({
  appointmentId: { type: Number, required: true },
  patientId: { type: Number, required: true },
  patientName: { type: String, default: '' },
  initialData: { type: Object, default: null },
})
const emit = defineEmits(['close', 'done'])

const authStore = useAuthStore()
const doctorId = Number(resolveDoctorId(authStore.user))
const hospitalId = Number(resolveHospitalId(authStore.user))

const loading = ref(false)
const billStep = ref('items')
const billData = ref(props.initialData)
const search = ref('')
const sel = ref(props.initialData?.treatment_procedures?.length === 1 ? [props.initialData.treatment_procedures[0]] : [])
const discount = ref(0)
const busy = ref(false)
const payInfo = ref(null)
const payTo = ref(null)
const methods = ref([])
const methodsLoading = ref(false)
const paySel = ref(null)

const payToOptions = computed(() => {
  const pm = payInfo.value?.makePayment?.payment_methods || { Clinic: '0', Company: '1', Physio: '2' }
  return Object.entries(pm).map(([label, value]) => ({ label, value }))
})
const procedures = computed(() => {
  const items = (billData.value?.treatment_procedures || []).filter(
    (t) => t.is_active === '1' && t.is_cancellation_charges !== '1',
  )
  const q = search.value.trim().toLowerCase()
  return q ? items.filter((t) => (t.category + ' ' + (t.description || '')).toLowerCase().includes(q)) : items
})
const inr = (v) => (Number(v) ? '₹' + Number(v).toLocaleString('en-IN') : 'Free')
const isSel = (t) => sel.value.some((x) => x.id === t.id)
function toggleSel(t) {
  const i = sel.value.findIndex((x) => x.id === t.id)
  if (i >= 0) sel.value.splice(i, 1)
  else sel.value.push(t)
}

/* package coverage */
function normName(x) {
  return String(x || '').toLowerCase().replace(/sessions?/g, '').replace(/[^a-z0-9]/g, '')
}
const activePkg = computed(() => (billData.value?.package_details || [])[0] || null)
const pkgTotal = computed(() => Number(activePkg.value?.quantity || activePkg.value?.total_sessions || 0))
const pkgUsed = computed(() => {
  const p = activePkg.value
  if (!p) return 0
  return Number(p.expired_sessions || 0) + Number(p.refunded_sessions || 0)
})
const pkgLeft = computed(() => Math.max(0, pkgTotal.value - pkgUsed.value))
const pkgHasBalance = computed(() => pkgLeft.value > 0)
function txInPackage(t) {
  const list = billData.value?.package_procedures
  if (Array.isArray(list) && list.length) {
    return list.some((n) => normName(n) === normName(t.category))
  }
  if (!activePkg.value) return false
  return (
    normName(t.category) === normName(activePkg.value.payment_procedure) ||
    normName(t.category).includes(normName(activePkg.value.payment_procedure)) ||
    normName(activePkg.value.payment_procedure).includes(normName(t.category))
  )
}
function txCovered(t) {
  return isSel(t) && txInPackage(t) && pkgHasBalance.value
}
const lineAmt = (t) => (txCovered(t) ? 0 : Number(t.c_price || 0))
const grandTotal = computed(() => {
  const sum = sel.value.reduce((n, t) => n + lineAmt(t), 0)
  const disc = usingPackageNow.value ? 0 : Number(discount.value) || 0
  return Math.max(0, sum - disc)
})
const usingPackageNow = computed(() => sel.value.some((t) => txCovered(t)))

/* out-of-package review: reason required before invoicing non-package items */
const reviewId = ref(null)
const showOopReason = ref(false)
const oopReason = ref('')
const oopBusy = ref(false)
const needsOopReason = computed(
  () => !!activePkg.value && sel.value.some((t) => !txInPackage(t)),
)
function onGenerateBill() {
  if (!sel.value.length) {
    Notify.create({ type: 'negative', message: 'Select at least one procedure' })
    return
  }
  if (needsOopReason.value && !reviewId.value) {
    oopReason.value = ''
    showOopReason.value = true
    return
  }
  createInvoice(usingPackageNow.value)
}
async function submitOopReason() {
  if (oopBusy.value || !oopReason.value.trim()) return
  oopBusy.value = true
  try {
    const res = await saveInvoiceReviewReason({
      appointment_id: props.appointmentId,
      patient_id: props.patientId,
      doctor_id: doctorId,
      hospital_id: hospitalId,
      user_id: Number(authStore.user?.user_id || authStore.user?.id) || null,
      reason: oopReason.value.trim(),
    })
    const id = res?.inserted_id || res?.id || res?.data?.inserted_id
    if (res?.status === 'success' && id) {
      reviewId.value = Number(id)
      showOopReason.value = false
      createInvoice(usingPackageNow.value)
    } else {
      Notify.create({ type: 'negative', message: res?.message || 'Could not save reason' })
    }
  } catch (e) {
    console.log('saveInvoiceReviewReason failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not save reason' })
  } finally {
    oopBusy.value = false
  }
}
async function discardReview() {
  if (!reviewId.value) return
  try {
    await deleteInvoiceReviewReason({ review_id: reviewId.value, id: reviewId.value })
  } catch (e) {
    console.log('deleteInvoiceReviewReason failed:', e)
  }
  reviewId.value = null
}
function closeSheet() {
  discardReview()
  emit('close')
}

function todayYMD() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function load() {
  if (billData.value) return
  loading.value = true
  try {
    const res = await getAppointmentInvoiceDetails({
      appointment_id: props.appointmentId,
      doctor_id: doctorId,
      hospital_id: hospitalId,
      patient_id: props.patientId,
    })
    if (res?.status === 'success') {
      billData.value = res
      if (res.treatment_procedures?.length === 1) sel.value = [res.treatment_procedures[0]]
    } else throw new Error(res?.message || 'Could not load billing details')
  } catch (e) {
    console.log('getAppointmentInvoiceDetails failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || e.message || 'Could not load billing' })
    emit('close')
  } finally {
    loading.value = false
  }
}
load()

async function createInvoice(usePackage) {
  if (busy.value) return
  busy.value = true
  try {
    const categories = sel.value
    if (!categories.length) {
      busy.value = false
      Notify.create({ type: 'negative', message: 'Select at least one procedure' })
      return
    }
    const payload = {
      appointment_id: props.appointmentId,
      appointment_type: 'Clinic',
      patient_id: props.patientId,
      doctor_id: doctorId,
      hospital_id: hospitalId,
      category_id: categories.map((t) => Number(t.id)),
      quantity: categories.map(() => 1),
      discount: usingPackageNow.value ? 0 : Number(discount.value) || 0,
      remarks: 'Invoice created from ActivPT app',
      appointment_date: todayYMD(),
    }
    if (reviewId.value) payload.review_id = reviewId.value
    if (usePackage && activePkg.value?.payment_id) {
      payload.package_payment_id = Number(activePkg.value.payment_id)
    }
    const res = await addPayment(payload)
    if (res?.status === 'success') reviewId.value = null // linked server-side
    if (res?.status !== 'success') {
      if (/already\s*invoice/i.test(res?.message || '')) {
        Notify.create({ message: res.message || 'Already invoiced' })
        emit('done', 'invoiced')
        return
      }
      throw new Error(res?.message || 'Could not create invoice')
    }
    if (res.is_in_package || res.next_action === 'inpackage') {
      Notify.create({ type: 'positive', message: res.message || 'Session covered under active package.' })
      emit('done', 'paid')
      return
    }
    if (!Number(res.gross_total)) {
      Notify.create({ type: 'positive', message: 'Invoice created — free session, nothing to collect.' })
      emit('done', 'paid')
      return
    }
    payInfo.value = res
    billStep.value = 'pay'
    payTo.value = null
    paySel.value = null
    methods.value = []
  } catch (e) {
    console.log('addPayment failed:', e)
    const msg = e.response?.data?.message || e.message || ''
    if (e.response?.status === 409 || /already\s*invoice/i.test(msg)) {
      Notify.create({ message: msg || 'Already invoiced' })
      emit('done', 'invoiced')
    } else {
      Notify.create({ type: 'negative', message: msg || 'Could not create invoice' })
    }
  } finally {
    busy.value = false
  }
}

async function selectPayTo(opt) {
  payTo.value = opt
  paySel.value = null
  methods.value = []
  methodsLoading.value = true
  try {
    const pm = await getPaidViaByPaymentMethod({ paid_to: Number(opt.value), hospital_id: hospitalId })
    methods.value = (pm?.data || []).filter((m) => m.is_active === '1')
  } catch (e) {
    console.log('getPaidViaByPaymentMethod failed:', e)
    methods.value = []
  } finally {
    methodsLoading.value = false
  }
}

async function markPaid() {
  if (busy.value) return
  if (!paySel.value) {
    Notify.create({ type: 'negative', message: 'Select how the patient paid' })
    return
  }
  const amount = Number(payInfo.value?.gross_total) || grandTotal.value
  if (!amount) {
    Notify.create({ type: 'positive', message: 'Free invoice — nothing to collect.' })
    emit('done', 'paid')
    return
  }
  busy.value = true
  try {
    const mp = payInfo.value?.makePayment || {}
    const salt = mp.salt || ''
    const res = await patientDeposit({
      patient: encodeWithSalt(props.patientId, salt),
      physio: encodeWithSalt(doctorId, salt),
      payment_id: payInfo.value.encoded_inserted_id || encodeWithSalt(payInfo.value.inserted_id, salt),
      success_message: mp.success_message || 'Continue Payment',
      appointmentId: mp.appointmentId || props.appointmentId,
      appointment_type: mp.appointment_type || 'Clinic',
      unique_identifier: randHex32(),
      user_id: Number(authStore.user?.user_id || authStore.user?.id) || null,
      deposited_amount: amount,
      deposit_type: Number(payTo.value?.value) || 0,
      paid_via: Number(paySel.value.id),
    })
    if (res?.status === 'success') {
      Notify.create({ type: 'positive', message: res.message || 'Payment received ✓' })
      emit('done', 'paid')
    } else {
      Notify.create({ type: 'negative', message: res?.message || 'Could not record payment' })
    }
  } catch (e) {
    console.log('patientDeposit failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not record payment — try again' })
  } finally {
    busy.value = false
  }
}
</script>

<style scoped>
.bill-screen {
  position: fixed;
  inset: 0;
  z-index: 45;
  background: #f4f8f8;
  overflow: auto;
  animation: bs-fade 0.22s ease;
  color: #10212a;
}
@keyframes bs-fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.bill-inner {
  max-width: 460px;
  margin: 0 auto;
  min-height: 100%;
  padding-bottom: 20px;
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
  border: 1px solid #dce7ea;
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
  margin-bottom: 10px;
}
.section-title h3 { margin: 0; font-size: 15px; font-weight: 800; }
.row { display: flex; align-items: center; }
.between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.grow { flex: 1; }
.muted { color: #5a6c76; font-size: 13px; }
.tiny { color: #8da0aa; font-size: 12px; }
.field-label { font-size: 12px; font-weight: 800; color: #5a6c76; margin: 0 0 6px 2px; }
.card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 16px rgba(16, 33, 42, 0.06);
  padding: 16px;
  border: 1px solid rgba(220, 231, 234, 0.85);
}
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
.badge.brand { background: #e4f3f0; color: #0a7e6e; }
.badge.muted { background: #eef3f4; color: #5a6c76; }
.pkg-bar {
  height: 8px;
  border-radius: 99px;
  background: #e6eeef;
  margin-top: 10px;
  overflow: hidden;
}
.pkg-bar i {
  display: block;
  height: 100%;
  background: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);
  border-radius: 99px;
}
.input {
  width: 100%;
  border: 1px solid #dce7ea;
  border-radius: 12px;
  min-height: 46px;
  padding: 0 14px;
  font-size: 15px;
  font-family: inherit;
  color: #10212a;
  background: #fff;
  outline: none;
}
.input:focus { border-color: #0a7e6e; }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip.dur {
  border: 1px solid #dce7ea;
  border-radius: 12px;
  background: #f0f6f6;
  color: #5a6c76;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}
.chip-active {
  background: #0a7e6e !important;
  color: #fff !important;
  border-color: #0a7e6e !important;
}
.pick {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #dce7ea;
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
  background: #fff;
}
.pick.on { border-color: #0a7e6e; background: #f1faf7; }
.check {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 2px solid #dce7ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #fff;
  flex: none;
}
.check.on { background: #0a7e6e; border-color: #0a7e6e; }
.inv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px dashed #dce7ea;
}
.inv-row:last-of-type { border-bottom: none; }
.inv-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 6px;
  border-top: 2px solid #dce7ea;
  font-weight: 800;
  font-size: 18px;
}
.sticky-foot {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100%;
  max-width: 460px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid #dce7ea;
  z-index: 46;
  display: flex;
  gap: 10px;
}
.btn {
  border: none;
  cursor: pointer;
  border-radius: 14px;
  min-height: 46px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-family: inherit;
  font-size: 14px;
}
.btn:disabled { opacity: 0.6; }
.btn.primary { background: linear-gradient(135deg, #0a7e6e 0%, #109885 100%); color: #fff; }
.btn.ghost { background: #fff; color: #5a6c76; border: 1px solid #dce7ea; }
.oop-scrim {
  position: fixed;
  inset: 0;
  background: rgba(16, 33, 42, 0.45);
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}
.oop-dialog {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 22px;
  padding: 18px;
  animation: bs-fade 0.2s ease;
}
strong { color: #10212a; }
</style>