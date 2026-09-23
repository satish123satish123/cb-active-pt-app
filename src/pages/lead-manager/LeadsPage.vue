<template>
  <div>
    <div class="lm-page-head">
      <div>
        <h2 class="lm-page-title">Leads</h2>
        <p class="lm-page-sub">{{ LEADS.length }} leads across your network</p>
      </div>
      <button class="lm-btn primary" @click="showAddLead = true">
        <i class="material-icons">add</i> Add New Lead
      </button>
    </div>

    <section class="lm-card flush has-table">
      <!-- ============ TOOLBAR ============ -->
      <div class="lm-card-head">
        <div class="lm-toolbar" style="width: 100%">
          <div class="lm-search lm-grow">
            <i class="material-icons">search</i>
            <input
              v-model="search"
              class="lm-input"
              type="search"
              placeholder="Search name, phone or lead ID"
              aria-label="Search leads"
            />
          </div>
          <select v-model="sort" class="lm-select" aria-label="Sort leads">
            <option value="recent">Added on — newest</option>
            <option value="oldest">Added on — oldest</option>
            <option value="followup">Follow-up soonest</option>
            <option value="priority">Priority — Hot first</option>
          </select>
        </div>

        <div class="lm-toolbar filters">
          <select
            v-for="f in FILTER_FIELDS"
            :key="f.key"
            v-model="filters[f.key]"
            class="lm-select"
            :class="{ set: filters[f.key] !== 'all' }"
            :aria-label="f.label"
          >
            <option value="all">{{ f.any }}</option>
            <option v-if="f.key === 'handledBy'" value="none">Unassigned</option>
            <option v-for="o in f.options" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <button v-if="filterCount || search" class="lm-btn sm" @click="resetAll">
            <i class="material-icons">close</i> Clear
          </button>
        </div>

        <div class="lm-chips">
          <button class="lm-chip" :class="{ on: status === 'all' }" @click="status = 'all'">
            All Leads <span class="count">{{ baseList.length }}</span>
          </button>
          <button
            v-for="s in statusPills"
            :key="s.key"
            class="lm-chip"
            :class="{ on: status === s.key }"
            @click="status = s.key"
          >
            <span class="lm-dot" :style="{ background: s.color }"></span>
            {{ s.label }} <span class="count">{{ s.count }}</span>
          </button>
        </div>
      </div>

      <!-- ============ TABLE (CRM leadtracker columns) ============ -->
      <div class="lm-table-wrap">
        <table class="lm-table">
          <thead>
            <tr>
              <th>Details</th>
              <th>Treatment Preferred</th>
              <th>Source</th>
              <th>Clinic</th>
              <th>Added On</th>
              <th>Follow up Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Handled By</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="l in filtered"
              :key="l.id"
              class="is-link"
              tabindex="0"
              @click="open(l.id)"
              @keydown.enter="open(l.id)"
            >
              <td class="lm-td-main" data-label="Details">
                <div class="lm-row">
                  <span class="lm-avatar">{{ initials(l.name) }}</span>
                  <div style="min-width: 0">
                    <div class="lm-strong lm-truncate">
                      {{ SALUTATIONS[l.salutation] }} {{ l.name }}
                    </div>
                    <div class="lm-tiny">{{ l.phone }} · {{ l.age }} · {{ l.gender }}</div>
                  </div>
                </div>
              </td>
              <td data-label="Treatment Preferred">
                <div class="cell-2">
                  <span class="lm-truncate">{{ l.condition }}</span>
                  <span class="lm-tiny">
                    {{ TREATMENTS[l.treatment] || '—' }} · {{ leadTypeLabel(l.leadType) }}
                  </span>
                </div>
              </td>
              <td data-label="Source">
                <div class="cell-2">
                  <span>{{ sourceMeta(l.source).label }}</span>
                  <span class="lm-tiny">
                    {{ l.sourceMedium ? mediumLabel(l.sourceMedium) + ' · ' : ''
                    }}{{ channelLabel(l.channel) }}
                  </span>
                </div>
              </td>
              <td data-label="Clinic">{{ clinicShort(l.hospitalId) }}</td>
              <td data-label="Added On">
                <div class="cell-2">
                  <span>{{ fmtDate(l.addedOn) }}</span>
                  <span class="lm-tiny">{{ ampm(l.addedTime) }}</span>
                </div>
              </td>
              <td data-label="Follow up Date">
                <div v-if="l.followUp" class="cell-2">
                  <span :style="followUpTone(l)">{{ relDay(l.followUp) }}</span>
                  <span class="lm-tiny">{{ ampm(l.followUpTime) }}</span>
                </div>
                <span v-else class="lm-tiny">—</span>
              </td>
              <td data-label="Priority">
                <span class="lm-badge" :style="tone(priorityMeta(l.priority).color)">
                  {{ priorityMeta(l.priority).label }}
                </span>
              </td>
              <td data-label="Status">
                <span class="lm-badge" :style="tone(statusMeta(l.status).color)">
                  {{ statusMeta(l.status).label }}
                </span>
              </td>
              <td data-label="Handled By">{{ staffName(l.handledBy) }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="!filtered.length" class="lm-empty">
          <div class="e-icon">🔍</div>
          <div class="e-title">No leads match</div>
          <div>Try a different status or clear your filters.</div>
        </div>
      </div>
    </section>

    <div v-if="showAddLead" class="lm-scrim" @click.self="showAddLead = false">
      <form
        class="lm-sheet lead-form"
        role="dialog"
        aria-modal="true"
        @submit.prevent="showAddLead = false"
      >
        <div class="lm-sheet-head">
          <h3 class="lm-sheet-title">Add New Lead.</h3>
          <button type="button" class="lm-icon-btn" @click="showAddLead = false">
            <i class="material-icons">close</i>
          </button>
        </div>
        <div class="lead-form-grid">
          <label v-for="field in addLeadFields" :key="field" class="lm-field"
            ><span class="lm-label">{{ field }}</span
            ><input class="lm-input"
          /></label>
        </div>
        <div class="lm-sheet-foot">
          <button type="button" class="lm-btn" @click="showAddLead = false">Cancel</button
          ><button class="lm-btn primary" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  CHANNELS,
  CLINICS,
  FILTER_STATUSES,
  LEADS,
  LOST_CATEGORIES,
  OPEN_STATUSES,
  PRIORITIES,
  SALUTATIONS,
  SOURCES,
  STAFF,
  TREATMENTS,
  ampm,
  channelLabel,
  clinicShort,
  fmtDate,
  initials,
  leadTypeLabel,
  mediumLabel,
  priorityMeta,
  relDay,
  sourceMeta,
  staffName,
  statusMeta,
  todayISO,
} from './leadManagerDemoData'

