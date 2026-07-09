<template>
  <div class="ph-page">
    <div class="ph-screen" style="padding-bottom: 120px">
      <!-- ============ TOPBAR ============ -->
      <div class="topbar">
        <button class="back" @click="$router.push('/physio')">←</button>
        <div class="grow">
          <h2 class="font-sora">Treatment room</h2>
          <div class="muted" style="font-size: 12.5px">{{ p.name }} · {{ p.condition }}</div>
        </div>
      </div>

      <PhysioStepper :step="1" />

      <div class="section" style="margin-top: 8px">
        <p class="muted" style="margin: 0 2px">
          Record what you did, confirm the home exercises, then continue to billing.
        </p>
      </div>

      <!-- ============ PATIENT APP FEEDBACK ============ -->
      <div v-if="p.feedback" class="section" style="margin-top: 12px">
        <div class="card" style="background: var(--grad-soft); border-color: #cfeee6">
          <div class="between">
            <strong style="font-size: 13px">📲 From patient's app</strong>
            <span class="tiny">{{ p.feedback.when }}</span>
          </div>
          <div class="muted" style="margin-top: 6px">
            Reported pain <strong style="color: var(--warning)">{{ p.feedback.pain }}/10</strong> ·
            home exercises felt <strong>{{ p.feedback.difficulty }}</strong>
          </div>
          <div class="muted" style="margin-top: 4px; font-style: italic">"{{ p.feedback.note }}"</div>
        </div>
      </div>

      <!-- ============ CLINICAL TREATMENT (tap-to-time) ============ -->
      <div class="section">
        <div class="section-title">
          <h3 class="font-sora">Clinical Treatment</h3>
          <span class="link" @click="showAddMod = true">+ Add</span>
        </div>
        <p class="tiny" style="margin: -2px 2px 8px">
          Tap a therapy when you start it, and End when you take it off. You can run more than one
          at the same time — finishing the session stops any that are still running.
        </p>
        <div class="card">
          <template v-for="m in MODALITIES" :key="m.id">
            <!-- running -->
            <div
              v-if="entryOf(m.id) && entryOf(m.id).end === null"
              class="pick on"
              style="margin-bottom: 8px; border-color: var(--brand-2)"
            >
              <span class="ph-dot" style="background: var(--brand); box-shadow: 0 0 0 4px rgba(10, 126, 110, 0.18)"></span>
              <div class="grow">
                <div style="font-weight: 800; font-size: 14px">{{ m.name }}</div>
                <div class="tiny" style="color: var(--brand)">Running · {{ elapsed(entryOf(m.id)) }}</div>
              </div>
              <button class="btn secondary small" @click="endModality(m.id)">End</button>
            </div>
            <!-- done -->
            <div v-else-if="entryOf(m.id)" class="pick" style="margin-bottom: 8px; background: #f1faf7">
              <div class="check on">✓</div>
              <div class="grow">
                <div style="font-weight: 800; font-size: 14px">{{ m.name }}</div>
                <div class="tiny">Done · {{ fmtDur((entryOf(m.id).end - entryOf(m.id).start) / 1000) }}</div>
              </div>
              <button class="btn ghost small" @click="startModality(m.id)">Redo</button>
            </div>
            <!-- idle -->
            <div v-else class="pick" style="margin-bottom: 8px" @click="startModality(m.id)">
              <div class="check"><span style="color: var(--text-3)">▶</span></div>
              <div class="grow">
                <div style="font-weight: 700; font-size: 14px">{{ m.name }}</div>
                <div class="tiny">~{{ m.std }} min standard</div>
              </div>
              <span class="tiny" style="color: var(--text-3)">Tap to start</span>
            </div>
          </template>
        </div>
      </div>

      <!-- ============ HOME EXERCISE PROGRAM ============ -->
      <div class="section">
        <div class="section-title">
          <h3 class="font-sora">Home exercise program</h3>
          <span class="link" @click="showExPicker = true">+ Add</span>
        </div>
        <p class="tiny" style="margin: -4px 2px 8px">
          From the treatment plan — confirm what stays for this patient. Tap to include/exclude.
        </p>

        <template v-if="p.exercises.length">
          <div
            v-for="ex in p.exercises"
            :key="ex.id"
            class="card"
            :style="confirmedSet.has(ex.id) ? '' : 'opacity:.55'"
          >
            <div class="between">
              <div class="row" style="gap: 10px">
                <button
                  class="check"
                  :class="{ on: confirmedSet.has(ex.id) }"
                  style="cursor: pointer"
                  @click="toggleConfirm(ex.id)"
                >
                  {{ confirmedSet.has(ex.id) ? '✓' : '' }}
                </button>
                <div>
                  <div style="font-weight: 800">{{ exDef(ex.id).name }}</div>
                  <div class="tiny">{{ exDef(ex.id).part }} · {{ exDef(ex.id).equip }}</div>
                </div>
              </div>
              <span v-if="confirmedSet.has(ex.id)" class="chip" style="background: var(--brand-3); color: var(--brand)">In plan</span>
              <span v-else class="chip">Excluded</span>
            </div>
            <div class="chips">
              <span class="chip">{{ exDef(ex.id).sets }} sets</span>
              <span class="chip">{{ exDef(ex.id).reps }} reps</span>
              <span v-if="exDef(ex.id).hold" class="chip">{{ exDef(ex.id).hold }}s hold</span>
              <span v-if="confirmedSet.has(ex.id)" class="chip" style="background: #eef9f5">📲 In patient's app</span>
            </div>
          </div>
        </template>
        <div v-else class="card" style="text-align: center; color: var(--text-3)">
          No exercises in the plan yet.<br />
          <span class="tiny">Add one — it syncs to the patient's ActivPT app.</span>
        </div>
      </div>

      <!-- ============ SESSION NOTE ============ -->
      <div class="section" style="margin-top: 14px">
        <p class="field-label">Session note</p>
        <textarea
          v-model="a.note"
          class="textarea"
          placeholder="Progress, response to treatment, plan for next visit…"
        ></textarea>
      </div>
    </div>

    <!-- ============ STICKY FOOT ============ -->
    <div class="sticky-foot">
      <button class="btn primary full" @click="finishTreatment">Continue to billing →</button>
    </div>

    <!-- ============ ADD TREATMENT SHEET ============ -->
    <div v-if="showAddMod" class="scrim" @click="showAddMod = false">
      <div class="sheet" @click.stop>
        <div class="grabber"></div>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">Add a treatment</h2>
        <p class="muted" style="margin: 0 0 14px">Adds it to the Clinical Treatment list for everyone in this clinic.</p>
        <p class="field-label">Name</p>
        <input v-model="newModName" class="input" placeholder="e.g. Shockwave Therapy" />
        <p class="field-label" style="margin-top: 14px">Standard minutes</p>
        <input v-model.number="newModMin" class="input" type="number" min="1" />
        <button class="btn primary full" style="margin-top: 16px" @click="addModality">Add treatment</button>
      </div>
    </div>

    <!-- ============ EXERCISE PICKER SHEET ============ -->
    <div v-if="showExPicker" class="scrim" @click="showExPicker = false">
      <div class="sheet" @click.stop>
        <div class="grabber"></div>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">Add to home program</h2>
        <p class="muted" style="margin: 0 0 14px">Added exercises join the plan and sync to the patient's app.</p>
        <div
          v-for="e in EXERCISES"
          :key="e.id"
          class="pick"
          :class="{ on: inPlan(e.id) }"
          style="margin-bottom: 8px"
          @click="togglePlan(e.id)"
        >
          <div class="check" :class="{ on: inPlan(e.id) }">
            <template v-if="inPlan(e.id)">✓</template>
            <span v-else style="color: var(--text-3)">+</span>
          </div>
          <div class="grow">
            <div style="font-weight: 700; font-size: 14px">{{ e.name }}</div>
            <div class="tiny">{{ e.part }} · {{ e.sets }}×{{ e.reps }}{{ e.hold ? ` · ${e.hold}s` : '' }}</div>
          </div>
        </div>
        <button class="btn primary full" style="margin-top: 12px" @click="showExPicker = false">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import PhysioStepper from './PhysioStepper.vue'
