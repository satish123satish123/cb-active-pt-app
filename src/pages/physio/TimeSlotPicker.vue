<template>
  <div class="tsp">
    <button class="tsp-field" type="button" @click="open = !open">
      <span :style="!modelValue ? 'color: #8da0aa' : ''">{{ modelValue || placeholder }}</span>
      <span class="tsp-chev" :class="{ open }">▾</span>
    </button>
    <div v-if="open" class="tsp-overlay" @click="open = false"></div>
    <div v-if="open" class="tsp-panel">
      <!-- Hours -->
      <div class="tsp-col">
        <div class="tsp-h">Hr</div>
        <button
          v-for="h in hourList"
          :key="h.v"
          class="tsp-cell"
          :class="{ sel: selH === h.v, booked: h.bookedOnly, dim: hourDim(h) }"
          @click="pickH(h)"
        >
          {{ h.v }}
        </button>
      </div>
      <!-- Minutes -->
      <div class="tsp-col">
        <div class="tsp-h">Min</div>
        <button
          v-for="m in minuteList"
          :key="m.v"
          class="tsp-cell"
          :class="{ sel: selM === m.v, booked: m.bookedOnly }"
          @click="pickM(m)"
        >
          {{ m.v }}
        </button>
        <div v-if="!minuteList.length" class="tsp-empty">—</div>
      </div>
      <!-- AM / PM -->
      <div class="tsp-col tsp-col-ap">
        <div class="tsp-h">&nbsp;</div>
        <button
          v-for="ap in apList"
          :key="ap.v"
          class="tsp-cell"
          :class="{ sel: selAP === ap.v, booked: ap.bookedOnly, dim: apDim(ap) }"
          @click="pickAP(ap)"
        >
          {{ ap.v }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, default: () => [] }, // available: ["11:15 AM", ...]
  booked: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select Timeslot' },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const selH = ref('')
const selM = ref('')
const selAP = ref('')

function parse(v) {
  const m = String(v).trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  return m ? { h: m[1].padStart(2, '0'), m: m[2], ap: m[3].toUpperCase() } : null
}
const all = computed(() => [
  ...props.options.map((v) => ({ ...parse(v), v, booked: false })).filter((x) => x.h),
  ...props.booked.map((v) => ({ ...parse(v), v, booked: true })).filter((x) => x.h),
])

function initFromValue() {
  const p = parse(props.modelValue)
  if (p) {
    selH.value = p.h
    selM.value = p.m
    selAP.value = p.ap
  } else {
    selH.value = ''
    selM.value = ''
    selAP.value = ''
  }
}
watch(() => props.modelValue, initFromValue, { immediate: true })
watch(open, (o) => o && initFromValue())

/* column lists — each filtered by the other selections (cascading) */
function distinct(items, key) {
  const map = new Map()
  for (const it of items) {
    const k = it[key]
    if (!map.has(k)) map.set(k, { v: k, bookedOnly: true })
    if (!it.booked) map.get(k).bookedOnly = false
  }
  return [...map.values()]
}
const hourSort = (a, b) => {
  const na = Number(a.v) % 12
  const nb = Number(b.v) % 12
  return na - nb
}
/* Hours: ALWAYS all hours available in the day (never hidden by AM/PM) */
const hourList = computed(() => distinct(all.value, 'h').sort(hourSort))
/* Minutes: filtered downward by chosen hour (+ period when chosen) */
const minuteList = computed(() =>
  distinct(
    all.value.filter((x) => (!selH.value || x.h === selH.value) && (!selAP.value || x.ap === selAP.value)),
    'm',
  ).sort((a, b) => Number(a.v) - Number(b.v)),
)
/* AM/PM: ALWAYS both periods that exist in the day */
const apList = computed(() => distinct(all.value, 'ap'))

