<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ HERO ============ -->
      <div class="hero">
        <div class="hero-row">
          <div>
            <p class="subtle">{{ dateLine }}</p>
            <h1 class="font-sora">Hi, {{ firstNameShort }} 👋</h1>
          </div>
          <div class="row" style="gap: 10px">
            <button class="icon-btn" title="Reset demo" @click="resetDemo">↻</button>
            <div class="avatar">{{ avatarInitials }}</div>
          </div>
        </div>

        <!-- Attendance (live: getPhysioRoster) -->
        <div style="margin-top: 14px">
          <!-- Loading -->
          <div v-if="rosterLoading" class="att-card" style="background: rgba(255, 255, 255, 0.12)">
            <div class="row" style="gap: 10px">
              <span style="font-size: 18px">⏳</span>
              <div style="font-weight: 800">Loading today's shift…</div>
            </div>
          </div>

          <!-- Off today (leave / week off / holiday) -->
          <div v-else-if="offToday" class="att-card" style="background: rgba(255, 255, 255, 0.12)">
            <div class="row" style="gap: 10px">
              <span style="font-size: 22px">🌴</span>
              <div>
                <div style="font-weight: 800">You're {{ offLabel }} today</div>
                <div class="subtle">{{ tomorrow.headline }} {{ tomorrow.sub }}</div>
              </div>
            </div>
          </div>

          <!-- Checked out -->
          <div v-else-if="checkedOutAt" class="att-card" style="background: rgba(255, 255, 255, 0.12)">
            <div class="row" style="gap: 10px">
              <span style="font-size: 22px">{{ tomorrow.emoji }}</span>
              <div>
                <div style="font-weight: 800">Checked out · {{ ampm(checkedOutAt) }}</div>
                <div class="subtle">{{ tomorrow.headline }} {{ tomorrow.sub }}</div>
              </div>
            </div>
          </div>

          <!-- On shift -->
          <div v-else-if="checkedInAt" class="att-card" style="border-color: rgba(124, 255, 178, 0.55)">
            <div class="between">
              <div class="row" style="gap: 10px">
                <span class="ph-dot" style="background: #7cffb2; box-shadow: 0 0 0 4px rgba(124, 255, 178, 0.25)"></span>
                <div>
                  <div style="font-weight: 800">On shift since {{ ampm(checkedInAt) }}</div>
                  <div class="subtle">{{ shiftStr ? 'Today ' + shiftStr : 'Roster not set for today' }}</div>
                </div>
              </div>
              <button
                class="btn small"
                style="background: #fff; color: var(--danger); font-weight: 800"
                :disabled="checkoutBusy"
                @click="showCheckoutConfirm = true"
              >
                {{ checkoutBusy ? 'Checking out…' : 'Check out' }}
              </button>
            </div>
          </div>

          <!-- Not checked in -->
          <div v-else class="att-card attn">
            <div class="between">
              <div class="row" style="gap: 10px">
                <span style="font-size: 18px">⏰</span>
                <div>
                  <div style="font-weight: 800; color: var(--text)">Check in to start your shift</div>
                  <div style="font-size: 12.5px; color: #9a7212">{{ shiftStr ? 'Today ' + shiftStr : '⚠ Roster not set for today ' }}</div>
                </div>
              </div>
              <button class="btn small primary pulse" :disabled="checkinBusy" @click="checkIn">
                {{ checkinBusy ? 'Checking in…' : 'Check in' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ STATS ============ -->
      <div class="stack section">
        <div class="row" style="gap: 10px">
          <div class="stat" :class="{ active: filter === 'waiting' }" @click="filter = 'waiting'">
            <div class="n" style="color: var(--warning)">{{ waitingCount }}</div>
            <div class="l">Waiting now</div>
          </div>
          <div class="stat" :class="{ active: filter === 'all' }" @click="filter = 'all'">
            <div class="n">{{ todays.length + pending.length + oldUnactioned.length }}</div>
            <div class="l">Patients today</div>
          </div>
          <div class="stat" :class="{ active: filter === 'seen' }" @click="filter = 'seen'">
            <div class="n" style="color: var(--success)">{{ seenCount }}</div>
            <div class="l">Seen</div>
          </div>
        </div>
      </div>

      <!-- ============ PENDING CONFIRMATIONS ============ -->
      <div v-if="pending.length && filter === 'all'" class="section">
        <div class="section-title">
          <h3 class="font-sora">Needs your confirmation</h3>
          <span class="badge pending">{{ pending.length }}</span>
        </div>

        <div v-for="a in pending" :key="a.id" class="card" style="border-color: #ddd2ff">
          <div class="between">
            <div class="row" style="gap: 12px">
              <div class="q-avatar-ph" style="background: #efeaff; color: #6d4bff">
                {{ initials(a.patient.name) }}
              </div>
              <div>
                <div style="font-weight: 800">
                  {{ a.patient.nameLine }}
                  <span class="tiny">· {{ a.patient.age }} {{ a.patient.sex }}</span>
                </div>
                <div v-if="a.patient.line2" class="muted" style="font-size: 12.5px">{{ a.patient.line2 }}</div>
                <div class="tiny" style="color: #6d4bff; font-weight: 700; margin-top: 2px">
                  {{ whenLabel(a) }} · {{ a.source || 'Booking' }}
                </div>
              </div>
            </div>
          </div>
          <div class="row" style="gap: 10px; margin-top: 12px">
            <button class="btn ghost small" style="flex: none; width: 38%" @click="openCancel(a)">Decline</button>
            <button class="btn primary small grow" @click="openConfirm(a)">Confirm appointment</button>
          </div>
        </div>
      </div>

      <!-- ============ TODAY'S QUEUE ============ -->
      <!-- ============ OLDER UNACTIONED ============ -->
      <div v-if="oldUnactioned.length && filter === 'all'" class="section">
        <div class="section-title">
          <h3 class="font-sora">Older — needs action</h3>
          <span class="count-pill">{{ oldUnactioned.length }}</span>
        </div>
        <div v-for="a in oldUnactioned" :key="'old-' + a.id" class="card" style="margin-bottom: 12px">
          <div class="row" style="gap: 12px">
            <div class="ph-qavatar">{{ initials(a.patient.name) }}</div>
            <div class="grow">
              <div style="font-weight: 800">
                {{ a.patient.nameLine }}
                <span class="tiny">· {{ a.patient.age }} {{ a.patient.sex }}</span>
              </div>
              <div v-if="a.patient.line2" class="muted" style="font-size: 12.5px">{{ a.patient.line2 }}</div>
              <div class="tiny" style="margin-top: 2px; color: var(--warning)">{{ whenLabel(a) }}</div>
            </div>
          </div>
          <div class="row" style="margin-top: 12px">
            <button class="btn ghost small grow" @click="openCancel(a)">Cancel appointment</button>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          <h3 class="font-sora">{{ queueTitle }}</h3>
          <span v-if="filter !== 'all'" class="link" @click="filter = 'all'">Show all</span>
          <span v-else class="muted" style="font-size: 12px">{{ clinicShort }}</span>
        </div>

        <template v-if="shown.length">
          <div v-for="a in activeList" :key="a.id" class="card q-card-ph" @click="openPatient(a)">
            <div class="q-avatar-ph">{{ initials(a.patient.name) }}</div>
            <div class="grow">
              <div class="between">
                <div class="ph-time">{{ a.timeLabel }}</div>
                <span class="badge" :class="statusOf(a).cls">
                  <span class="ph-dot" :style="{ background: statusOf(a).color }"></span>{{ statusOf(a).label }}
                </span>
              </div>
              <div style="font-weight: 800; margin-top: 2px">
                {{ a.patient.nameLine }}
                <span class="tiny">· {{ a.patient.age }} {{ a.patient.sex }}</span>
              </div>
              <div v-if="a.patient.line2" class="muted" style="font-size: 12.5px">{{ a.patient.line2 }}</div>
              <div class="chips">
                <span class="chip">{{ a.patient.billingChip }}</span>
                <span
                  v-if="a.patient.painChip"
                  class="chip"
                  style="background: #fff4dd; color: var(--warning); border-color: #ffe6b0"
                >
                  {{ a.patient.painChip }}
                </span>
              </div>
              <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap">
                <button
                  v-if="a.status === 'checked_in'"
                  class="btn primary small"
                  :disabled="actionBusyId === a.id"
                  @click.stop="start(a)"
                >
                  {{ actionBusyId === a.id ? 'Starting…' : 'Start treatment →' }}
                </button>
                <button v-else-if="a.status === 'in_treatment'" class="btn primary small" @click.stop="start(a)">
                  Session done →
                </button>
                <button v-else-if="a.status === 'done'" class="btn secondary small" @click.stop="invoice(a)">
                  Generate invoice →
                </button>
                <span v-else-if="a.status === 'invoiced'" class="badge warn">Awaiting payment at counter</span>
                <button
                  v-else-if="a.status === 'booked'"
                  class="btn secondary small"
                  :disabled="actionBusyId === a.id"
                  @click.stop="doPatientCheckIn(a)"
                >
                  {{ actionBusyId === a.id ? 'Checking in…' : 'Check in patient →' }}
                </button>
                <button
                  v-if="['invoiced', 'paid'].includes(a.status) && !a.followUp && a.canFollowUp"
                  class="btn secondary small"
                  @click.stop="bookFollowUp(a)"
                >
                  Book follow-up →
                </button>
              </div>
            </div>
          </div>

          <template v-if="completedList.length">
            <div class="tiny" style="margin: 16px 4px 8px; color: var(--text-3); font-weight: 800; letter-spacing: 0.05em">
              COMPLETED
            </div>
            <div v-for="a in completedList" :key="a.id" class="card q-card-ph" @click="openPatient(a)">
              <div class="q-avatar-ph">{{ initials(a.patient.name) }}</div>
              <div class="grow">
                <div class="between">
                  <div class="ph-time">{{ a.timeLabel }}</div>
                  <span class="badge success"><span class="ph-dot" style="background: #1f8a4d"></span>Paid</span>
                </div>
                <div style="font-weight: 800; margin-top: 2px">
                  {{ a.patient.nameLine }}
                  <span class="tiny">· {{ a.patient.age }} {{ a.patient.sex }}</span>
                </div>
                <div v-if="a.patient.line2" class="muted" style="font-size: 12.5px">{{ a.patient.line2 }}</div>
                <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap">
                  <span class="badge success">✓ Complete</span>
                  <button v-if="!a.followUp && a.canFollowUp" class="btn secondary small" @click.stop="bookFollowUp(a)">
                    Book follow-up →
                  </button>
                </div>
              </div>
            </div>
          </template>
        </template>

        <div v-else-if="apptsLoading" class="card" style="text-align: center; color: var(--text-3)">
          Loading today's appointments…
        </div>
        <div v-else class="card" style="text-align: center; color: var(--text-3)">
          No {{ filter === 'all' ? 'confirmed patients for today yet' : filter + ' patients' }}.
        </div>
      </div>
    </div>

    <!-- ============ BILLING SHEET (real appointments) ============ -->
    <PhysioBillingSheet
      v-if="billAppt"
      :appointment-id="Number(billAppt.id)"
      :patient-id="Number(billAppt.patient.id)"
      :patient-name="billAppt.patient.nameLine"
      @close="billClosed(false)"
      @done="(outcome) => billClosed(true, outcome)"
    />

    <!-- ============ FOLLOW-UP BOOKING (full screen, prototype style) ============ -->
    <div v-if="fuAppt" class="fu-screen">
      <div class="fu-inner">
        <div class="fu-topbar">
          <button class="fu-back" @click="closeFollowUp">←</button>
          <div class="grow">
            <h2 class="font-sora">Book follow-up</h2>
            <div class="muted" style="font-size: 12.5px">{{ fuAppt.patient.nameLine }}</div>
          </div>
        </div>

        <PhysioStepper :step="3" />

        <div v-if="['invoiced', 'paid'].includes(fuAppt.status)" class="section" style="margin-top: 8px">
          <div class="card" style="background: var(--grad-soft); border-color: #cfeee6">
            <div class="row" style="gap: 10px">
              <span style="font-size: 22px">✅</span>
              <div>
                <strong>Invoice generated</strong>
                <div class="muted">Sent to counter as payment-pending.</div>
              </div>
            </div>
          </div>
        </div>

        <div class="section" style="margin-top: 12px; padding-bottom: 130px">
          <div class="card">
            <div v-if="fuLoading" class="tiny" style="padding: 8px 2px">Loading details…</div>

            <template v-else-if="fuDetails && Number(fuDetails.is_followup_created)">
              <strong style="color: var(--success)">✓ Follow-up already booked for this appointment.</strong>
            </template>

            <template v-else>
              <p class="fu-label">When should they come back?</p>
              <p v-if="fuDetails?.suggested_session_frequency" class="tiny" style="margin: 0 2px 2px">
                Plan: <strong>{{ fuDetails.suggested_session_frequency }}</strong>
                <template v-if="fuSuggestedGap"> — suggested next visit pre-selected</template>
              </p>
              <div class="fu-chips" style="margin-top: 2px">
                <button
                  v-for="q in FU_QUICK"
                  :key="q.label"
                  class="fu-chip"
                  :class="{ active: fuDate === dateAfterDays(q.days) }"
                  @click="fuQuickPick(q.days)"
                >
                  <template v-if="fuSuggestedGap === q.days">✦ </template>{{ q.label }}
                </button>
              </div>

              <!-- only worth showing when the hospital actually has someone else -->
              <template v-if="fuPhysiosLoading || fuPhysios.length > 1">
                <p class="fu-label" style="margin-top: 16px">Physio</p>
                <div v-if="fuPhysiosLoading" class="tiny" style="padding: 6px 2px">Loading physios…</div>
                <select v-else v-model="fuPhysioSel" class="input">
                  <option v-for="p in fuPhysios" :key="p.id" :value="Number(p.id)">
                    {{ p.name }}{{ p.is_self ? ' (You)' : '' }}
                  </option>
                </select>
                <p v-if="fuOtherPhysio" class="tiny" style="margin-top: 6px; color: var(--brand)">
                  Slots below are {{ fuPhysioName }}'s.
                </p>
              </template>

              <p class="fu-label" style="margin-top: 16px">Date</p>
              <input v-model="fuDate" class="input" type="date" />

              <template v-if="!fuSlotsFailed">
                <p class="fu-label" style="margin-top: 14px">Available slots</p>
                <div v-if="fuSlotsLoading" class="tiny" style="padding: 6px 2px">Loading available slots…</div>
                <TimeSlotPicker v-else v-model="fuSlotSel" :options="fuSlotOptions" :booked="fuBookedSlots" />
                <div
                  v-if="!fuSlotsLoading && !fuSlotOptions.length"
                  class="tiny"
                  style="padding: 6px 2px; color: var(--danger)"
                >
                  No free slots on this day.
                </div>
              </template>
              <template v-else>
                <p class="fu-label" style="margin-top: 14px">Time</p>
                <input v-model="fuTime" class="input" type="time" />
                <p class="tiny" style="margin-top: 8px">Time defaults to today's appointment slot — change it if needed.</p>
              </template>

              <p class="fu-label" style="margin-top: 16px">Duration (minutes)</p>
              <div class="fu-chips" style="margin-top: 2px">
                <button
                  v-for="d in [15, 30, 45, 60, 75, 90]"
                  :key="d"
                  class="fu-chip"
                  :class="{ active: fuDuration === d }"
                  @click="fuDuration = d"
                >
                  {{ d }}
                </button>
              </div>

              <p class="fu-label" style="margin-top: 16px">Modalities</p>
              <div v-if="fuMods.length" class="fu-chips" style="margin-top: 2px; margin-bottom: 8px">
                <span v-for="m in fuMods" :key="m" class="fu-chip">
                  {{ m }}
                  <span style="margin-left: 6px; cursor: pointer; font-weight: 900" @click="fuRemoveModality(m)">×</span>
                </span>
              </div>
              <p v-else class="tiny" style="margin: 0 2px 8px; color: var(--danger)">Assessment modalities not present.</p>
              <div class="row" style="gap: 8px">
                <input
                  v-model="fuModAdd"
                  class="input grow"
                  list="fu-mod-list"
                  placeholder="Add a modality…"
                  @keyup.enter="fuAddModality"
                />
                <button class="btn secondary" style="flex: none; min-height: 46px" @click="fuAddModality">Add</button>
              </div>
              <datalist id="fu-mod-list">
                <option v-for="c in fuCatalogue" :key="c.id" :value="c.name"></option>
              </datalist>

              <p class="fu-label" style="margin-top: 16px">Remarks (optional)</p>
              <input v-model="fuRemarks" class="input" placeholder="Any note for the next session" />
            </template>
          </div>
        </div>

        <div class="fu-foot">
          <button class="btn ghost" style="flex: none; width: 38%" @click="closeFollowUp">
            {{ fuDetails && Number(fuDetails.is_followup_created) ? 'Close' : 'Skip' }}
          </button>
          <button
            v-if="!(fuDetails && Number(fuDetails.is_followup_created))"
            class="btn primary grow"
            :disabled="fuBusy || fuLoading"
            @click="submitFollowUp"
          >
            {{ fuBusy ? 'Booking…' : 'Book follow-up' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============ CANCEL WITH REASON ============ -->
    <div v-if="cancelAppt" class="scrim scrim-center" @click="cancelAppt = null">
      <div class="sheet dialog" @click.stop>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">Cancel appointment</h2>
        <p class="muted" style="margin: 0 0 12px">{{ cancelAppt.patient.nameLine }} · {{ whenLabel(cancelAppt) }}</p>
        <p class="field-label">Reason</p>
        <input v-model="cancelReason" class="input" placeholder="Why is this being cancelled?" />
        <div class="row" style="gap: 10px; margin-top: 16px">
          <button class="btn ghost" style="flex: none; width: 38%" @click="cancelAppt = null">Back</button>
          <button
            class="btn danger grow"
            :disabled="cancelBusy || !cancelReason.trim()"
            @click="doCancel"
          >
            {{ cancelBusy ? 'Cancelling…' : 'Cancel appointment' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============ CHECK-OUT CONFIRMATION ============ -->
    <div v-if="showCheckoutConfirm" class="scrim scrim-center" @click="showCheckoutConfirm = false">
      <div class="sheet dialog" @click.stop>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">End your shift?</h2>
        <p class="muted" style="margin: 0 0 16px">
          You'll be checked out for the day. Make sure all your patients are done.
        </p>
        <div class="row" style="gap: 10px">
          <button class="btn ghost" style="flex: none; width: 38%" @click="showCheckoutConfirm = false">
            Cancel
          </button>
          <button
            class="btn danger grow"
            :disabled="checkoutBusy"
            @click="confirmCheckOut"
          >
            {{ checkoutBusy ? 'Checking out…' : 'Yes, check out' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============ CONFIRM APPOINTMENT SHEET ============ -->
    <div v-if="confirmAppt" class="scrim" @click="closeConfirm">
      <div class="sheet" @click.stop>
        <div class="grabber"></div>
        <h2 class="font-sora" style="margin: 0 0 4px; font-size: 19px">Confirm appointment</h2>
        <p class="muted" style="margin: 0 0 14px">
          {{ confirmAppt.patient.nameLine }}<template v-if="confirmAppt.patient.line2"> · {{ confirmAppt.patient.line2 }}</template>
        </p>
        <div class="card" style="margin-bottom: 4px">
          <div class="between">
            <span class="muted">Date</span>
            <strong>{{ slotDate || (confirmAppt.date === todayISO ? 'Today' : whenLabel(confirmAppt).split(' · ')[0]) }}</strong>
          </div>
        </div>
        <p class="tiny" style="margin: 0 2px 14px">
          Confirming keeps the requested date — moving to another day is a reschedule (front desk / CRM).
        </p>

        <!-- LIVE: real slot picker (dropdown, CRM-style) -->
        <template v-if="!confirmAppt._demo && !slotsFailed">
          <p class="field-label">Available slots</p>
          <div v-if="slotsLoading" class="tiny" style="padding: 8px 2px">Loading available slots…</div>
          <template v-else>
            <TimeSlotPicker v-model="slotSel" :options="slotOptions" :booked="bookedSlots" />
            <div v-if="!slotOptions.length" class="tiny" style="padding: 6px 2px; color: var(--danger)">
              No free slots on this day.
            </div>
          </template>
        </template>

        <!-- DEMO / fallback: manual time -->
        <template v-else>
          <p class="field-label">Appointment time</p>
          <input v-model="confirmTime" class="input" type="time" />
          <p class="tiny" style="margin-top: 8px">
            Pre-filled with the requested slot — adjust to the time you'll actually see them.
          </p>
        </template>
        <p class="field-label" style="margin-top: 14px">Duration (minutes)</p>
        <div class="dur-row">
          <button
            v-for="d in durOptions"
            :key="d"
            class="chip dur"
            :class="{ 'chip-active': confirmDuration === d }"
            @click="confirmDuration = d"
          >
            {{ d }}
          </button>
        </div>
        <p class="field-label" style="margin-top: 14px">Remarks (optional)</p>
        <input v-model="confirmRemarks" class="input" placeholder="Any note for the front desk" />
        <button
          class="btn primary full"
          style="margin-top: 16px"
          :disabled="confirmBusy || (!confirmAppt._demo && !slotsFailed && !slotsLoading && !slotSel)"
          @click="doConfirm"
        >
          {{ confirmBusy ? 'Confirming…' : 'Confirm appointment' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/stores/authStore'
import { PHYSIO, PATIENTS, APPTS, STATUS, todayISO, initials } from './physioDemoData'
import PhysioBillingSheet from './PhysioBillingSheet.vue'
import PhysioStepper from './PhysioStepper.vue'
import TimeSlotPicker from './TimeSlotPicker.vue'
import {
  getPhysioRoster, getPhysioTodayAppointments, physioCheckin, physioCheckout,
  confirmAppointment, cancelAppointment, checkInPatient, startAppointment,
  getPhysioAppointmentSlots, getFollowupDetails, addFollowupByPhysio, getPhysioDefaultModalities,
  getHospitalPhysios,
  resolveDoctorId, resolveHospitalId, liveSessions,
  setApptBillingState, clearApptBillingState, getApptBillingOutcome,
} from './physioApi'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

/* ---------------- clock ---------------- */
const TODAY = new Date()
const dateLine = `${TODAY.toLocaleDateString('en-IN', { weekday: 'long' })}, ${TODAY.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`

function ampm(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`
}
function ampm12p(t24) {
  // "14:30" -> "02:30 PM" (zero-padded hour, API format)
  if (!t24) return ''
  const [h, m] = t24.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  const hh = ((h + 11) % 12) + 1
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ap}`
}
function to24(t12) {
  // "04:45 PM" -> "16:45"
  if (!t12) return '00:00'
  const m = String(t12).trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!m) return t12 // already 24h
  let h = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'PM') h += 12
  return `${String(h).padStart(2, '0')}:${m[2]}`
}
function nowHM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/* ---------------- physio identity (name upgraded from roster API) ---------------- */
const doctorName = ref(authStore.user?.username || PHYSIO.name)
const clinicShort = ref('')
const firstNameShort = computed(() => {
  const clean = String(doctorName.value).replace(/^Dr\.?\s*/i, '')
  return clean.split(/[\s-]+/)[0] || clean
})
const avatarInitials = computed(() => initials(String(doctorName.value).replace(/^Dr\.?\s*/i, '')) || 'PT')

/* ---------------- attendance — LIVE via getPhysioRoster API ---------------- */
const rosterLoading = ref(true)
const todayRoster = ref(null) // { status, scheduled_start, scheduled_end, checkin, checkout }
const tomorrowRoster = ref(null)

const checkedInAt = computed(() => todayRoster.value?.checkin || null)
const checkedOutAt = computed(() => todayRoster.value?.checkout || null)
const OFF_STATUSES = ['leave', 'weekoff', 'week_off', 'holiday']
const offToday = computed(() => !!todayRoster.value && OFF_STATUSES.includes(todayRoster.value.status))

const OFF_LABEL = { leave: 'on leave', weekoff: 'on week off', week_off: 'on week off', holiday: 'on holiday' }
const offLabel = computed(() => OFF_LABEL[todayRoster.value?.status] || todayRoster.value?.status || '')

const shiftStr = computed(() => {
  const r = todayRoster.value
  if (r?.scheduled_start && r?.scheduled_end) return `${ampm(r.scheduled_start)} – ${ampm(r.scheduled_end)}`
  return null
})

const tomorrow = computed(() => {
  const t = tomorrowRoster.value
  if (!t) return { emoji: '💪', headline: 'See you tomorrow!', sub: '' }
  if (t.status === 'working')
    return {
      emoji: '💪',
      headline: 'See you tomorrow!',
      sub: t.scheduled_start ? `${ampm(t.scheduled_start)} – ${ampm(t.scheduled_end)}` : '',
    }
  if (OFF_LABEL[t.status])
    return { emoji: '🌴', headline: `Tomorrow you're ${OFF_LABEL[t.status]}.`, sub: 'Rest well!' }
  return { emoji: '💪', headline: 'See you tomorrow!', sub: '' }
})

async function loadRoster() {
  rosterLoading.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await getPhysioRoster(doctorId)
    if (data?.status === 'success') {
      if (Array.isArray(data.roster)) {
        // New shape: roster: [ { date, status, scheduled_start, ... }, ... ]
        const tomorrowD = new Date(TODAY)
        tomorrowD.setDate(tomorrowD.getDate() + 1)
        const tomorrowISO = `${tomorrowD.getFullYear()}-${String(tomorrowD.getMonth() + 1).padStart(2, '0')}-${String(tomorrowD.getDate()).padStart(2, '0')}`
        todayRoster.value = data.roster.find((r) => r.date === todayISO) || data.roster[0] || null
        tomorrowRoster.value = data.roster.find((r) => r.date === tomorrowISO) || null
      } else {
        // Original shape: today_roster / tomorrow_roster objects
        todayRoster.value = data.today_roster || null
        tomorrowRoster.value = data.tomorrow_roster || null
      }
      if (data.doctor_name) doctorName.value = data.doctor_name
    }
  } catch (e) {
    console.log('getPhysioRoster failed:', e)
  } finally {
    rosterLoading.value = false
  }
}
loadRoster()

/* check-in — LIVE via physioCheckin API */
const checkinBusy = ref(false)
async function checkIn() {
  const st = todayRoster.value?.status
  if (st && st !== 'working') {
    Notify.create({ type: 'warning', message: 'Your roster is not set for today — contact the clinic admin.' })
    return
  }
  if (checkinBusy.value) return
  checkinBusy.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await physioCheckin(doctorId)
    if (data?.status === 'success') {
      const t = data.checkin || nowHM()
      if (todayRoster.value) todayRoster.value.checkin = t
      else todayRoster.value = { status: 'working', checkin: t, checkout: '' }
      Notify.create({ type: 'positive', message: data.message || 'Checked in successfully.' })
    } else {
      Notify.create({ type: 'negative', message: data?.message || 'Check-in failed' })
    }
  } catch (e) {
    console.log('physioCheckin failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Check-in failed — try again' })
  } finally {
    checkinBusy.value = false
  }
}
/* check-out — LIVE via physioCheckout API (with confirmation popup) */
const checkoutBusy = ref(false)
const showCheckoutConfirm = ref(false)
async function confirmCheckOut() {
  showCheckoutConfirm.value = false
  await checkOut()
}
async function checkOut() {
  if (checkoutBusy.value) return
  checkoutBusy.value = true
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await physioCheckout(doctorId)
    if (data?.status === 'success') {
      if (todayRoster.value) todayRoster.value.checkout = data.checkout || nowHM()
      Notify.create({ type: 'positive', message: data.message || 'Checked out successfully.' })
    } else {
      Notify.create({ type: 'negative', message: data?.message || 'Check-out failed' })
    }
  } catch (e) {
    console.log('physioCheckout failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Check-out failed — try again' })
  } finally {
    checkoutBusy.value = false
  }
}

/* =====================================================================
   APPOINTMENTS — LIVE via getPhysioTodayAppointments API
   Normalised shape used by the template (same for API + demo fallback):
   { id, patient:{name,age,sex,line2,billingChip,painChip}, timeLabel,
     time24, date, status, source, followUp }
===================================================================== */
const apptsLoading = ref(true)
const usingDemo = ref(false)
const queue = ref([])

const API_STATUS_MAP = {
  'Pending Confirmation': 'pending',
  Confirmed: 'booked',
  Treated: 'done',
  Cancelled: 'declined',
}
const titleCase = (str) =>
  String(str || '')
    .toLowerCase()
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase())

function normalizeApi(a, groupStatus) {
  let status = API_STATUS_MAP[a.status] || groupStatus || 'booked'
  if (status === 'done') {
    if (a.payment_status === 'paid') status = 'paid'
    else if (a.payment_status === 'unpaid' || a.payment_status === 'pending') status = 'invoiced'
    else if (a.payment_status === 'uninvoiced') status = 'done'
  }
  // Live-session derivation from the list API's new fields:
  // ready set → patient arrived; actual_session_start set → session running; _end set → done
  if (status === 'booked') {
    if (a.actual_session_end) {
      if (a.payment_status === 'paid') status = 'paid'
      else if (a.payment_status === 'unpaid' || a.payment_status === 'pending') status = 'invoiced'
      else status = 'done'
    } else if (a.actual_session_start) {
      status = 'in_treatment'
    } else if (a.ready) {
      status = 'checked_in'
    }
  }
  // Just-billed appointments — local bridge for what the list API can't tell us yet.
  // The API now reports invoice state itself (paid / unpaid / uninvoiced), so whenever
  // it sends one, IT wins and the local flag is dropped: a stale 'invoiced' must never
  // hide the "Generate invoice" button on an appointment the server calls uninvoiced.
  const billed = getApptBillingOutcome(a.id)
  if (billed) {
    if (a.payment_status || status === 'paid') clearApptBillingState(a.id)
    else if (['done', 'invoiced'].includes(status)) status = billed === 'paid' ? 'paid' : 'invoiced'
  }
  const billingChip =
    a.package_total_sessions
      ? `${a.package_quantity ?? 0}/${a.package_total_sessions} sessions`
      : a.patient_status === 'InPackage'
        ? 'Package'
        : 'Per-visit'
  return {
    id: a.id,
    date: a.date,
    time24: to24(a.s_time),
    timeLabel: a.s_time || '',
    status,
    source: 'New booking',
    followUp: a.is_followup_created ? { created: true } : null,
    canFollowUp: Number(a.is_active_patient) !== 0,
    patient: {
      id: a.patient_id,
      salutation: a.salutation || '',
      name: titleCase(a.patient_name),
      nameLine: [a.salutation, titleCase(a.patient_name)].filter(Boolean).join(' '),
      age: a.patient_age,
      sex: (a.patient_sex || '').charAt(0).toUpperCase(),
      line2: a.current_condition || '',
      billingChip,
      painChip: null,
    },
  }
}

function normalizeDemo(a) {
  const p = PATIENTS[a.pid]
  return {
    id: a.id,
    date: a.date,
    time24: a.time,
    timeLabel: ampm(a.time),
    status: a.status,
    source: a.source || 'Booking',
    followUp: a.followUp,
    canFollowUp: a.canFollowUp !== false,
    pid: a.pid,
    patient: {
      salutation: '',
      name: p.name,
      nameLine: p.name,
      age: p.age,
      sex: p.sex,
      line2: p.condition,
      billingChip: p.package ? `${p.package.used}/${p.package.total} sessions` : 'Per-visit',
      painChip: p.feedback ? `Pain ${p.feedback.pain}/10 from app` : null,
    },
    _demo: true,
  }
}

async function loadAppointments() {
  apptsLoading.value = true
  usingDemo.value = false
  try {
    const doctorId = resolveDoctorId(authStore.user)
    if (!doctorId) throw new Error('doctor_id not found in login user data')
    const data = await getPhysioTodayAppointments(doctorId)
    if (data?.status !== 'success') throw new Error('bad response')
    const g = data.appointments || {}
    queue.value = [
      ...(g.pending_confirmation || []).map((a) => normalizeApi(a, 'pending')),
      ...(g.confirmed || []).map((a) => normalizeApi(a, 'booked')),
      ...(g.treated || []).map((a) => normalizeApi(a, 'done')),
      ...(g.other || []).map((a) => normalizeApi(a, 'booked')),
    ]
    oldUnactioned.value = (g.old_unactioned_appointments || []).map((a) =>
      normalizeApi(a, a.actual_session_start ? 'done' : 'pending'),
    )
    if (data.doctor_name) doctorName.value = data.doctor_name
  } catch (e) {
    console.log('getPhysioTodayAppointments failed — falling back to demo data:', e)
    usingDemo.value = true
    queue.value = APPTS.filter((a) => a.status !== 'declined').map(normalizeDemo)
  } finally {
    apptsLoading.value = false
  }
}
loadAppointments().then(() => {
  // Arriving from billing with ?followup=<apptId>: open the follow-up step
  const fid = route.query.followup
  if (fid) {
    router.replace({ query: {} })
    const a = live.value.find((x) => String(x.id) === String(fid))
    if (a && !a.followUp && a.canFollowUp !== false) bookFollowUp(a)
  }
})

const statusOf = (a) => STATUS[a.status] || STATUS.booked

/* ---------------- derived lists ---------------- */
const filter = ref('waiting')
const live = computed(() => queue.value.filter((a) => a.status !== 'declined'))
const oldUnactioned = ref([])
const pending = computed(() =>
  live.value
    .filter((a) => a.status === 'pending' && a.date === todayISO)
    .sort((x, y) => x.time24.localeCompare(y.time24)),
)
const todays = computed(() => live.value.filter((a) => a.date === todayISO && a.status !== 'pending'))
const waitingCount = computed(() => todays.value.filter((a) => a.status === 'checked_in').length)
const seenCount = computed(() => todays.value.filter((a) => ['done', 'invoiced', 'paid'].includes(a.status)).length)

const shown = computed(() => {
  let s = todays.value.slice()
  if (filter.value === 'waiting') s = s.filter((a) => a.status === 'checked_in')
  else if (filter.value === 'seen') s = s.filter((a) => ['done', 'invoiced', 'paid'].includes(a.status))
  s.sort((a, b) => {
    const ca = a.status === 'paid' ? 1 : 0
    const cb = b.status === 'paid' ? 1 : 0
    return ca !== cb ? ca - cb : a.time24.localeCompare(b.time24)
  })
  return s
})
const activeList = computed(() => shown.value.filter((a) => a.status !== 'paid'))
const completedList = computed(() => shown.value.filter((a) => a.status === 'paid'))
const queueTitle = computed(() =>
  filter.value === 'waiting'
    ? 'Patients Waiting At Frontdesk'
    : filter.value === 'seen'
      ? "Today's queue · Seen"
      : "Today's queue",
)

function whenLabel(a) {
  const day = a.date === todayISO
    ? 'Today'
    : new Date(a.date + 'T00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  return `${day} · ${a.timeLabel}`
}

/* ---------------- shared ids for action APIs ---------------- */
function apiIds() {
  return {
    doctor_id: Number(resolveDoctorId(authStore.user)),
    hospital_id: Number(resolveHospitalId(authStore.user)),
  }
}
const actionBusyId = ref(null) // appointment id currently running an action

/* ---------------- confirm appointment — LIVE via confirmAppointment ---------------- */
const confirmAppt = ref(null)
const confirmTime = ref('')
const confirmDuration = ref(30)
const confirmRemarks = ref('')
const confirmBusy = ref(false)

/* slot picker (live appointments) — getPhysioAppointmentSlots */
const slotsLoading = ref(false)
const slotsFailed = ref(false)
const slotOptions = ref([]) // available start times, e.g. "01:00 PM"
const bookedSlots = ref([])
const slotSel = ref('')
const durOptions = ref([15, 30, 45, 60, 75, 90])
const slotDate = ref('')

function slotStart(x) {
  const raw = typeof x === 'string' ? x : x?.time_slot || x?.slot || x?.time || x?.s_time || ''
  const str = String(raw)
  const v = (str.includes('To') ? str.split('To')[0] : str).trim()
  return /select/i.test(v) ? '' : v // drop the CRM's "Select Timeslot" placeholder rows
}


async function openConfirm(a) {
  if (!shiftGuard()) return
  confirmAppt.value = a
  confirmTime.value = a.time24
  confirmDuration.value = 30
  confirmRemarks.value = ''
  slotOptions.value = []
  bookedSlots.value = []
  slotSel.value = ''
  slotsFailed.value = false
  slotDate.value = ''
  durOptions.value = [15, 30, 45, 60, 75, 90]
  if (a._demo) return
  slotsLoading.value = true
  try {
    const data = await getPhysioAppointmentSlots({
      appointment_id: Number(a.id),
      doctor_id: Number(resolveDoctorId(authStore.user)),
    })
    if (data?.status !== 'success') throw new Error(data?.message || 'slots failed')
    const avail = [...new Set((data.aslots || []).map(slotStart).filter(Boolean))]
    const booked = [...new Set((data.bslots || []).map(slotStart).filter(Boolean))]
    const current = slotStart(data.current_value)
    if (current && !avail.includes(current)) avail.unshift(current)
    slotOptions.value = avail
    bookedSlots.value = booked.filter((b) => !avail.includes(b))
    slotSel.value = current && avail.includes(current) ? current : avail[0] || ''
    if (Array.isArray(data.duration_options) && data.duration_options.length) durOptions.value = data.duration_options
    if (data.duration) confirmDuration.value = Number(data.duration)
    if (data.date) slotDate.value = data.date
  } catch (e) {
    console.log('getPhysioAppointmentSlots failed — falling back to manual time:', e)
    slotsFailed.value = true
  } finally {
    slotsLoading.value = false
  }
}
function closeConfirm() {
  confirmAppt.value = null
}
async function doConfirm() {
  if (!shiftGuard()) return
  const a = confirmAppt.value
  if (a._demo) {
    if (confirmTime.value) {
      a.time24 = confirmTime.value
      a.timeLabel = ampm(confirmTime.value)
    }
    a.status = 'booked'
    closeConfirm()
    Notify.create({ type: 'positive', message: 'Appointment confirmed ✓' })
    return
  }
  if (confirmBusy.value) return
  confirmBusy.value = true
  try {
    const timeSlot = slotSel.value || ampm12p(confirmTime.value || a.time24)
    const data = await confirmAppointment({
      appointment_id: Number(a.id),
      ...apiIds(),
      remarks: confirmRemarks.value || 'Confirmed from ActivPT app',
      time_slot: timeSlot,
      duration: Number(confirmDuration.value) || 30,
    })
    if (data?.status === 'success') {
      Notify.create({ type: 'positive', message: data.message || 'Appointment confirmed ✓' })
      closeConfirm()
      await loadAppointments()
    } else {
      Notify.create({ type: 'negative', message: data?.message || 'Could not confirm appointment' })
    }
  } catch (e) {
    console.log('confirmAppointment failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not confirm — try again' })
  } finally {
    confirmBusy.value = false
  }
}

/* ---------------- cancel with reason — Decline and Cancel appointment ----------------
   Both are the same CRM action (cancelAppointment), so they share one dialog: the
   physio always states a reason before an appointment is cancelled. */
const cancelAppt = ref(null)
const cancelReason = ref('')
const cancelBusy = ref(false)
function openCancel(a) {
  if (!shiftGuard()) return
  cancelAppt.value = a
  cancelReason.value = ''
}
async function doCancel() {
  if (cancelBusy.value) return
  if (cancelAppt.value?._demo) {
    cancelAppt.value.status = 'declined'
    cancelAppt.value = null
    Notify.create({ message: 'Appointment cancelled' })
    return
  }
  cancelBusy.value = true
  try {
    const data = await cancelAppointment({
      appointment_id: Number(cancelAppt.value.id),
      ...apiIds(),
      remark: cancelReason.value.trim(),
    })
    if (data?.status === 'success') {
      Notify.create({ message: data.message || 'Appointment cancelled.' })
      cancelAppt.value = null
      await loadAppointments()
    } else {
      Notify.create({ type: 'negative', message: data?.message || 'Could not cancel' })
    }
  } catch (e) {
    console.log('cancelAppointment failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not cancel — try again' })
  } finally {
    cancelBusy.value = false
  }
}

/* ---------------- patient check-in — LIVE via checkInPatient ---------------- */
/* Gate for every action that changes something. Order matters: after check-out
   the check-in time is still set, so the check-out test must come first. */
function shiftGuard() {
  if (todayRoster.value?.status === 'not_set') {
    Notify.create({ type: 'warning', message: 'Your roster is not set for today — contact the clinic admin.' })
    return false
  }
  if (checkedOutAt.value) {
    Notify.create({
      type: 'warning',
      message: `You checked out at ${ampm(checkedOutAt.value)} — no further actions today.`,
    })
    return false
  }
  if (!checkedInAt.value) {
    Notify.create({ type: 'warning', message: 'Please check in to start your shift first.' })
    return false
  }
  return true
}

async function doPatientCheckIn(a) {
  if (!shiftGuard()) return
  if (a._demo) {
    a.status = 'checked_in'
    return
  }
  if (actionBusyId.value) return
  actionBusyId.value = a.id
  try {
    const data = await checkInPatient({ appointment_id: Number(a.id), ...apiIds() })
    if (data?.status === 'success') {
      a.status = 'checked_in'
      Notify.create({ type: 'positive', message: data.message || `Patient checked in${data.ready_time ? ' · ' + ampm(data.ready_time) : ''}` })
    } else {
      Notify.create({ type: 'negative', message: data?.message || 'Could not check in patient' })
    }
  } catch (e) {
    console.log('checkInPatient failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not check in — try again' })
  } finally {
    actionBusyId.value = null
  }
}

