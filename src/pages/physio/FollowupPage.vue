<template>
  <div class="ph-page">
    <div class="ph-screen" style="padding-bottom: 120px">
      <!-- ============ TOPBAR ============ -->
      <div class="topbar">
        <button class="back" @click="$router.push('/physio')">←</button>
        <div class="grow">
          <h2 class="font-sora">Book follow-up</h2>
          <div class="muted" style="font-size: 12.5px">{{ p.name }}</div>
        </div>
      </div>

      <PhysioStepper :step="3" />

      <!-- ============ INVOICE GENERATED BANNER ============ -->
      <div class="section" style="margin-top: 12px">
        <div class="card" style="background: var(--grad-soft); border-color: #cfeee6">
          <div class="row">
            <span style="font-size: 22px">✅</span>
            <div>
              <strong>Invoice generated</strong>
              <div class="muted">Sent to counter as payment-pending.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ WHEN ============ -->
      <div class="section" style="margin-top: 12px">
        <div class="card">
          <p class="field-label">When should they come back?</p>
          <div class="chips" style="margin-top: 2px">
            <button
              v-for="[n, l] in pills"
              :key="n"
              class="chip"
              :class="{ active: offset === n }"
              @click="setOffset(n)"
            >
              {{ l }}
            </button>
          </div>
          <p class="field-label" style="margin-top: 16px">Date</p>
          <input v-model="fuDate" class="input" type="date" />
          <p class="field-label" style="margin-top: 14px">Time</p>
          <input v-model="fuTime" class="input" type="time" />
          <p class="tiny" style="margin-top: 8px">
            Time defaults to today's appointment slot — change it if needed.
          </p>
        </div>
      </div>
    </div>

    <!-- ============ STICKY FOOT ============ -->
    <div class="sticky-foot row" style="gap: 10px">
      <button class="btn ghost" style="flex: none; width: 38%" @click="skip">Skip</button>
      <button class="btn primary grow" @click="book">Book follow-up</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import PhysioStepper from './PhysioStepper.vue'
import { getAppt, getPatient, isoDate, addDays, TODAY } from './physioDemoData'

const route = useRoute()
const router = useRouter()

const a = getAppt(route.params.id) || getAppt('a1')
const p = getPatient(a.pid)

const pills = [
  [0, 'Today'],
  [1, 'Tomorrow'],
  [2, 'In 2 days'],
  [3, 'In 3 days'],
  [5, 'In 5 days'],
  [7, 'Next week'],
]
const offset = ref(2)
const fuDate = ref(isoDate(addDays(TODAY, 2)))
const fuTime = ref(a.time)

function setOffset(n) {
  offset.value = n
  fuDate.value = isoDate(addDays(TODAY, n))
}

function skip() {
  router.push('/physio')
}
function book() {
  a.followUp = { date: fuDate.value, time: fuTime.value }
  Notify.create({ type: 'positive', message: 'Follow-up booked ✓' })
  router.push('/physio')
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
  --brand-2: #0f9886;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
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
.topbar h2 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
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
.row { display: flex; align-items: center; gap: 12px; }
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
.btn:active { transform: scale(0.985); }
.btn.primary { background: var(--grad); color: #fff; box-shadow: var(--shadow-sm); }
.btn.ghost { background: transparent; color: var(--text-2); border: 1px solid var(--line); }
.btn.grow { flex: 1; }

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
  border-top: 1px solid var(--line);
  z-index: 25;
}
</style>