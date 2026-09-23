<template>
  <div>
    <!-- ============ NOT FOUND ============ -->
    <section v-if="!lead" class="lm-card lm-empty">
      <div class="e-icon">🕵️</div>
      <div class="e-title">Lead {{ route.params.id }} not found</div>
      <div>It may have been removed from the current list.</div>
      <router-link to="/lead-manager/leads" class="lm-btn sm" style="margin-top: 14px">
        Back to leads
      </router-link>
    </section>

    <template v-else>
      <!-- ============ PAGE HEAD ============ -->
      <div class="lm-page-head">
        <div style="min-width: 0">
          <div class="lm-crumbs">
            <router-link to="/lead-manager/leads">Leads</router-link> / {{ lead.id }}
          </div>
          <div class="lm-row lm-wrap">
            <span class="lm-avatar lg">{{ initials(lead.name) }}</span>
            <div style="min-width: 0">
              <h2 class="lm-page-title">{{ SALUTATIONS[lead.salutation] }} {{ lead.name }}</h2>
              <div class="lm-row lm-wrap" style="margin-top: 6px; gap: 6px">
                <span class="lm-badge" :style="tone(statusMeta(lead.status).color)">
                  <span
                    class="lm-dot"
                    :style="{ background: statusMeta(lead.status).color }"
                  ></span>
                  {{ statusMeta(lead.status).label }}
                </span>
                <span class="lm-badge" :style="tone(priorityMeta(lead.priority).color)">
                  {{ priorityMeta(lead.priority).label }}
                </span>
                <span class="lm-tiny">{{ lead.condition }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lm-toolbar">
          <button class="lm-btn sm" @click="logContact('call')">
            <i class="material-icons">call</i> Call
          </button>
          <button class="lm-btn sm" @click="logContact('whatsapp')">
            <i class="material-icons">chat</i> WhatsApp
          </button>
          <button class="lm-btn sm" :disabled="!lead.email" @click="logContact('email')">
            <i class="material-icons">mail</i> Email
          </button>
          <button class="lm-btn sm primary" @click="openModal('status')">Change status</button>
        </div>
      </div>

      <div class="lm-grid main-side">
        <!-- ============ MAIN COLUMN ============ -->
        <div class="lm-stack">
          <div class="lm-grid cols-2">
            <section v-for="s in sections" :key="s.title" class="lm-card">
              <div class="lm-card-head">
                <h3 class="lm-card-title">{{ s.title }}</h3>
              </div>
              <dl class="lm-dl">
                <div v-for="row in s.rows" :key="row[0]">
                  <dt>{{ row[0] }}</dt>
                  <dd :style="row[2] ? { color: row[2] } : null">{{ row[1] }}</dd>
                </div>
              </dl>
            </section>
          </div>

          <section class="lm-card">
            <div class="lm-card-head">
              <h3 class="lm-card-title">Remark</h3>
              <button class="lm-btn sm" @click="openModal('note')">
                <i class="material-icons">edit</i> Add remark
              </button>
            </div>
            <p class="lm-muted" style="margin: 0; line-height: 1.6">
              {{ lead.remark || 'No remark yet.' }}
            </p>
          </section>

          <section class="lm-card">
            <div class="lm-card-head">
              <h3 class="lm-card-title">Activity</h3>
              <span class="lm-tiny">{{ lead.timeline.length }} entries</span>
            </div>
            <div class="lm-tl">
              <div v-for="(t, i) in lead.timeline" :key="i" class="lm-tl-item">
                <span class="lm-tl-dot">{{ TIMELINE_ICON[t.type] || '•' }}</span>
                <div class="lm-between" style="align-items: baseline">
                  <span class="lm-strong">{{ t.by }}</span>
                  <span class="lm-tiny">{{ stamp(t.at, t.time) }}</span>
                </div>
                <div class="lm-muted" style="margin-top: 2px">{{ t.text }}</div>
              </div>
            </div>
          </section>
        </div>

        <!-- ============ SIDE COLUMN (first on phones) ============ -->
        <div class="lm-stack side">
          <section class="lm-card">
            <div class="lm-card-head">
              <h3 class="lm-card-title">Ownership</h3>
            </div>
            <div v-for="o in ownership" :key="o.label" class="lm-list-row">
              <span class="lm-grow">
                <span class="lm-tiny" style="display: block">{{ o.label }}</span>
                <span class="lm-strong" :style="o.style">{{ o.value }}</span>
              </span>
              <button class="lm-btn sm" @click="openModal(o.modal)">{{ o.action }}</button>
            </div>
          </section>

          <section class="lm-card">
            <div class="lm-card-head">
              <h3 class="lm-card-title">Engagement</h3>
            </div>
            <dl class="lm-dl">
              <div>
                <dt>Contact attempts</dt>
                <dd>{{ lead.attempts }}</dd>
              </div>
              <div>
                <dt>Expected value</dt>
                <dd>{{ lead.value ? rupee(lead.value) : '—' }}</dd>
              </div>
              <div>
                <dt>Last activity</dt>
                <dd>
                  {{ lead.timeline[0] ? stamp(lead.timeline[0].at, lead.timeline[0].time) : '—' }}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <!-- ================================================================
           MODALS
      ================================================================= -->
      <div v-if="modal" class="lm-scrim" @click.self="closeModal">
        <div class="lm-sheet" role="dialog" aria-modal="true" :aria-labelledby="'lm-dlg-' + modal">
          <div class="lm-sheet-head">
            <h3 :id="'lm-dlg-' + modal" class="lm-sheet-title">{{ MODAL_TITLES[modal] }}</h3>
            <button class="lm-icon-btn" aria-label="Close" @click="closeModal">
              <i class="material-icons">close</i>
            </button>
          </div>

          <!-- status -->
          <template v-if="modal === 'status'">
            <button
              v-for="k in FILTER_STATUSES"
              :key="k"
              class="lm-option"
              :class="{ on: draft.status === k }"
              @click="draft.status = k"
            >
              <span class="lm-dot" :style="{ background: statusMeta(k).color }"></span>
              <span class="lm-grow lm-strong">{{ statusMeta(k).label }}</span>
              <i v-if="draft.status === k" class="material-icons">check</i>
            </button>

            <template v-if="needsReason">
              <div class="lm-field" style="margin-top: 16px">
                <label class="lm-label" for="lost-cat">Lost Reason Category</label>
                <select
                  id="lost-cat"
                  v-model="draft.lostCategory"
                  class="lm-select"
                  @change="syncReason"
                >
                  <option v-for="(v, k) in LOST_CATEGORIES" :key="k" :value="k">
                    {{ v.label }}
                  </option>
                </select>
              </div>
              <div class="lm-field">
                <label class="lm-label" for="lost-reason">Lost Reason</label>
                <select id="lost-reason" v-model="draft.lostReason" class="lm-select">
                  <option v-for="r in LOST_REASONS[draft.lostCategory]" :key="r" :value="r">
                    {{ r }}
                  </option>
                </select>
              </div>
            </template>
          </template>

          <!-- priority -->
          <template v-else-if="modal === 'priority'">
            <button
              v-for="(v, k) in PRIORITIES"
              :key="k"
              class="lm-option"
              :class="{ on: draft.priority === k }"
              @click="draft.priority = k"
            >
              <span class="lm-dot" :style="{ background: v.color }"></span>
              <span class="lm-grow lm-strong">{{ v.label }}</span>
              <i v-if="draft.priority === k" class="material-icons">check</i>
            </button>
          </template>

          <!-- assign -->
          <template v-else-if="modal === 'assign'">
            <button
              v-for="s in STAFF"
              :key="s.id"
              class="lm-option"
              :class="{ on: draft.handledBy === s.id }"
              @click="draft.handledBy = s.id"
            >
              <span class="lm-avatar">{{ initials(s.name) }}</span>
              <span class="lm-grow">
                <span class="lm-strong" style="display: block">{{ s.name }}</span>
                <span class="lm-tiny lm-truncate" style="display: block">
                  {{ s.clinics.map(clinicShort).join(', ') }}
                </span>
              </span>
              <i v-if="draft.handledBy === s.id" class="material-icons">check</i>
            </button>
          </template>

          <!-- remark -->
          <div v-else-if="modal === 'note'" class="lm-field">
            <label class="lm-label" for="lead-remark">Remark</label>
            <textarea
              id="lead-remark"
              v-model="draft.note"
              class="lm-textarea"
              placeholder="What did the lead say? Anything the clinic should know…"
            ></textarea>
          </div>

          <!-- follow-up -->
          <template v-else-if="modal === 'followup'">
            <div class="lm-grid cols-2" style="gap: 12px">
              <div>
                <label class="lm-label" for="fu-date">Date</label>
                <input
                  id="fu-date"
                  v-model="draft.fuDate"
                  type="date"
                  :min="todayISO"
                  class="lm-input"
                />
              </div>
              <div>
                <label class="lm-label" for="fu-time">Time</label>
                <input id="fu-time" v-model="draft.fuTime" type="time" class="lm-input" />
              </div>
            </div>
          </template>

          <div class="lm-sheet-foot">
            <button
              v-if="modal === 'followup' && lead.followUp"
              class="lm-btn danger"
              style="margin-right: auto"
              @click="clearFollowUp"
            >
              Remove
            </button>
            <button class="lm-btn" @click="closeModal">Cancel</button>
            <button class="lm-btn primary" :disabled="!canSave" @click="save">Save</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Notify } from 'quasar'