const router = useRouter()
const showAddLead = ref(false)
const addLeadFields = [
  'Name',
  'Phone *',
  'Email',
  'Gender *',
  'Age',
  'Address',
  'Service Type *',
  'Status',
  'Priority',
  'Treatment Preferred *',
  'Gender Preferred *',
  'Locality *',
  'Pin Code *',
  'Source',
  'Via',
  'Ad. Name',
  'Referred By',
  'Channel',
  'Follow up',
  'Condition',
  'Additional Info',
]

const search = ref('')
const status = ref('all')
const sort = ref('recent')

/* ---------------- filters — mirror the CRM leadtracker filter bar ---------------- */
const toOptions = (catalogue) =>
  Object.entries(catalogue).map(([value, meta]) => ({ value, label: meta.label }))

const FILTER_FIELDS = [
  {
    key: 'hospitalId',
    label: 'Allocated to',
    any: 'All hospitals',
    options: CLINICS.map((c) => ({ value: c.id, label: c.name })),
  },
  { key: 'source', label: 'Source', any: 'All sources', options: toOptions(SOURCES) },
  { key: 'channel', label: 'Lead Channel', any: 'All channels', options: toOptions(CHANNELS) },
  { key: 'priority', label: 'Priority', any: 'Any priority', options: toOptions(PRIORITIES) },
  {
    key: 'handledBy',
    label: 'Handled By',
    any: 'Anyone',
    options: STAFF.map((s) => ({ value: s.id, label: s.name })),
  },
  {
    key: 'lostCategory',
    label: 'Lost Reason Category',
    any: 'Any lost reason',
    options: toOptions(LOST_CATEGORIES),
  },
]

