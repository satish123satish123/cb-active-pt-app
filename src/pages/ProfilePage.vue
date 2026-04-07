<template>
  <q-page class="profile-page">
    <!-- Profile Hero -->
    <div class="profile-hero">
      <div class="hero-deco deco-1"></div>
      <div class="hero-deco deco-2"></div>
      <div class="hero-inner">
        <div class="hero-top">
          <div class="big-avatar">{{ initials }}</div>
          <div class="hero-info">
            <div class="hero-name">{{ authStore.user?.username || patient.name }}</div>
            <div class="hero-phone">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              +91 {{ authStore.user?.phone || patient.phone }}
            </div>
            <div class="hero-plan-badge">
              <span class="plan-dot"></span>
              <span class="plan-txt">{{ patient.plan }}</span>
            </div>
          </div>
          <q-btn flat dense no-caps class="edit-profile-btn" to="/profile/personal-info">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span class="q-ml-xs">Edit</span>
          </q-btn>
        </div>
        <div class="hero-stats">
          <div class="hstat">
            <span class="hstat-num">{{ patient.totalSessions }}</span>
            <span class="hstat-label">Sessions</span>
          </div>
          <div class="hstat">
            <span class="hstat-num">{{ patient.daysActive }}</span>
            <span class="hstat-label">Days Active</span>
          </div>
          <div class="hstat">
            <span class="hstat-num">{{ patient.streak }}</span>
            <span class="hstat-label">Streak</span>
          </div>
          <div class="hstat">
            <span class="hstat-num">{{ patient.progress }}%</span>
            <span class="hstat-label">Progress</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="qa-pill" @click="showPinModal = true">
        <div class="qa-icon teal">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A7E6E"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div class="qa-label">Reset PIN</div>
      </div>
      <div class="qa-pill" @click="downloadReport">
        <div class="qa-icon blue">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0d7a9c"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div class="qa-label">Downloads</div>
      </div>
      <div class="qa-pill">
        <div class="qa-icon amber">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c88000"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div class="qa-label">Contact</div>
      </div>
    </div>

    <!-- Diagnosis Card -->
    <div class="diagnosis-card">
      <div class="diag-header">
        <div class="diag-title-row">
          <div class="diag-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0A7E6E"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span class="diag-title">Diagnosis</span>
        </div>
        <span class="diag-date">Updated {{ patient.diagnosisDate }}</span>
      </div>

      <div class="diag-inference-lbl">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Inference / Provisional Diagnosis
      </div>

      <div class="diag-item">
        <div class="diag-item-header">
          <span class="diag-priority-badge badge-primary">Primary</span>
          <span class="diag-item-name">{{ patient.primaryDiagnosis.title }}</span>
        </div>
        <div class="diag-item-desc">{{ patient.primaryDiagnosis.description }}</div>
      </div>

      <div class="diag-separator"></div>

      <div class="diag-item secondary">
        <div class="diag-item-header">
          <span class="diag-priority-badge badge-secondary">Secondary</span>
          <span class="diag-item-name">{{ patient.secondaryDiagnosis.title }}</span>
        </div>
        <div class="diag-item-desc">{{ patient.secondaryDiagnosis.description }}</div>
      </div>

      <div class="diag-separator"></div>

      <div class="diag-notes">
        <div class="diag-notes-lbl">🏠 Patient Education & Home Care</div>
        <div class="diag-notes-txt">{{ patient.homeCareTips }}</div>
      </div>
    </div>

    <!-- Health Information -->
    <div class="section-block">
      <div class="sec-header">
        <div class="sec-header-icon si-teal">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A7E6E"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </div>
        <span class="sec-title">Health Information</span>
      </div>
      <div class="health-grid">
        <div class="health-cell">
          <div class="hc-lbl">Age</div>
          <div class="hc-val">{{ patient.age }} years</div>
        </div>
        <div class="health-cell">
          <div class="hc-lbl">Blood Group</div>
          <div class="hc-val accent">{{ patient.bloodGroup }}</div>
        </div>
        <div class="health-cell">
          <div class="hc-lbl">Height</div>
          <div class="hc-val">{{ patient.height }}</div>
        </div>
        <div class="health-cell">
          <div class="hc-lbl">Weight</div>
          <div class="hc-val">{{ patient.weight }}</div>
        </div>
        <div class="health-cell" style="grid-column: 1 / -1">
          <div class="hc-lbl">Allergies / Medications</div>
          <div class="hc-val" style="font-size: 12.5px; font-weight: 500; color: #3a6b62">
            {{ patient.allergies }}
          </div>
        </div>
      </div>
    </div>

    <!-- Reports & Documents -->
    <div class="section-block">
      <div class="sec-header">
        <div class="sec-header-icon si-blue">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0d7a9c"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <span class="sec-title">Reports & Documents</span>
      </div>
      <div v-for="rep in reports" :key="rep.id" class="report-item">
        <div class="report-icon" :class="rep.iconClass">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            :stroke="rep.color"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <div class="report-body">
          <div class="report-name">{{ rep.name }}</div>
          <div class="report-meta">{{ rep.size }} &nbsp;·&nbsp; {{ rep.date }}</div>
        </div>
        <button class="dl-btn" @click.stop>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A7E6E"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Security & Preferences -->
    <div class="section-block">
      <div class="sec-header">
        <div class="sec-header-icon si-teal">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A7E6E"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <span class="sec-title">Security & Account</span>
      </div>
      <div class="setting-row" @click="showPinModal = true">
        <div class="setting-icon si-teal">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A7E6E"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div class="setting-body">
          <div class="setting-label">Reset PIN</div>
          <div class="setting-sub">Change your 4-digit access PIN</div>
        </div>
        <svg
          opacity=".35"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0d2922"
          stroke-width="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
      <div class="setting-row">
        <div class="setting-icon si-purple">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7850b4"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div class="setting-body">
          <div class="setting-label">Biometric Login</div>
          <div class="setting-sub">Use fingerprint / face to sign in</div>
        </div>
        <div class="toggle-wrap" @click.stop="toggles.biometric = !toggles.biometric">
          <div class="toggle-track" :class="{ on: toggles.biometric }">
            <div class="toggle-thumb"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout -->
    <button class="logout-btn" @click="onLogout">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sign Out
    </button>

    <!-- PIN Modal -->
    <q-dialog
      v-model="showPinModal"
      position="bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-title">{{ pinStep === 'new' ? 'Set New PIN' : 'Confirm New PIN' }}</div>
        <div class="modal-sub">
          {{
            pinStep === 'new'
              ? "Choose 4 digits you'll remember"
              : 'Re-enter your new PIN to confirm'
          }}
        </div>
        <div class="pin-dots">
          <div
            v-for="n in 4"
            :key="n"
            class="pin-dot"
            :class="{ filled: pinEntry.length >= n }"
          ></div>
        </div>
        <div class="numpad">
          <div
            class="numpad-row"
            v-for="(row, ridx) in [
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              [null, '0', '⌫'],
            ]"
            :key="ridx"
          >
            <template v-for="(k, kidx) in row" :key="kidx">
              <div v-if="k === null" style="width: 72px; height: 72px"></div>
              <button v-else class="num-btn" :class="{ del: k === '⌫' }" @click="pinPress(k)">
                {{ k }}
              </button>
            </template>
          </div>
        </div>
        <button class="modal-cancel" @click="closePin">Cancel</button>
      </div>
    </q-dialog>

    <div style="height: 40px"></div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