import {
  getAppt, getPatient, MODALITIES, EXERCISES, exDef,
  startMod, endMod, endAllRunning, fmtElapsed, fmtDur,
} from './physioDemoData'

const route = useRoute()
const router = useRouter()

const a = getAppt(route.params.id) || getAppt('a1')
const p = getPatient(a.pid)

// default: whole plan confirmed
if (a.exConfirmed === null) a.exConfirmed = p.exercises.map((e) => e.id)
const confirmedSet = computed(() => new Set(a.exConfirmed))

/* ---------------- live timer tick ---------------- */
const tick = ref(Date.now())
let handle = null
onMounted(() => {
  handle = setInterval(() => (tick.value = Date.now()), 1000)
})
onUnmounted(() => clearInterval(handle))

const entryOf = (id) => a.modLog.find((m) => m.id === id)
const elapsed = (e) => fmtElapsed(tick.value - e.start)

function startModality(id) {
  startMod(a, id)
}
function endModality(id) {
  endMod(a, id)
}

/* ---------------- exercises ---------------- */
function toggleConfirm(id) {
  if (a.exConfirmed.includes(id)) a.exConfirmed = a.exConfirmed.filter((x) => x !== id)
  else a.exConfirmed = [...a.exConfirmed, id]
}
const inPlan = (id) => p.exercises.some((x) => x.id === id)
function togglePlan(id) {
  const i = p.exercises.findIndex((x) => x.id === id)
  if (i >= 0) {
    p.exercises.splice(i, 1)
    a.exConfirmed = a.exConfirmed.filter((x) => x !== id)
  } else {
    p.exercises.push({ id })
    a.exConfirmed = [...a.exConfirmed, id]
  }
}

