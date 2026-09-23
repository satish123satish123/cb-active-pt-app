<template>
  <div>
    <div class="lm-page-head">
      <div>
        <h2 class="lm-page-title">Queries</h2>
        <p class="lm-page-sub">Exotel calls received and made through your exophones</p>
      </div>
      <label class="lm-row">
        <span class="lm-tiny">Showing</span>
        <select v-model="range" class="lm-select" aria-label="Time filter">
          <option v-for="r in RANGES" :key="r.id" :value="r.id">{{ r.label }}</option>
        </select>
      </label>
      <div class="lm-row">
        <button class="lm-btn" @click="panel = 'deleted'">Show Deleted Calls</button>
        <button class="lm-btn primary" @click="panel = 'call'">New Call</button>
      </div>
    </div>

    <div class="lm-stack">
      <section class="lm-card flush has-table">
        <div class="lm-card-head">
          <div class="lm-toolbar">
            <div class="lm-search">
              <i class="material-icons">search</i>
              <input
                v-model="search"
                type="search"
                class="lm-input"
                placeholder="Caller or number"
                aria-label="Search queries"
              />
            </div>
          </div>
          <!-- Query-status multi-select, defaulted exactly as sms/calls does -->
          <div class="lm-chips" role="group" aria-label="Query status">
            <button
              v-for="(meta, k) in QUERY_STATUS"
              :key="k"
              class="lm-chip"
              :class="{ on: queryStatuses.includes(k) }"
              :aria-pressed="queryStatuses.includes(k)"
              @click="toggleQueryStatus(k)"
            >
              <span class="lm-dot" :style="{ background: meta.color }"></span>
              {{ k }} <span class="count">{{ countByStatus(k) }}</span>
            </button>
          </div>
        </div>

        <!-- CRM columns: Caller · Query Status · Direction · Call Status ·
             Managed By · Source · Time · Clinic · Current Status -->
        <div class="lm-table-wrap">
          <table class="lm-table">
            <thead>
              <tr>
                <th>Caller</th>
                <th>Query Status</th>
                <th>Direction</th>
                <th>Call Status</th>
                <th>Managed By</th>
                <th>Source</th>
                <th>Time</th>
                <th>Clinic</th>
                <th>Current Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="q in filtered"
                :key="q.id"
                :class="{ 'is-link': q.leadId }"
                :tabindex="q.leadId ? 0 : undefined"
                :title="q.leadId ? 'Open lead' : 'Not linked to a lead yet'"
                @click="openLead(q)"
                @keydown.enter="openLead(q)"
              >
                <td class="lm-td-main" data-label="Caller">
                  <div class="lm-row">
                    <span class="lm-avatar dir" :style="tint(callStatusMeta(q.callStatus))">
                      <i class="material-icons">
                        {{ q.direction === 'inbound' ? 'call_received' : 'call_made' }}
                      </i>
                    </span>
                    <div style="min-width: 0">
                      <div class="lm-strong lm-truncate">{{ q.caller }}</div>
                      <div class="lm-tiny">{{ q.callFrom }} → {{ q.exophone }}</div>
                    </div>
                  </div>
                </td>
                <td data-label="Query Status">
                  <span class="lm-badge" :style="tone(QUERY_STATUS[q.queryStatus].color)">
                    {{ q.queryStatus }}
                  </span>
                </td>
                <td data-label="Direction">
                  {{ q.direction === 'inbound' ? 'Inbound' : 'Outbound' }}
                </td>
                <td data-label="Call Status">
                  <span class="lm-row" style="gap: 6px">
                    <span class="lm-badge" :style="tone(callStatusMeta(q.callStatus).color)">
                      {{ callStatusMeta(q.callStatus).label }}
                    </span>
                    <span v-if="q.durationSec" class="lm-tiny">{{
                      fmtDuration(q.durationSec)
                    }}</span>
                    <i v-if="q.recording" class="material-icons rec" title="Recording available">
                      headphones
                    </i>
                  </span>
                </td>
                <td data-label="Managed By">{{ q.managedBy }}</td>
                <td data-label="Source">{{ q.source }}</td>
                <td data-label="Time">
                  <span style="white-space: nowrap">{{ stamp(q.at, q.time) }}</span>
                </td>
                <td data-label="Clinic">{{ clinicShort(q.hospitalId) }}</td>
                <td data-label="Current Status">{{ q.currentStatus }}</td>
                <td data-label="Options">
                  <div class="lm-row" style="gap: 5px">
                    <button class="lm-btn sm" @click.stop="openQueryPanel('history', q)">
                      History
                    </button>
                    <button class="lm-btn sm" @click.stop="openQueryPanel('call', q)">Call</button>
                    <button class="lm-btn sm danger" @click.stop="openQueryPanel('delete', q)">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!filtered.length" class="lm-empty">
            <div class="e-icon">📞</div>
            <div class="e-title">No queries</div>
            <div>Nothing matches this time filter and query status.</div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="panel" class="lm-scrim" @click.self="panel = null">
      <div class="lm-sheet" role="dialog" aria-modal="true">
        <div class="lm-sheet-head">
          <h3 class="lm-sheet-title">{{ panelTitle }}</h3>
          <button class="lm-icon-btn" @click="panel = null">
            <i class="material-icons">close</i>
          </button>
        </div>
        <template v-if="panel === 'call'"
          ><label class="lm-label">Extension</label
          ><input class="lm-input" value="0000444455" /><label class="lm-label">Call To</label
          ><input class="lm-input" :value="selectedQuery?.callFrom || ''"
        /></template>
        <template v-else-if="panel === 'delete'"
          ><label class="lm-label">Remarks *</label
          ><textarea class="lm-input" rows="4" placeholder="Enter deletion remarks"></textarea>
        </template>
        <template v-else
          ><p class="lm-muted">
            {{
              selectedQuery
                ? `${selectedQuery.caller} · ${selectedQuery.callFrom}`
                : 'No deleted calls in demo data.'
            }}
          </p></template
        >
        <div class="lm-sheet-foot">
          <button class="lm-btn" @click="panel = null">Cancel</button
          ><button
            v-if="panel === 'call' || panel === 'delete'"
            class="lm-btn primary"
            @click="panel = null"
          >
            {{ panel === 'call' ? 'Call' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  QUERIES,
  QUERY_STATUS,
  QUERY_STATUS_DEFAULT,
  RANGES,
  callStatusMeta,
  clinicShort,
  fmtDuration,
  rangeBounds,
  stamp,
} from './leadManagerDemoData'

const router = useRouter()
const panel = ref(null)
const selectedQuery = ref(null)
const panelTitle = computed(
  () =>
    ({ deleted: 'Deleted Calls', call: 'Place a Call', history: 'History', delete: 'Delete Call' })[
      panel.value
    ] || '',
)
function openQueryPanel(type, query) {
  selectedQuery.value = query
  panel.value = type
}

const range = ref('2') // This Month
const search = ref('')
const queryStatuses = ref([...QUERY_STATUS_DEFAULT])

/** Time filter + search only — so the status chip counts stay meaningful. */
const scoped = computed(() => {
  const [start, end] = rangeBounds(range.value)
  const q = search.value.trim().toLowerCase()
  const digits = q.replace(/\D/g, '')
  return QUERIES.filter(
    (row) =>
      row.at >= start &&
      row.at <= end &&
      (!q ||
        row.caller.toLowerCase().includes(q) ||
        (digits.length > 0 && row.callFrom.replace(/\D/g, '').includes(digits))),
  ).sort((a, b) => (b.at + b.time).localeCompare(a.at + a.time))
})

const filtered = computed(() =>
  scoped.value.filter((q) => queryStatuses.value.includes(q.queryStatus)),
)
const countByStatus = (k) => scoped.value.filter((q) => q.queryStatus === k).length

function toggleQueryStatus(k) {
  const i = queryStatuses.value.indexOf(k)
  if (i === -1) queryStatuses.value.push(k)
  else queryStatuses.value.splice(i, 1)
}

function openLead(q) {
  if (q.leadId) router.push(`/lead-manager/leads/${q.leadId}`)
}

const tone = (color) => ({ color, background: color + '18', borderColor: color + '33' })
const tint = (meta) => ({ background: meta.tint, color: meta.color })
</script>

<style scoped>
.dir .material-icons {
  font-size: 18px;
}
.rec {
  font-size: 16px;
  color: var(--lm-text-3);
}
</style>
