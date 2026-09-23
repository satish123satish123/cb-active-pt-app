<template>
  <div>
    <div class="lm-page-head">
      <div>
        <h2 class="lm-page-title">Dashboard</h2>
        <p class="lm-page-sub">Lead Manager South</p>
      </div>
    </div>

    <div class="lm-stack">
      <section class="lm-card filter-card">
        <div>
          <h3 class="lm-card-title">Hospital(s)</h3>
          <p class="lm-muted">
            Select hospital(s). By default you are viewing the data of all assigned clinics.
          </p>
        </div>
        <div class="hospital-picker">
          <div class="hospital-chips">
            <span v-for="clinicItem in selectedClinics" :key="clinicItem.id" class="hospital-chip">
              {{ clinicItem.name }}
              <button
                :aria-label="`Remove ${clinicItem.name}`"
                @click="removeClinic(clinicItem.id)"
              >
                ×
              </button>
            </span>
            <span v-if="!selectedClinics.length" class="lm-muted">No hospital selected</span>
          </div>
          <select
            v-model="clinicToAdd"
            class="lm-select hospital-select"
            aria-label="Add hospital"
            @change="addClinic"
          >
            <option value="">Add hospital...</option>
            <option
              v-for="clinicItem in availableClinics"
              :key="clinicItem.id"
              :value="clinicItem.id"
            >
              {{ clinicItem.name }}
            </option>
          </select>
        </div>
      </section>

      <section class="lm-card analytics-card">
        <div class="analytics-head">
          <select v-model="range" class="lm-select" aria-label="Date range">
            <option v-for="item in ranges" :key="item.id" :value="item.id">{{ item.label }}</option>
          </select>
          <h3 class="lm-card-title">Leads ({{ filteredLeads.length }})</h3>
        </div>

        <div class="analytics-grid">
          <div class="chart" aria-label="Lead activity chart">
            <div v-for="(bar, index) in chartBars" :key="index" class="bar-column">
              <span class="bar-value">{{ bar }}</span>
              <i :style="{ height: `${Math.max(6, (bar / maxBar) * 190)}px` }"></i>
              <span class="bar-label">{{ index + 1 }}</span>
            </div>
          </div>

          <div class="status-list">
            <button
              class="status-row"
              :class="{ selected: status === 'all' }"
              @click="status = 'all'"
            >
              <span>All Leads</span><strong>{{ filteredLeads.length }}</strong>
            </button>
            <button
              v-for="key in DASHBOARD_STATUSES"
              :key="key"
              class="status-row"
              :class="{ selected: status === key }"
              @click="status = key"
            >
              <span
                ><i class="dot" :style="{ background: statusMeta(key).color }"></i
                >{{ statusMeta(key).label }}</span
              >
              <strong>{{ statusCount(key) }}</strong>
            </button>
          </div>
        </div>
      </section>

      <section class="lm-card active-card">
        <div class="lm-card-head">
          <h3 class="lm-card-title">Active Leads</h3>
          <span class="lm-badge">{{ activeLeads.length }}</span>
        </div>
        <div class="lm-table-wrap">
          <table class="lm-table">
            <thead>
              <tr>
                <th>Personal details</th>
                <th>Add date</th>
                <th>Allocated To</th>
                <th>Followup</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lead in visibleActiveLeads" :key="lead.id">
                <td data-label="Personal details">
                  <router-link :to="`/lead-manager/leads/${lead.id}`" class="lead-name">{{
                    lead.name
                  }}</router-link>
                  <div class="lm-tiny">{{ lead.address }}</div>
                  <div class="lm-tiny">{{ lead.phone }}</div>
                </td>
                <td data-label="Add date">{{ fmtDateLong(lead.addedOn) }}</td>
                <td data-label="Allocated To">{{ clinic(lead.hospitalId).name }}</td>
                <td data-label="Followup">
                  <span v-if="lead.followUp">{{ fmtDateLong(lead.followUp) }}</span>
                  <span v-else class="not-added">NOT ADDED</span>
                  <router-link :to="`/lead-manager/leads/${lead.id}`" class="history-link"
                    >History</router-link
                  >
                </td>
              </tr>
              <tr v-if="!visibleActiveLeads.length">
                <td colspan="4" class="lm-empty">No active leads found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="calendar-grid">
        <aside class="lm-card calendar-filter">
          <h3 class="lm-card-title">Filter Calendar</h3>
          <label v-for="item in calendarStatuses" :key="item.key" class="radio-row">
            <input v-model="calendarStatus" type="radio" :value="item.key" />
            <i :style="{ background: item.color }"></i>{{ item.label }}
          </label>
        </aside>
        <div class="lm-card lead-calendar">
          <div class="calendar-head">
            <button class="lm-icon-btn" aria-label="Previous month" @click="calendarOffset--">
              <i class="material-icons">chevron_left</i>
            </button>
            <h3>{{ calendarTitle }}</h3>
            <button class="lm-icon-btn" aria-label="Next month" @click="calendarOffset++">
              <i class="material-icons">chevron_right</i>
            </button>
          </div>
          <div class="month-grid weekdays">
            <span v-for="day in weekDays" :key="day">{{ day }}</span>
          </div>
          <div class="month-grid days">
            <button
              v-for="day in 35"
              :key="day"
              :class="{ muted: day < 3 || day > 32, hasEvent: calendarEvents(day).length }"
            >
              <span>{{ day < 3 ? 29 + day : day > 32 ? day - 32 : day - 2 }}</span>
              <i
                v-for="event in calendarEvents(day).slice(0, 2)"
                :key="event.id"
                :style="{ background: statusMeta(event.status).color }"
                >{{ event.name }}</i
              >
            </button>
          </div>
        </div>
      </section>

      <section class="lm-card scheduler-card">
        <div class="scheduler-titlebar">
          <div>
            <h3 class="lm-card-title">Interactive Scheduler</h3>
            <p class="lm-muted">Visual calendar of physiotherapist slots and availability</p>
          </div>
          <div class="lm-seg">
            <button :class="{ on: schedulerView === 'day' }" @click="schedulerView = 'day'">
              Day</button
            ><button :class="{ on: schedulerView === 'week' }" @click="schedulerView = 'week'">
              Week
            </button>
          </div>
        </div>
        <div class="scheduler-date">
          <button class="lm-icon-btn" @click="shiftSchedule(-1)">
            <i class="material-icons">chevron_left</i></button
          ><strong>{{ scheduleDateLabel }}</strong
          ><button class="lm-icon-btn" @click="shiftSchedule(1)">
            <i class="material-icons">chevron_right</i>
          </button>
        </div>
        <div class="scheduler-filters">
          <label
            >Clinic Filter:<select v-model="schedulerClinic" class="lm-select">
              <option value="all">All Clinics</option>
              <option v-for="c in selectedClinics" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select></label
          >
          <label
            >Physio Filter:<select v-model="schedulerPhysio" class="lm-select">
              <option value="all">All Physiotherapists</option>
              <option v-for="p in physios" :key="p">{{ p }}</option>
            </select></label
          >
          <label
            >Physio Search:<input
              v-model="physioSearch"
              class="lm-input"
              placeholder="Search physiotherapist"
          /></label>
        </div>
        <div class="slot-legend">
          <span><i class="free"></i>Free</span><span><i class="confirmed"></i>Confirmed</span
          ><span><i class="pending"></i>Pending</span
          ><span><i class="off"></i>Not Per Physio Schedule</span
          ><span><i class="treated"></i>Treated</span>
        </div>
        <div class="lm-table-wrap scheduler-table">
          <table class="lm-table">
            <thead>
              <tr>
                <th>Time Slot</th>
                <th v-for="p in visiblePhysios" :key="p">{{ p }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="slot in timeSlots" :key="slot">
                <td>{{ slot }}</td>
                <td v-for="(p, index) in visiblePhysios" :key="p">
                  <button class="slot" :class="slotClass(slot, index)">
                    {{ slotClass(slot, index) === 'free' ? 'Free' : slotClass(slot, index) }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  CLINICS,
  DASHBOARD_STATUSES,
  LEADS,
  clinic,
  fmtDateLong,
  statusMeta,
} from './leadManagerDemoData'

const ranges = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'month', label: 'This Month' },
  { id: 'previous-month', label: 'Previous Month' },
  { id: 'year', label: 'This Year' },
  { id: 'custom', label: 'Custom Date' },
]
const selectedClinicIds = ref(CLINICS.map((c) => c.id))
const clinicToAdd = ref('')
const selectedClinics = computed(() =>
  CLINICS.filter((c) => selectedClinicIds.value.includes(c.id)),
)
const availableClinics = computed(() =>
  CLINICS.filter((c) => !selectedClinicIds.value.includes(c.id)),
)
function removeClinic(id) {
  selectedClinicIds.value = selectedClinicIds.value.filter((item) => item !== id)
}
function addClinic() {
  if (clinicToAdd.value) selectedClinicIds.value.push(clinicToAdd.value)
  clinicToAdd.value = ''
}
const range = ref('today')
const status = ref('all')
const filteredLeads = computed(() =>
  LEADS.filter((lead) => selectedClinicIds.value.includes(lead.hospitalId)),
)
const activeLeads = computed(() =>
  filteredLeads.value.filter((lead) => lead.status === 'active' || lead.status === 're_activated'),
)
const visibleActiveLeads = computed(() => activeLeads.value.slice(0, 12))
const statusCount = (key) => filteredLeads.value.filter((lead) => lead.status === key).length
const chartBars = computed(() => {
  const total = Math.max(filteredLeads.value.length, 1)
  return [0.35, 0.62, 0.48, 0.78, 0.55, 0.88, 0.7].map((factor, index) =>
    Math.max(0, Math.round((total / 5) * factor + (index % 2))),
  )
})
const maxBar = computed(() => Math.max(...chartBars.value, 1))