/* ---------------- start treatment — LIVE via startAppointment ---------------- */
async function start(a) {
  if (!shiftGuard()) return
  if (a._demo) {
    if (a.status === 'checked_in') a.status = 'in_treatment'
    router.push(`/physio/treatment/${a.id}`)
    return
  }
  if (actionBusyId.value) return
  // Re-entering a session that is already running: startAppointment is called again
  // (that is how the backend returns the live session), but the server's "session
  // started successfully" message would be a lie here — so don't show it.
  const resuming = a.status === 'in_treatment'
  actionBusyId.value = a.id
  try {
    const data = await startAppointment({ appointment_id: Number(a.id), ...apiIds() })
    if (data?.status === 'success') {
      liveSessions[a.id] = { patient: { ...a.patient }, session: data }
      a.status = 'in_treatment'
      if (!resuming) Notify.create({ type: 'positive', message: data.message || 'Session started' })
      router.push(`/physio/treatment/${a.id}`)
    } else {
      Notify.create({ type: 'negative', message: data?.message || 'Could not start session' })
    }
  } catch (e) {
    console.log('startAppointment failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not start session — try again' })
  } finally {
    actionBusyId.value = null
  }
}

/* ---------------- invoice — LIVE via billing sheet (demo keeps its page) ---------------- */
const billAppt = ref(null)
function invoice(a) {
  if (!shiftGuard()) return
  if (a._demo) {
    router.push(`/physio/invoice/${a.id}`)
    return
  }
  billAppt.value = a
}
async function billClosed(refresh, outcome) {
  const a = billAppt.value
  if (outcome && a) setApptBillingState(a.id, outcome)
  billAppt.value = null
  if (refresh) await loadAppointments()
  // billing done → move straight to the follow-up step (prototype flow)
  if (outcome && a && !a.followUp && a.canFollowUp !== false) bookFollowUp(a)
}
/* ---------------- follow-up booking — LIVE via addFollowupByPhysio ---------------- */
const fuAppt = ref(null)
const fuLoading = ref(false)
const fuDetails = ref(null)
const fuDate = ref('')
const fuTime = ref('10:00')
const fuDuration = ref(45)
const fuRemarks = ref('')
const fuBusy = ref(false)
const fuIsConsult = ref(0)
const fuSuggestedGap = ref(null) // days gap from suggested_session_frequency