/* ── Patient Data ── */
const patient = ref({
  name: 'Guest',
  phone: '1234567890',
  plan: '3 Month Plan · Active',
  age: 34,
  bloodGroup: 'B+',
  height: '5\'10" (178 cm)',
  weight: '74 kg',
  allergies: 'No known allergies · Ibuprofen (NSAIDs) – avoid',
  totalSessions: 12,
  daysActive: 28,
  streak: 5,
  progress: 75,
  diagnosisDate: '28 Mar 2026',
  primaryDiagnosis: {
    title: 'Right subscapularis tendinopathy',
    description:
      'Inflammation or injury to the subscapularis tendon in your right shoulder, causing pain during internal rotation.',
  },
  secondaryDiagnosis: {
    title: 'Supraspinatus tendinopathy',
    description:
      'Irritation of the supraspinatus tendon, often causing pain when lifting the arm out to the side.',
  },
  homeCareTips:
    'Avoid overhead lifting. Apply ice for 10-15 mins. Sleep on your unaffected side. Daily home exercises as prescribed.',
})

const initials = computed(() => {
  const name = authStore.user?.username || patient.value.name
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

/* ── Reports ── */
const reports = ref([
  {
    id: 1,
    name: 'Assessment Report – Mar 2026',
    size: '1.2 MB',
    date: '28 Mar 2026',
    iconClass: 'ri-pdf',
    color: '#e74c3c',
  },
  {
    id: 2,
    name: 'Treatment Plan – Shoulder Rehab',
    size: '890 KB',
    date: '01 Apr 2026',
    iconClass: 'ri-doc',
    color: '#0d7a9c',
  },
  {
    id: 3,
    name: 'X-Ray Reference – Shoulder',
    size: '3.4 MB',
    date: '15 Mar 2026',
    iconClass: 'ri-xray',
    color: '#7850b4',
  },
])

/* ── Toggles ── */
const toggles = ref({ biometric: false, reminders: true })

/* ── PIN reset modal ── */
const showPinModal = ref(false)
const pinStep = ref('new') // new | confirm
const pinEntry = ref('')
const newPinTemp = ref('')

function pinPress(k) {
  if (k === '⌫') {
    pinEntry.value = pinEntry.value.slice(0, -1)
    return
  }
  if (pinEntry.value.length >= 4) return
  pinEntry.value += k
  if (pinEntry.value.length === 4) {
    setTimeout(async () => {
      if (pinStep.value === 'new') {
        newPinTemp.value = pinEntry.value
        pinStep.value = 'confirm'
        pinEntry.value = ''
      } else {
        if (pinEntry.value === newPinTemp.value) {
          try {
            $q.loading.show()
            const userEmail = authStore.user?.email || authStore.loginData?.username
            const response = await api.post('resetPassword', {
              username: userEmail,
              password: pinEntry.value,
            })
            $q.loading.hide()

            if (response.data?.status === 'success' || response.status === 200) {
              $q.notify({
                type: 'positive',
                message: response.data?.message || 'PIN updated successfully!',
              })
              closePin()
            } else {
              $q.notify({
                type: 'negative',
                message: response.data?.message || 'Reset failed. Try again.',
              })
              pinEntry.value = ''
              pinStep.value = 'new'
            }
          } catch (e) {
            $q.loading.hide()
            $q.notify({
              type: 'negative',
              message: e.response?.data?.message || e.message || 'Failed to update PIN.',
            })
            pinEntry.value = ''
            pinStep.value = 'new'
          }
        } else {
          $q.notify({ type: 'negative', message: 'PINs do not match' })
          pinEntry.value = ''
          pinStep.value = 'new'
        }
      }
    }, 200)
  }
}
function closePin() {
  showPinModal.value = false
  pinStep.value = 'new'
  pinEntry.value = ''
  newPinTemp.value = ''
}

const onLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const downloadReport = () => {
  $q.notify({ message: 'Opening reports...', color: 'teal' })
}
</script>

<style scoped>
.profile-page {
  font-family: 'Sora', sans-serif;
  background: linear-gradient(170deg, #eaf8f3 0%, #f4fbf8 50%, #edf9f5 100%);
  min-height: 100vh;
  padding-bottom: 20px;
}

/* ── Profile Hero ── */
.profile-hero {
  margin: 16px 16px 0;
  border-radius: 24px;
  background: linear-gradient(145deg, #0c9b80 0%, #0a7e6e 55%, #087560 100%);
  padding: 24px 20px 22px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 36px rgba(10, 126, 110, 0.28);
}
.hero-deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.deco-1 {
  top: -50px;
  right: -50px;
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.06);
}
.deco-2 {
  bottom: -40px;
  left: -20px;
  width: 130px;
  height: 130px;
  background: rgba(255, 255, 255, 0.04);
}
.hero-inner {
  position: relative;
}
.hero-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
  position: relative;
}
.big-avatar {
  width: 66px;
  height: 66px;
  border-radius: 18px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
}
.hero-info {
  flex: 1;
  padding-top: 4px;
}
.hero-name {
  font-size: 20px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.3px;
  line-height: 1.2;
}
.hero-phone {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'DM Sans', sans-serif;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.hero-plan-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 4px 11px;
  margin-top: 8px;
}
.plan-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #7dffd0;
  animation: pulseDot 2s ease infinite;
}
.plan-txt {
  font-size: 10.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'DM Sans', sans-serif;
}

.edit-profile-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.hero-stats {
  display: flex;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  overflow: hidden;
}
.hstat {
  flex: 1;
  padding: 11px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
}
.hstat + .hstat::after {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: rgba(255, 255, 255, 0.18);
}
.hstat-num {
  font-size: 17px;
  font-weight: 800;
  color: white;
  line-height: 1;
}
.hstat-label {
  font-size: 9px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
}

/* ── Quick Actions ── */
.quick-actions {
  display: flex;
  gap: 10px;
  padding: 14px 16px 0;
}
.qa-pill {
  flex: 1;
  border-radius: 14px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.82);
  border: 1.5px solid rgba(10, 126, 110, 0.1);
  box-shadow: 0 2px 10px rgba(10, 126, 110, 0.06);
  cursor: pointer;
}
.qa-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qa-icon.teal {
  background: rgba(10, 126, 110, 0.1);
}
.qa-icon.blue {
  background: rgba(13, 122, 156, 0.1);
}
.qa-icon.amber {
  background: rgba(240, 165, 0, 0.1);
}
.qa-label {
  font-size: 10.5px;
  font-weight: 600;
  color: #0d2922;
  font-family: 'DM Sans', sans-serif;
  text-align: center;
}