const calendarStatus = ref('all')
const calendarOffset = ref(0)
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const calendarStatuses = computed(() => [
  { key: 'all', label: 'All', color: '#667085' },
  ...DASHBOARD_STATUSES.map((key) => ({
    key,
    label: statusMeta(key).label,
    color: statusMeta(key).color,
  })),
])
const calendarTitle = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + calendarOffset.value)
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
})
function calendarEvents(cell) {
  const day = cell - 2
  if (day < 1 || day > 30) return []
  return filteredLeads.value.filter(
    (lead, index) =>
      ((index * 3 + 4) % 29) + 1 === day &&
      (calendarStatus.value === 'all' || lead.status === calendarStatus.value),
  )
}

const schedulerView = ref('day')
const scheduleDate = ref(new Date())
const schedulerClinic = ref('all')
const schedulerPhysio = ref('all')
const physioSearch = ref('')
const physios = ['Dr. Ananya Rao', 'Dr. Karthik S', 'Dr. Nisha Reddy', 'Dr. Vivek Kumar']
const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
]
const scheduleDateLabel = computed(() =>
  scheduleDate.value.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)
const visiblePhysios = computed(() =>
  physios.filter(
    (physio) =>
      (schedulerPhysio.value === 'all' || physio === schedulerPhysio.value) &&
      physio.toLowerCase().includes(physioSearch.value.toLowerCase()),
  ),
)
function shiftSchedule(days) {
  const next = new Date(scheduleDate.value)
  next.setDate(next.getDate() + days * (schedulerView.value === 'week' ? 7 : 1))
  scheduleDate.value = next
}
function slotClass(slot, index) {
  return ['free', 'confirmed', 'pending', 'treated', 'off'][
    (timeSlots.indexOf(slot) + index * 2) % 5
  ]
}
</script>