/* follow-up physio — the visit can be booked with any physio of the hospital */
const fuPhysios = ref([])
const fuPhysiosLoading = ref(false)
const fuPhysioSel = ref(null)
const fuSelfId = computed(() => Number(resolveDoctorId(authStore.user)) || null)
const fuPhysioName = computed(
  () => fuPhysios.value.find((p) => Number(p.id) === Number(fuPhysioSel.value))?.name || '',
)
const fuOtherPhysio = computed(
  () => !!fuPhysioSel.value && Number(fuPhysioSel.value) !== fuSelfId.value,
)

/* follow-up slots (same dropdown as confirm sheet) */
const fuSlotsLoading = ref(false)
const fuSlotsFailed = ref(false)
const fuSlotOptions = ref([])
const fuBookedSlots = ref([])
const fuSlotSel = ref('')

/* follow-up modalities */
const fuMods = ref([])
const fuModAdd = ref('')
const fuCatalogue = ref([])

async function loadFuSlots() {
  if (!fuAppt.value) return
  fuSlotsLoading.value = true
  fuSlotsFailed.value = false
  try {
    const [Y, M, D] = fuDate.value.split('-')
    const data = await getPhysioAppointmentSlots({
      appointment_id: Number(fuAppt.value.id),
      // whichever physio is selected — the backend only reuses the parent
      // appointment's own slot when it is the same physio on the same day
      doctor_id: Number(fuPhysioSel.value || fuSelfId.value),
      date: `${M}/${D}/${Y}`,
    })
    if (data?.status !== 'success') throw new Error('slots failed')
    const avail = [...new Set((data.aslots || []).map(slotStart).filter(Boolean))]
    fuSlotOptions.value = avail
    fuBookedSlots.value = [...new Set((data.bslots || []).map(slotStart).filter(Boolean))].filter(
      (b) => !avail.includes(b),
    )
    if (!avail.includes(fuSlotSel.value)) fuSlotSel.value = avail[0] || ''
  } catch (e) {
    console.log('follow-up slots failed — falling back to manual time:', e)
    fuSlotsFailed.value = true
  } finally {
    fuSlotsLoading.value = false
  }
}
watch([fuDate, fuPhysioSel], () => {
  if (fuAppt.value) loadFuSlots()
})