import {
  FILTER_STATUSES,
  LOST_CATEGORIES,
  LOST_REASONS,
  MANAGER,
  PRIORITIES,
  SALUTATIONS,
  STAFF,
  TIMELINE_ICON,
  TREATMENTS,
  ampm,
  channelLabel,
  clinic,
  clinicShort,
  fmtDateLong,
  getLead,
  initials,
  leadTypeLabel,
  mediumLabel,
  priorityMeta,
  relDay,
  rupee,
  sourceMeta,
  staffName,
  stamp,
  statusMeta,
  todayISO,
} from './leadManagerDemoData'
import { useEscapeKey } from './useEscapeKey'

const route = useRoute()

/* Deep-reactive handle on the demo record — edits stay visible for the
   session, exactly as they will once the API exists. The route component
   is re-created per :id, so reading the param once is safe. */
const lead = ref(getLead(route.params.id))

/* ---------------- read-only sections (CRM leadtracker columns) ---------------- */
const dash = (v) => (v === null || v === undefined || v === '' ? '—' : v)

const sections = computed(() => {
  const l = lead.value
  const out = [
    {
      title: 'Contact',
      rows: [
        ['Phone Number', l.phone],
        ['Email', dash(l.email)],
        ['Age / Gender', `${l.age} · ${l.gender}`],
        ['Address', dash(l.address)],
        ['Locality', dash(l.locality)],
        ['Pin Code', dash(l.pinCode)],
      ],
    },
    {
      title: 'Lead details',
      rows: [
        ['Clinic Name', clinic(l.hospitalId).name],
        ['Lead Type', leadTypeLabel(l.leadType)],
        ['Treatment Preferred', dash(TREATMENTS[l.treatment])],
        ['Source', sourceMeta(l.source).label],
        ['Source Medium', l.sourceMedium ? mediumLabel(l.sourceMedium) : '—'],
        ['Ad Name', dash(l.adName)],
        ['Lead Channel', channelLabel(l.channel)],
        ['Referrer Name', dash(l.referrer)],
        ['Added On', `${fmtDateLong(l.addedOn)}, ${ampm(l.addedTime)}`],
        ['Added By', dash(l.addedBy)],
        ['Converted By', dash(l.convertedBy)],
      ],
    },
  ]
  if (l.lostCategory) {
    out.push({
      title: 'Lost reason',
      rows: [
        ['Lost Reason Category', LOST_CATEGORIES[l.lostCategory].label],
        ['Lost Reason Remark', l.lostReason, 'var(--lm-danger)'],
      ],
    })
  }
  return out
})