<style scoped>
.filter-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
  padding: 18px;
}
.filter-card p {
  margin: 6px 0 0;
}
.hospital-select {
  width: 100%;
}
.hospital-picker {
  width: 100%;
  display: grid;
  gap: 10px;
}
.hospital-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  width: 100%;
  max-height: none;
  overflow: visible;
}
.hospital-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px 7px 11px;
  border: 1px solid var(--lm-line);
  border-radius: 8px;
  background: var(--lm-subtle);
  color: var(--lm-text);
  font-size: 12px;
  font-weight: 600;
}
.hospital-chip button {
  border: 0;
  background: transparent;
  color: var(--lm-text-3);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}
.analytics-card {
  padding: 22px;
}
.analytics-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.analytics-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(240px, 0.8fr);
  gap: 28px;
}
.chart {
  min-height: 250px;
  display: flex;
  align-items: flex-end;
  gap: clamp(10px, 3vw, 36px);
  padding: 24px 18px 0;
  border-left: 1px solid var(--lm-line);
  border-bottom: 1px solid var(--lm-line);
}
.bar-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: 20px;
  height: 220px;
}
.bar-column i {
  display: block;
  width: min(42px, 70%);
  border-radius: 7px 7px 0 0;
  background: var(--lm-brand);
}
.bar-value,
.bar-label {
  font-size: 11px;
  color: var(--lm-text-3);
}
.bar-label {
  margin-top: 6px;
}
.status-list {
  border: 1px solid var(--lm-line-soft);
  border-radius: 12px;
  overflow: hidden;
}
.status-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 13px;
  border: 0;
  border-bottom: 1px solid var(--lm-line-soft);
  background: #fff;
  color: var(--lm-text);
  cursor: pointer;
}
.status-row:last-child {
  border-bottom: 0;
}
.status-row.selected {
  background: var(--lm-brand-ink);
  color: var(--lm-brand);
}
.status-row span {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.active-card {
  overflow: hidden;
}
.active-card .lm-card-head {
  padding: 20px 22px;
}
.lead-name {
  color: var(--lm-text);
  font-weight: 700;
  text-decoration: none;
}
.lead-name:hover {
  color: var(--lm-brand);
}
.not-added {
  color: #d92d20;
  font-weight: 700;
}
.history-link {
  display: block;
  width: fit-content;
  margin-top: 6px;
  color: var(--lm-brand);
  font-size: 12px;
  font-weight: 700;
}
.calendar-grid {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 18px;
}
.calendar-filter {
  padding: 20px;
  align-self: start;
}
.calendar-filter h3 {
  margin-bottom: 12px;
}
.radio-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 4px;
  border-bottom: 1px solid var(--lm-line-soft);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}