async function loadFuPhysios() {
  if (fuPhysios.value.length) return
  fuPhysiosLoading.value = true
  try {
    const res = await getHospitalPhysios({
      hospital_id: Number(resolveHospitalId(authStore.user)),
      doctor_id: fuSelfId.value,
    })
    // self first, then the rest as the backend sorted them (by name)
    const list = res?.status === 'success' ? res.physios || [] : []
    fuPhysios.value = [...list.filter((p) => p.is_self), ...list.filter((p) => !p.is_self)]
  } catch (e) {
    console.log('getHospitalPhysios failed — follow-up stays with the current physio:', e)
  } finally {
    fuPhysiosLoading.value = false
  }
}

function fuAddModality() {
  const v = fuModAdd.value.trim()
  if (v && !fuMods.value.includes(v)) fuMods.value.push(v)
  fuModAdd.value = ''
}
function fuRemoveModality(m) {
  fuMods.value = fuMods.value.filter((x) => x !== m)
}

const FU_QUICK = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 2 days', days: 2 },
  { label: 'In 3 days', days: 3 },
  { label: 'In 4 days', days: 4 },
  { label: 'In 5 days', days: 5 },
  { label: 'In 6 days', days: 6 },
  { label: 'Next week', days: 7 },
]
function dateAfterDays(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function fuQuickPick(days) {
  fuDate.value = dateAfterDays(days)
}

function fuSlotStartTime() {
  // "01:00 PM" → "13:00" (or '' when using manual fallback)
  return fuSlotSel.value && !fuSlotsFailed.value ? to24(fuSlotSel.value) : ''
}

function addMinutes(hm, mins) {
  const [h, m] = hm.split(':').map(Number)
  const t = h * 60 + m + Number(mins)
  return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

async function bookFollowUp(a) {
  if (!shiftGuard()) return
  if (a._demo) {
    router.push(`/physio/followup/${a.id}`)
    return
  }
  fuAppt.value = a
  fuDetails.value = null
  fuRemarks.value = ''
  fuTime.value = a.time24 || '10:00'
  fuDuration.value = 45
  const d = new Date()
  d.setDate(d.getDate() + 1)
  fuDate.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  fuIsConsult.value = 0
  fuMods.value = []
  fuModAdd.value = ''
  fuSlotSel.value = ''
  fuPhysioSel.value = fuSelfId.value
  fuLoading.value = true
  try {
    const [res, cat] = await Promise.all([
      getFollowupDetails({ appointment_id: Number(a.id) }),
      fuCatalogue.value.length
        ? Promise.resolve(null)
        : getPhysioDefaultModalities({ hospital_id: Number(resolveHospitalId(authStore.user)) }),
    ])
    if (res?.status === 'success') {
      fuDetails.value = res.data
      fuIsConsult.value = Number(res.data?.is_consultation) || 0
      fuMods.value = [...(res.data?.suggested_modalities || [])]
      // Default date from suggested_session_frequency, e.g. "7/week" → daily → tomorrow,
      // "3/week" → every ~2 days, "1/week" → next week
      const freq = String(res.data?.suggested_session_frequency || '')
      const fm = freq.match(/(\d+)\s*\/\s*week/i)
      const n = /daily/i.test(freq) ? 7 : fm ? Number(fm[1]) : 0
      if (n > 0) {
        fuSuggestedGap.value = Math.max(1, Math.round(7 / n))
        fuDate.value = dateAfterDays(fuSuggestedGap.value)
      } else fuSuggestedGap.value = null
    }
    if (cat?.status === 'success') fuCatalogue.value = cat.items || []
    loadFuPhysios()
  } catch (e) {
    console.log('getFollowupDetails failed:', e)
  } finally {
    fuLoading.value = false
  }
  loadFuSlots()
}
function closeFollowUp() {
  fuAppt.value = null
}

async function submitFollowUp() {
  if (fuBusy.value) return
  if (!fuDate.value || (!fuSlotSel.value && !fuTime.value)) {
    Notify.create({ type: 'negative', message: 'Pick a date and time slot' })
    return
  }
  fuBusy.value = true
  try {
    const d = fuDetails.value || {}
    const [Y, M, D] = fuDate.value.split('-')
    const payload = {
      patient: Number(d.patient || fuAppt.value.patient?.id),
      doctor: Number(fuPhysioSel.value || d.doctor || fuSelfId.value),
      user_id: Number(authStore.user?.user_id || authStore.user?.id) || null,
      parent_appointment: Number(d.parent_appointment || fuAppt.value.id),
      date: `${M}/${D}/${Y}`,
      time_slot: fuSlotStartTime()
        ? `${ampm12p(fuSlotStartTime())} To ${ampm12p(addMinutes(fuSlotStartTime(), fuDuration.value))}`
        : `${ampm12p(fuTime.value)} To ${ampm12p(addMinutes(fuTime.value, fuDuration.value))}`,
      duration: Number(fuDuration.value),
      package: 0,
      is_consultation: Number(fuIsConsult.value) || 0,
      is_general_consultation: Number(d.is_general_consultation) || 0,
      suggested_modalities: fuMods.value,
      suggested_contraindications: d.suggested_contraindications || [],
      suggested_milestones: d.suggested_milestones || [],
      current_session_number: Number(d.current_session_number) || 0,
      remarks: fuRemarks.value || 'Follow-up booked from ActivPT app',
      sms: null,
      status: 'Confirmed',
      appnt_status: 'Clinic',
      followup_status: 0,
      unique_identifier: d.unique_identifier,
    }
    const res = await addFollowupByPhysio(payload)
    if (res?.status === 'success') {
      Notify.create({
        type: 'positive',
        message:
          res.message ||
          (fuOtherPhysio.value
            ? `Follow-up booked with ${fuPhysioName.value}.`
            : 'Follow-up added successfully.'),
      })
      closeFollowUp()
      await loadAppointments()
    } else {
      Notify.create({ type: 'negative', message: res?.message || 'Could not book follow-up' })
    }
  } catch (e) {
    console.log('addFollowupByPhysio failed:', e)
    Notify.create({ type: 'negative', message: e.response?.data?.message || 'Could not book — try again' })
  } finally {
    fuBusy.value = false
  }
}
function openPatient(a) {
  const pid = a._demo ? a.pid : a.patient?.id
  if (pid) router.push(`/physio/patients/${pid}`)
}
function resetDemo() {
  window.location.reload()
}
</script>

<style scoped>
/* ============ design tokens (physio design system) ============ */
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
  --danger: #d9485f;
  --warning: #c78810;
  --success: #1f8a4d;
  --info: #2563eb;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
  --shadow-md: 0 14px 34px rgba(16, 33, 42, 0.1);
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
  padding-bottom: 98px;
  animation: ph-fade 0.25s ease;
}
@keyframes ph-fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ============ hero ============ */
.hero {
  background: var(--grad);
  color: #fff;
  padding: 18px 18px 70px;
  position: relative;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  box-shadow: var(--shadow-md);
}
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at left 30% bottom 20%, rgba(255, 255, 255, 0.1), transparent 22%);
  pointer-events: none;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}