function matches(h, m, ap) {
  return all.value.filter(
    (x) => (!h || x.h === h) && (!m || x.m === m) && (!ap || x.ap === ap),
  )
}
function tryEmit() {
  if (!selH.value || !selM.value) return
  let ap = selAP.value
  if (!ap) {
    const cands = [...new Set(matches(selH.value, selM.value, '').map((x) => x.ap))]
    if (cands.length === 1) {
      ap = cands[0]
      selAP.value = ap
    } else return
  }
  const hit = matches(selH.value, selM.value, ap).find((x) => !x.booked)
  if (hit) {
    emit('update:modelValue', hit.v)
    open.value = false
  }
}
function pickH(h) {
  selH.value = h.v
  // if the chosen period doesn't exist for this hour, drop it
  if (selAP.value && !matches(h.v, '', selAP.value).length) selAP.value = ''
  // if only one period exists for this hour, auto-pick it
  if (!selAP.value) {
    const periods = [...new Set(matches(h.v, '', '').map((x) => x.ap))]
    if (periods.length === 1) selAP.value = periods[0]
  }
  if (selM.value && !matches(h.v, selM.value, selAP.value).length) selM.value = ''
  tryEmit()
}
function pickM(m) {
  selM.value = m.v
  tryEmit()
}
function pickAP(ap) {
  selAP.value = ap.v
  if (selH.value && !matches(selH.value, '', ap.v).length) {
    selH.value = ''
    selM.value = ''
  } else if (selM.value && !matches(selH.value, selM.value, ap.v).length) {
    selM.value = ''
  }
  tryEmit()
}
/* dim helpers so incompatible cells look inactive but stay tappable */
function hourDim(h) {
  return selAP.value ? !matches(h.v, '', selAP.value).length : false
}
function apDim(ap) {
  return selH.value ? !matches(selH.value, '', ap.v).length : false
}
</script>

<style scoped>
.tsp {
  position: relative;
}
.tsp-field {
  width: 100%;
  border: 1px solid #dce7ea;
  border-radius: 12px;
  min-height: 46px;
  padding: 0 14px;
  font-size: 15px;
  font-family: inherit;
  font-weight: 600;
  color: #10212a;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
}
.tsp-field:focus {
  border-color: #0a7e6e;
  outline: none;
}
.tsp-chev {
  color: #8da0aa;
  transition: transform 0.18s ease;
}
.tsp-chev.open {
  transform: rotate(180deg);
}
.tsp-overlay {
  position: fixed;
  inset: 0;
  z-index: 55;
}
.tsp-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #dce7ea;
  border-radius: 14px;
  box-shadow: 0 14px 34px rgba(16, 33, 42, 0.12);
  z-index: 60;
  display: flex;
  max-height: 250px;
  overflow: hidden;
  animation: tsp-fade 0.14s ease;
}
@keyframes tsp-fade {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.tsp-col {
  flex: 1;
  overflow-y: auto;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tsp-col + .tsp-col {
  border-left: 1px solid #eef3f4;
}
.tsp-col-ap {
  flex: 0.9;
}
.tsp-h {
  position: sticky;
  top: 0;
  background: #fff;
  text-align: center;
  font-size: 10.5px;
  font-weight: 800;
  color: #8da0aa;
  padding: 3px 0 5px;
  z-index: 1;
}
.tsp-cell {
  border: none;
  background: transparent;
  border-radius: 9px;
  padding: 9px 0;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  color: #10212a;
  text-align: center;
  cursor: pointer;
  transition: 0.12s ease;
  flex: none;
}
.tsp-cell:hover {
  background: #eef6f5;
}
.tsp-cell.sel {
  background: #0a7e6e;
  color: #fff;
}
.tsp-cell.booked {
  opacity: 0.35;
  text-decoration: line-through;
}
.tsp-cell.dim {
  opacity: 0.4;
}
.tsp-empty {
  text-align: center;
  color: #8da0aa;
  padding: 10px 0;
}
</style>