/* ── Section Blocks ── */
.section-block {
  margin: 14px 16px 0;
  background: rgba(255, 255, 255, 0.82);
  border: 1.5px solid rgba(10, 126, 110, 0.08);
  border-radius: 20px;
  overflow: hidden;
}
.sec-header {
  padding: 14px 16px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(10, 126, 110, 0.07);
}
.sec-header-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.si-teal {
  background: rgba(10, 126, 110, 0.1);
}
.si-blue {
  background: rgba(13, 122, 156, 0.1);
}
.si-purple {
  background: rgba(120, 80, 180, 0.1);
}
.sec-title {
  font-size: 13px;
  font-weight: 700;
  color: #0d2922;
}

/* ── Diagnosis Card ── */
.diagnosis-card {
  margin: 12px 16px 0;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(10, 126, 110, 0.07), rgba(10, 126, 110, 0.03));
  border: 1.5px solid rgba(10, 126, 110, 0.14);
  padding: 16px;
}
.diag-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.diag-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.diag-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(10, 126, 110, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
.diag-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #0d2922;
}
.diag-date {
  font-size: 11px;
  color: #9dbdb8;
  font-family: 'DM Sans', sans-serif;
}
.diag-inference-lbl {
  font-size: 10px;
  font-weight: 700;
  color: #0a7e6e;
  text-transform: uppercase;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.diag-item {
  margin-bottom: 10px;
}
.diag-item-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 6px;
}
.diag-priority-badge {
  font-size: 9px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 20px;
  text-transform: uppercase;
}
.badge-primary {
  background: rgba(10, 126, 110, 0.12);
  color: #0a7e6e;
}
.badge-secondary {
  background: rgba(13, 122, 156, 0.12);
  color: #0d7a9c;
}
.diag-item-name {
  font-size: 13px;
  font-weight: 700;
  color: #0d2922;
}
.diag-item-desc {
  font-size: 12px;
  color: #4a7a72;
  line-height: 1.6;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border-left: 3px solid rgba(10, 126, 110, 0.25);
}
.diag-notes {
  background: white;
  border-radius: 12px;
  padding: 10px 13px;
  border: 1px solid rgba(10, 126, 110, 0.1);
  margin-top: 10px;
}
.diag-notes-lbl {
  font-size: 9.5px;
  font-weight: 600;
  color: #9dbdb8;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.diag-notes-txt {
  font-size: 12.5px;
  color: #3a6b62;
  line-height: 1.5;
}
.diag-separator {
  height: 1px;
  background: rgba(10, 126, 110, 0.08);
  margin: 10px 0;
}