const blankFilters = () => Object.fromEntries(FILTER_FIELDS.map((f) => [f.key, 'all']))
const filters = reactive(blankFilters())
const filterCount = computed(() => Object.values(filters).filter((v) => v !== 'all').length)

function matchesFilters(lead) {
  return FILTER_FIELDS.every(({ key }) => {
    const want = filters[key]
    if (want === 'all') return true
    if (want === 'none') return !lead[key]
    return lead[key] === want
  })
}

function matchesSearch(lead) {
  const q = search.value.trim().toLowerCase()
  if (!q) return true
  const digits = q.replace(/\D/g, '')
  return (
    lead.name.toLowerCase().includes(q) ||
    lead.id.toLowerCase().includes(q) ||
    (digits.length > 0 && lead.phone.replace(/\D/g, '').includes(digits))
  )
}

/** Everything except the status chip — so the chip counts stay meaningful. */
const baseList = computed(() => LEADS.filter((l) => matchesFilters(l) && matchesSearch(l)))

/** Only the statuses the CRM's Leads dropdown offers, hiding empty ones. */
const statusPills = computed(() =>
  FILTER_STATUSES.map((k) => ({
    key: k,
    label: statusMeta(k).label,
    color: statusMeta(k).color,
    count: baseList.value.filter((l) => l.status === k).length,
  })).filter((s) => s.count > 0),
)

const stampOf = (date, time) => (date || '9999-12-31') + (time || '')
const SORTERS = {
  recent: (a, b) => stampOf(b.addedOn, b.addedTime).localeCompare(stampOf(a.addedOn, a.addedTime)),
  oldest: (a, b) => stampOf(a.addedOn, a.addedTime).localeCompare(stampOf(b.addedOn, b.addedTime)),
  // leads with no follow-up sink to the bottom
  followup: (a, b) =>
    stampOf(a.followUp, a.followUpTime).localeCompare(stampOf(b.followUp, b.followUpTime)),
  priority: (a, b) => priorityMeta(a.priority).code - priorityMeta(b.priority).code,
}

const filtered = computed(() =>
  baseList.value
    .filter((l) => status.value === 'all' || l.status === status.value)
    .sort(SORTERS[sort.value]),
)

function resetAll() {
  Object.assign(filters, blankFilters())
  status.value = 'all'
  search.value = ''
}

function open(id) {
  router.push(`/lead-manager/leads/${id}`)
}

/* ---------------- presentation ---------------- */
const tone = (color) => ({ color, background: color + '18', borderColor: color + '33' })

/** Overdue open follow-ups in red, today's in amber. */
function followUpTone(l) {
  if (!OPEN_STATUSES.includes(l.status)) return null
  if (l.followUp < todayISO) return { color: 'var(--lm-danger)', fontWeight: 700 }
  if (l.followUp === todayISO) return { color: 'var(--lm-warning)', fontWeight: 700 }
  return null
}
</script>

<style scoped>
.lead-form {
  width: min(900px, calc(100vw - 32px));
}
.lead-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  max-height: 62vh;
  overflow: auto;
  padding-right: 4px;
}
@media (max-width: 680px) {
  .lead-form-grid {
    grid-template-columns: 1fr;
  }
}
.filters .lm-select {
  max-width: 220px;
}
.filters .lm-select.set {
  border-color: var(--lm-brand);
  color: var(--lm-brand);
  background: var(--lm-brand-ink);
}
.cell-2 {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 240px;
}

@media (max-width: 767px) {
  .filters .lm-select {
    flex: 1 1 calc(50% - 5px);
    max-width: none;
    width: auto;
  }
  .cell-2 {
    align-items: flex-end;
    max-width: 62%;
  }
}
</style>