.radio-row i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.lead-calendar {
  padding: 20px;
  overflow: hidden;
}
.calendar-head,
.scheduler-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.calendar-head h3 {
  min-width: 180px;
  margin: 0;
  text-align: center;
  font-size: 16px;
}
.month-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.weekdays {
  margin-top: 18px;
  background: var(--lm-subtle);
  border: 1px solid var(--lm-line-soft);
  border-bottom: 0;
}
.weekdays span {
  padding: 9px;
  text-align: center;
  color: var(--lm-text-3);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}
.days button {
  min-height: 92px;
  padding: 7px;
  border: 1px solid var(--lm-line-soft);
  border-width: 1px 0 0 1px;
  background: #fff;
  text-align: left;
  color: var(--lm-text);
}
.days button:nth-child(7n) {
  border-right-width: 1px;
}
.days button:nth-last-child(-n + 7) {
  border-bottom-width: 1px;
}
.days button.muted {
  color: #c2c8cc;
  background: #fafbfb;
}
.days button > span {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 700;
}
.days button > i {
  display: block;
  margin: 3px 0;
  padding: 3px 5px;
  overflow: hidden;
  border-radius: 4px;
  color: white;
  font-size: 9px;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scheduler-card {
  padding: 22px;
}
.scheduler-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.scheduler-titlebar p {
  margin: 5px 0 0;
}
.scheduler-titlebar .lm-seg {
  display: flex;
}
.scheduler-titlebar .lm-seg button {
  border: 0;
  padding: 8px 14px;
  background: transparent;
  cursor: pointer;
}
.scheduler-titlebar .lm-seg button.on {
  background: var(--lm-brand);
  color: white;
  border-radius: 8px;
}
.scheduler-date {
  margin: 20px 0;
}
.scheduler-date strong {
  min-width: 260px;
  text-align: center;
}
.scheduler-filters {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
  padding: 15px;
  border-radius: 10px;
  background: var(--lm-subtle);
}
.scheduler-filters label {
  display: grid;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
}
.slot-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 18px 0 10px;
  color: var(--lm-text-2);
  font-size: 11px;
}
.slot-legend span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.slot-legend i {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}
.slot-legend .free,
.slot.free {
  background: #e8f7ee;
  color: #178447;
  border-color: #8bd2aa;
}
.slot-legend .confirmed,
.slot.confirmed {
  background: #feecec;
  color: #c62f2f;
  border-color: #ee9999;
}
.slot-legend .pending,
.slot.pending {
  background: #fff7df;
  color: #a46f00;
  border-color: #e9c661;
}
.slot-legend .treated,
.slot.treated {
  background: #e7f1ff;
  color: #2268b4;
  border-color: #8fb8e6;
}
.slot-legend .off,
.slot.off {
  background: #f1f2f4;
  color: #667085;
  border-color: #bdc3ca;
}
.slot {
  width: 100%;
  min-width: 92px;
  padding: 7px;
  border: 1px solid;
  border-radius: 7px;
  text-transform: capitalize;
}
@media (max-width: 820px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  .filter-card {
    align-items: stretch;
    flex-direction: column;
  }
  .hospital-select {
    width: 100%;
  }
  .calendar-grid {
    grid-template-columns: 1fr;
  }
  .scheduler-filters {
    grid-template-columns: 1fr;
  }
}
</style>