/* ── Health Grid ── */
.health-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: rgba(10, 126, 110, 0.06);
}
.health-cell {
  background: white;
  padding: 13px 16px;
}
.hc-lbl {
  font-size: 9.5px;
  font-weight: 600;
  color: #9dbdb8;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.hc-val {
  font-size: 14px;
  font-weight: 700;
  color: #0d2922;
}
.hc-val.accent {
  color: #0a7e6e;
}

/* ── Settings Row ── */
.setting-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  cursor: pointer;
  position: relative;
  border-top: 1px solid rgba(10, 126, 110, 0.06);
}
.setting-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.setting-body {
  flex: 1;
}
.setting-label {
  font-size: 14px;
  font-weight: 600;
  color: #0d2922;
}
.setting-sub {
  font-size: 11.5px;
  color: #8ab5ae;
  margin-top: 2px;
}

/* ── Toggle ── */
.toggle-wrap {
  width: 44px;
  height: 24px;
  position: relative;
  cursor: pointer;
}
.toggle-track {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: rgba(10, 126, 110, 0.15);
  transition: 0.2s;
}
.toggle-track.on {
  background: linear-gradient(135deg, #0c9b80, #0a7e6e);
}
.toggle-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}
.toggle-track.on .toggle-thumb {
  transform: translateX(20px);
}