/* ---------------- add custom modality ---------------- */
const showAddMod = ref(false)
const showExPicker = ref(false)
const newModName = ref('')
const newModMin = ref(10)
function addModality() {
  const name = newModName.value.trim()
  if (!name) {
    Notify.create({ type: 'negative', message: 'Enter a name' })
    return
  }
  MODALITIES.push({ id: 'cust-' + Date.now(), name, std: Math.max(1, newModMin.value || 10) })
  newModName.value = ''
  newModMin.value = 10
  showAddMod.value = false
  Notify.create({ message: 'Treatment added' })
}

/* ---------------- finish ---------------- */
function finishTreatment() {
  endAllRunning(a)
  a.status = 'done'
  router.push(`/physio/invoice/${a.id}`)
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
  --brand-3: #d8f1eb;
  --warning: #c78810;
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
.section-title .link {
  color: var(--brand);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
.row { display: flex; align-items: center; gap: 12px; }
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

/* selectable rows */
.pick {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  cursor: pointer;
  background: #fff;
  transition: 0.15s;
}
.pick.on {
  border-color: var(--brand-2);
  background: var(--grad-soft);
}
.check {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 2px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  flex: none;
  background: #fff;
}
.check.on {
  background: var(--brand);
  border-color: var(--brand);
}
.ph-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex: none;
}

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
.btn.secondary { background: var(--brand-3); color: var(--brand); }
.btn.ghost { background: transparent; color: var(--text-2); border: 1px solid var(--line); }
.btn.small { min-height: 36px; border-radius: 12px; padding: 0 12px; font-size: 13px; }
.btn.full { width: 100%; }

.field-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-2);
  margin: 0 0 6px 2px;
  letter-spacing: 0.01em;
}
.input, .textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 11px 12px;
  background: #fff;
  color: var(--text);
  outline: none;
  font-size: 15px;
  font-family: inherit;
}
.input:focus, .textarea:focus {
  border-color: var(--brand-2);
  box-shadow: 0 0 0 3px rgba(15, 152, 134, 0.12);
}
.textarea { min-height: 84px; resize: vertical; }

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