const ownership = computed(() => {
  const l = lead.value
  return [
    {
      label: 'Handled By',
      value: staffName(l.handledBy),
      action: l.handledBy ? 'Reassign' : 'Assign',
      modal: 'assign',
    },
    {
      label: 'Follow up Date',
      value: l.followUp ? `${relDay(l.followUp)}, ${ampm(l.followUpTime)}` : 'Not scheduled',
      action: 'Schedule',
      modal: 'followup',
    },
    {
      label: 'Priority',
      value: priorityMeta(l.priority).label,
      style: { color: priorityMeta(l.priority).color },
      action: 'Change',
      modal: 'priority',
    },
  ]
})

/* ---------------- one modal at a time, editing a draft ---------------- */
const MODAL_TITLES = {
  status: 'Change status',
  priority: 'Priority',
  assign: 'Handled By',
  note: 'Add remark',
  followup: 'Follow up Date',
}
const modal = ref(null)
const draft = reactive({})

function openModal(name) {
  const l = lead.value
  Object.assign(draft, {
    status: l.status,
    lostCategory: l.lostCategory || 'patient_issue',
    lostReason: l.lostReason || '',
    priority: l.priority,
    handledBy: l.handledBy,
    note: '',
    fuDate: l.followUp || todayISO,
    fuTime: l.followUpTime || '10:00',
  })
  syncReason()
  modal.value = name
}
function closeModal() {
  modal.value = null
}
useEscapeKey(closeModal)