.hero-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.hero h1 {
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 4px 0 0;
  line-height: 1.2;
  position: relative;
  z-index: 1;
}
.hero p {
  margin: 0;
  position: relative;
  z-index: 1;
}
.subtle {
  color: rgba(255, 255, 255, 0.84);
  font-size: 13px;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.35);
}
.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

/* attendance card */
.att-card {
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 16px;
  padding: 12px 14px;
  color: #fff;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;
}
.att-card .subtle {
  color: rgba(255, 255, 255, 0.82);
  font-size: 12.5px;
}
.att-card.attn {
  background: #fff7e9;
  border-color: #f4d58a;
  color: var(--text);
}
@keyframes ph-attnpulse {
  0% { box-shadow: 0 0 0 0 rgba(10, 126, 110, 0.5); }
  70% { box-shadow: 0 0 0 12px rgba(10, 126, 110, 0); }
  100% { box-shadow: 0 0 0 0 rgba(10, 126, 110, 0); }
}
.pulse {
  animation: ph-attnpulse 1.8s infinite;
}

/* ============ layout helpers ============ */
.stack {
  margin-top: -52px;
  position: relative;
  z-index: 4;
}
.section {
  padding: 0 16px;
}
.section + .section {
  margin-top: 14px;
}
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
.row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.grow {
  flex: 1;
}
.muted {
  color: var(--text-2);
  font-size: 13px;
}
.tiny {
  color: var(--text-3);
  font-size: 12px;
}

