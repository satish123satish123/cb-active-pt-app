<template>
  <div>
    <div class="lm-page-head">
      <div>
        <h2 class="lm-page-title">Patient Feedbacks</h2>
        <p class="lm-page-sub">Treatment Feedback</p>
      </div>
    </div>

    <div class="lm-stack">
      <!-- ============ TABLE ============ -->
      <section class="lm-card flush has-table">
        <div class="lm-card-head"><h3 class="lm-card-title">Treatment Feedback</h3></div>

        <!-- CRM columns: Patient · Phone · Clinic · Rating · Rating Text ·
             Suggestion · Date · Status · Publish · Action -->
        <div class="lm-table-wrap">
          <table class="lm-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Phone</th>
                <th>Clinic</th>
                <th>Rating</th>
                <th>Rating Text</th>
                <th>Suggestion</th>
                <th>Date</th>
                <th>Status</th>
                <th>Publish</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in filtered" :key="f.id">
                <td class="lm-td-main" data-label="Patient">
                  <div class="lm-row">
                    <span class="lm-avatar">{{ initials(f.patient) }}</span>
                    <div style="min-width: 0">
                      <div class="lm-strong lm-truncate">{{ f.patient }}</div>
                      <a class="phone" :href="'tel:' + f.phone.replace(/\s/g, '')">{{ f.phone }}</a>
                    </div>
                  </div>
                </td>
                <td data-label="Phone">{{ f.phone }}</td>
                <td data-label="Clinic">{{ clinicShort(f.hospitalId) }}</td>
                <td data-label="Rating">
                  <span class="lm-stars" :aria-label="`${f.rating} out of 5`">
                    <span v-for="n in 5" :key="n" :class="{ off: n > f.rating }">★</span>
                  </span>
                </td>
                <td data-label="Rating Text">{{ f.ratingText }}</td>
                <td data-label="Suggestion">
                  <span class="suggestion" :title="f.suggestion">{{ f.suggestion }}</span>
                </td>
                <td data-label="Date">
                  <span style="white-space: nowrap">{{ stamp(f.at, f.time) }}</span>
                </td>
                <td data-label="Status">
                  <span class="lm-badge" :style="tone(FEEDBACK_STATUS[f.status].color)">
                    {{ FEEDBACK_STATUS[f.status].label }}
                  </span>
                </td>
                <td data-label="Publish">
                  <button
                    class="lm-toggle"
                    :class="{ on: f.publish }"
                    role="switch"
                    :aria-checked="f.publish"
                    :aria-label="`Publish feedback from ${f.patient}`"
                    @click="togglePublish(f)"
                  >
                    <i></i>
                  </button>
                </td>
                <td data-label="Action">
                  <button
                    v-if="f.status === 'unresolved'"
                    class="lm-btn sm primary"
                    @click="openResolve(f)"
                  >
                    <i class="material-icons">check</i> Resolve
                  </button>
                  <span v-else-if="f.resolvedBy" class="resolved" :title="f.remarks">
                    <span class="lm-tiny" style="display: block">Resolved By</span>
                    {{ f.resolvedBy }}
                  </span>
                  <span v-else class="lm-tiny">—</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!filtered.length" class="lm-empty">
            <div class="e-icon">💬</div>
            <div class="e-title">Nothing here</div>
            <div>No feedback matches these filters.</div>
          </div>
        </div>
      </section>
    </div>

    <!-- ============ RESOLVE FEEDBACK ============ -->
    <div v-if="resolving" class="lm-scrim" @click.self="resolving = null">
      <div class="lm-sheet" role="dialog" aria-modal="true" aria-labelledby="fb-resolve-title">
        <div class="lm-sheet-head">
          <div>
            <h3 id="fb-resolve-title" class="lm-sheet-title">Resolve Feedback</h3>
            <div class="lm-tiny">
              {{ resolving.patient }} · {{ resolving.rating }}★ {{ resolving.ratingText }}
            </div>
          </div>
          <button class="lm-icon-btn" aria-label="Close" @click="resolving = null">
            <i class="material-icons">close</i>
          </button>
        </div>

        <blockquote class="quote">“{{ resolving.suggestion }}”</blockquote>

        <div class="lm-field">
          <label class="lm-label" for="fb-remarks">Remarks</label>
          <textarea
            id="fb-remarks"
            v-model="remarks"
            class="lm-textarea"
            placeholder="What did you do about this feedback?"
          ></textarea>
        </div>

        <div class="lm-sheet-foot">
          <button class="lm-btn" @click="resolving = null">Cancel</button>
          <button class="lm-btn primary" :disabled="!remarks.trim()" @click="confirmResolve">
            Mark resolved
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Notify } from 'quasar'
import {
  FEEDBACKS,
  FEEDBACK_STATUS,
  MANAGER,
  clinicShort,
  initials,
  stamp,
} from './leadManagerDemoData'
import { useEscapeKey } from './useEscapeKey'

/* Local reactive copy so the demo screen can resolve and publish. */
const rows = ref(FEEDBACKS.map((f) => ({ ...f })))

const search = ref('')
const statusFilter = ref('all')
const ratingFilter = ref('all')

const RATING_BANDS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'high', label: '4–5★', test: (r) => r >= 4 },
  { id: 'mid', label: '3★', test: (r) => r === 3 },
  { id: 'low', label: '1–2★', test: (r) => r <= 2 },
]

const filtered = computed(() => {
  const band = RATING_BANDS.find((b) => b.id === ratingFilter.value)
  const q = search.value.trim().toLowerCase()
  const digits = q.replace(/\D/g, '')
  return rows.value.filter(
    (f) =>
      (statusFilter.value === 'all' || f.status === statusFilter.value) &&
      band.test(f.rating) &&
      (!q ||
        f.patient.toLowerCase().includes(q) ||
        (digits.length > 0 && f.phone.replace(/\D/g, '').includes(digits))),
  )
})

function togglePublish(f) {
  f.publish = !f.publish
  Notify.create({
    type: 'positive',
    message: f.publish ? 'Published to the website' : 'Removed from the website',
  })
}

/* ---------------- resolve (home/resolve in the CRM) ---------------- */
const resolving = ref(null)
const remarks = ref('')
useEscapeKey(() => (resolving.value = null))

function openResolve(f) {
  resolving.value = f
  remarks.value = ''
}
function confirmResolve() {
  Object.assign(resolving.value, {
    status: 'resolved',
    resolvedBy: MANAGER.name,
    remarks: remarks.value.trim(),
  })
  resolving.value = null
  Notify.create({ type: 'positive', message: 'Feedback resolved' })
}

const tone = (color) => ({ color, background: color + '18', borderColor: color + '33' })
</script>

<style scoped>
.avg {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}
.dist {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
}
.dist .num {
  width: 16px;
  text-align: right;
}

.phone {
  font-size: 12px;
  color: var(--lm-text-3);
  text-decoration: none;
}
.phone:hover {
  color: var(--lm-brand);
  text-decoration: underline;
}

.suggestion {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 320px;
  color: var(--lm-text-2);
}
.resolved {
  font-size: 12.5px;
  font-weight: 600;
  cursor: help;
}

.quote {
  margin: 0 0 16px;
  padding: 12px 14px;
  border-left: 3px solid var(--lm-brand);
  background: var(--lm-subtle);
  border-radius: 0 10px 10px 0;
  color: var(--lm-text-2);
  line-height: 1.55;
}

@media (max-width: 767px) {
  .suggestion {
    max-width: 62%;
    text-align: right;
  }
}
</style>