/** Lost and Not Applicable need a category + reason, as the CRM demands. */
const needsReason = computed(() => ['lost', 'not_applicable'].includes(draft.status))

/** Keep the reason valid for the chosen category. */
function syncReason() {
  const reasons = LOST_REASONS[draft.lostCategory] || []
  if (!reasons.includes(draft.lostReason)) draft.lostReason = reasons[0]
}

const canSave = computed(() => {
  const l = lead.value
  switch (modal.value) {
    case 'status':
      return (
        draft.status !== l.status ||
        (needsReason.value &&
          (draft.lostCategory !== l.lostCategory || draft.lostReason !== l.lostReason))
      )
    case 'priority':
      return draft.priority !== l.priority
    case 'assign':
      return !!draft.handledBy && draft.handledBy !== l.handledBy
    case 'note':
      return !!draft.note.trim()
    case 'followup':
      return !!draft.fuDate && !!draft.fuTime && draft.fuDate >= todayISO
    default:
      return false
  }
})

function nowHM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
function log(type, text) {
  lead.value.timeline.unshift({ type, at: todayISO, time: nowHM(), by: MANAGER.name, text })
}
const toast = (message, type = 'positive') => Notify.create({ type, message })

const SAVERS = {
  status(l) {
    const label = statusMeta(draft.status).label
    if (needsReason.value) {
      l.lostCategory = draft.lostCategory
      l.lostReason = draft.lostReason
      l.followUp = null
      l.followUpTime = null
      log(
        'status',
        `Marked ${label} — ${LOST_CATEGORIES[draft.lostCategory].label} / ${draft.lostReason}`,
      )
    } else {
      l.lostCategory = null
      l.lostReason = null
      log('status', `Status changed to ${label}`)
    }
    l.status = draft.status
    toast(`Moved to ${label}`)
  },
  priority(l) {
    l.priority = draft.priority
    log('note', `Priority set to ${PRIORITIES[draft.priority].label}`)
    toast('Priority updated')
  },
  assign(l) {
    const reassigning = !!l.handledBy
    const name = staffName(draft.handledBy)
    l.handledBy = draft.handledBy
    if (['active', 'assigned'].includes(l.status))
      l.status = reassigning ? 're_assigned' : 'assigned'
    log('status', `${reassigning ? 'Re-Assigned' : 'Assigned'} to ${name}`)
    toast(`Handled by ${name}`)
  },
  note(l) {
    const text = draft.note.trim()
    l.remark = text
    log('note', text)
    toast('Remark saved')
  },
  followup(l) {
    l.followUp = draft.fuDate
    l.followUpTime = draft.fuTime
    log('note', `Follow-up set for ${relDay(draft.fuDate)}, ${ampm(draft.fuTime)}`)
    toast('Follow-up scheduled')
  },
}

function save() {
  if (!canSave.value) return
  SAVERS[modal.value](lead.value)
  closeModal()
}

function clearFollowUp() {
  lead.value.followUp = null
  lead.value.followUpTime = null
  log('note', 'Follow-up removed')
  closeModal()
}

/* ---------------- contact ---------------- */
const CONTACT_LOG = {
  call: 'Called the lead from the app',
  whatsapp: 'Opened WhatsApp for this lead',
  email: 'Opened an email draft for this lead',
}
function logContact(channel) {
  lead.value.attempts += 1
  log(channel, CONTACT_LOG[channel])
  toast('Logged on the activity trail — Exotel dialler wiring comes with the API.', 'info')
}

const tone = (color) => ({ color, background: color + '18', borderColor: color + '33' })
</script>

<style scoped>
/* Ownership + engagement lead on phones; they sit in the right rail on laptops. */
.side {
  order: -1;
}
@media (min-width: 1024px) {
  .side {
    order: 0;
    position: sticky;
    top: 88px;
    align-self: start;
  }
}
</style>