/* ============ cards ============ */
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

/* stats */
.stat {
  flex: 1;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  transition: 0.15s;
}
.stat.active {
  border-color: var(--brand);
  background: var(--grad-soft);
  box-shadow: var(--shadow-sm);
}
.stat:active {
  transform: scale(0.98);
}
.stat .n {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.stat .l {
  font-size: 11px;
  color: var(--text-2);
  font-weight: 700;
}

/* queue card */
.q-card-ph {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
}
.q-avatar-ph {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: var(--grad-soft);
  color: var(--brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex: none;
}
.ph-time {
  font-weight: 800;
  font-size: 15px;
}
.ph-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* badges */
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
.badge.brand { background: var(--brand-3); color: var(--brand); }
.badge.success { background: #e6f7ed; color: var(--success); }
.badge.warn { background: #fff4dd; color: var(--warning); }
.badge.danger { background: #fde8ec; color: var(--danger); }
.badge.info { background: #e6efff; color: var(--info); }
.badge.pending { background: #efeaff; color: #6d4bff; }
.badge.muted { background: #eef3f4; color: var(--text-2); }

/* chips */
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

/* buttons */
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
.btn:active {
  transform: scale(0.985);
}
.btn.primary {
  background: var(--grad);
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn.secondary {
  background: var(--brand-3);
  color: var(--brand);
}
.btn.ghost {
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--line);
}
.btn.danger {
  background: var(--danger);
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn:disabled {
  opacity: 0.45;
  cursor: default;
}
.btn:disabled:active {
  transform: none;
}
.btn.small {
  min-height: 36px;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 13px;
}

/* fields */
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
select.input {
  appearance: none;
  -webkit-appearance: none;
  font-family: inherit;
  padding-right: 34px;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%235a6c76' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
}
.input:focus {
  border-color: var(--brand-2);
  box-shadow: 0 0 0 3px rgba(15, 152, 134, 0.12);
}
.btn.full {
  width: 100%;
}

/* slot picker — native time-picker style columns */
.time-panel {
  display: flex;
  max-height: 240px;
  overflow: hidden;
}
.time-col {
  flex: 1;
  overflow-y: auto;
  max-height: 240px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.time-col + .time-col {
  border-left: 1px solid var(--line);
}
.time-col-h {
  position: sticky;
  top: 0;
  background: #fff;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  color: var(--text-3);
  padding: 4px 0 6px;
  z-index: 1;
}
.time-cell {
  border: none;
  background: transparent;
  border-radius: 9px;
  padding: 9px 0;
  font-size: 13.5px;
  font-weight: 700;
  font-family: inherit;
  color: var(--text);
  text-align: center;
  cursor: pointer;
  transition: 0.12s ease;
  flex: none;
}
.time-cell:hover {
  background: #eef6f5;
}
.time-cell.sel {
  background: var(--brand);
  color: #fff;
}
.time-cell.booked {
  opacity: 0.35;
  text-decoration: line-through;
  cursor: default;
}

/* follow-up full-screen (prototype-matched) */
.fu-screen {
  position: fixed;
  inset: 0;
  z-index: 45;
  background: var(--bg);
  overflow: auto;
  animation: ph-fade 0.22s ease;
}
.fu-inner {
  max-width: 460px;
  margin: 0 auto;
  min-height: 100%;
}
.fu-topbar {
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
.fu-topbar h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.fu-back {
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
.fu-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-2);
  margin: 0 0 6px 2px;
  letter-spacing: 0.01em;
}
.fu-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.fu-chip {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #f0f6f6;
  color: var(--text-2);
  border: 1px solid var(--line);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}
.fu-chip.active {
  background: var(--brand);
  color: #fff;
  border-color: var(--brand);
}
.fu-foot {
  position: sticky;
  bottom: 12px;
  margin: 0 16px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(12px);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: var(--shadow-md);
  z-index: 46;
  display: flex;
  gap: 10px;
}

/* slot dropdown (custom) */
.dd {
  position: relative;
}
.dd-field {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
  font-weight: 600;
  color: var(--text);
}
.dd-chev {
  color: var(--text-3);
  transition: transform 0.18s ease;
}
.dd-chev.open {
  transform: rotate(180deg);
}
.dd-overlay {
  position: fixed;
  inset: 0;
  z-index: 55;
}
.dd-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: var(--shadow-md);
  max-height: 210px;
  overflow: auto;
  z-index: 60;
  animation: ph-fade 0.15s ease;
}
.dd-opt {
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 1px solid #f1f6f6;
}
.dd-opt:last-child {
  border-bottom: none;
}
.dd-opt:active {
  background: #f0f6f6;
}
.dd-opt.sel {
  background: var(--brand-3);
  color: var(--brand);
}
.dd-opt.booked {
  opacity: 0.45;
  text-decoration: line-through;
  cursor: default;
  pointer-events: none;
}

/* duration chips */
.dur-row {
  display: flex;
  gap: 8px;
}
.chip.dur {
  flex: 1;
  justify-content: center;
  text-align: center;
  padding: 9px 0;
  cursor: pointer;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #f0f6f6;
  color: var(--text-2);
  font-size: 13px;
  font-weight: 700;
}
.chip-active {
  background: var(--brand) !important;
  color: #fff !important;
  border-color: var(--brand) !important;
}

/* bottom sheet */
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

/* centered dialog variant */
.scrim-center {
  align-items: center;
  padding: 0 24px;
}
.sheet.dialog {
  border-radius: 22px;
  max-width: 400px;
  animation: ph-pop 0.22s ease;
}
@keyframes ph-pop {
  from { transform: scale(0.94); opacity: 0.5; }
  to { transform: scale(1); opacity: 1; }
}
</style>