/* ── Reports Row ── */
.report-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  position: relative;
  border-top: 1px solid rgba(10, 126, 110, 0.06);
}
.report-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ri-pdf {
  background: rgba(231, 76, 60, 0.1);
}
.ri-doc {
  background: rgba(13, 122, 156, 0.1);
}
.ri-xray {
  background: rgba(120, 80, 180, 0.1);
}
.report-body {
  flex: 1;
}
.report-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #0d2922;
}
.report-meta {
  font-size: 11.5px;
  color: #8ab5ae;
}
.dl-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(10, 126, 110, 0.08);
  border: 1px solid rgba(10, 126, 110, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Logout Button ── */
.logout-btn {
  margin: 14px 16px 0;
  width: calc(100% - 32px);
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(231, 76, 60, 0.06);
  border: 1.5px solid rgba(231, 76, 60, 0.15);
  color: #c0392b;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
}

/* ── PIN Modal ── */
.modal-sheet {
  width: 100%;
  max-width: 430px;
  background: white;
  border-radius: 28px 28px 0 0;
  padding: 28px 24px 40px;
}
.modal-handle {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 auto 20px;
}
.modal-title {
  font-size: 19px;
  font-weight: 800;
  color: #0d2922;
  margin-bottom: 6px;
  text-align: center;
}
.modal-sub {
  font-size: 13px;
  color: #8ab5ae;
  text-align: center;
  margin-bottom: 24px;
}
.pin-dots {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-bottom: 28px;
}
.pin-dot {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2.5px solid rgba(10, 126, 110, 0.25);
  transition: 0.2s;
}
.pin-dot.filled {
  background: #0a7e6e;
  border-color: #0a7e6e;
  transform: scale(1.15);
}
.numpad {
  display: grid;
  gap: 10px;
}
.numpad-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.num-btn {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 1.5px dashed rgba(10, 126, 110, 0.12);
  background: white;
  font-size: 22px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.num-btn.del {
  background: rgba(10, 126, 110, 0.06);
}
.modal-cancel {
  margin-top: 18px;
  width: 100%;
  height: 48px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.05);
  color: #6b9e94;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

@keyframes pulseDot {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
}
</style>
