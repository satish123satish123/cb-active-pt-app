<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ HERO ============ -->
      <div class="hero" style="padding-bottom: 54px">
        <div class="hero-row">
          <div>
            <p class="subtle">{{ physio.designation }}</p>
            <h2 class="font-sora">{{ physio.name }}</h2>
          </div>
          <div class="avatar">{{ physio.initials }}</div>
        </div>
        <p class="subtle" style="margin-top: 8px">{{ physio.clinic }}</p>
      </div>

      <div class="stack section">
        <!-- ============ ATTENDANCE ============ -->
        <div class="card">
          <div class="between">
            <strong>Attendance</strong>
            <span v-if="checkedOutAt" class="badge muted">Checked out {{ ampm(checkedOutAt) }}</span>
            <span v-else-if="checkedInAt" class="badge success">On shift since {{ ampm(checkedInAt) }}</span>
            <span v-else class="badge muted">Not checked in</span>
          </div>
          <div class="tiny" style="margin-top: 8px">Today's shift: {{ shiftStr }}</div>
          <div v-if="!checkedOutAt" class="row" style="margin-top: 12px; gap: 10px">
            <button v-if="checkedInAt" class="btn danger grow" @click="checkOut">Check out</button>
            <button v-else class="btn primary grow" @click="checkIn">Check in for shift</button>
          </div>
        </div>

        <!-- ============ ACCOUNT ============ -->
        <div class="card">
          <strong>Account</strong>
          <div class="muted" style="margin-top: 4px">Sign out of the physio workspace.</div>
          <button class="btn ghost full" style="margin-top: 12px" @click="logout">Log out</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'
import { PHYSIO, ampm } from './physioDemoData'

const router = useRouter()
const authStore = useAuthStore()

const physio = PHYSIO
const shiftStr = '9:00 AM – 6:00 PM'

/* attendance (UI only — API later) */
const checkedInAt = ref(null)
const checkedOutAt = ref(null)
function nowHM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
function checkIn() {
  checkedInAt.value = nowHM()
}
function checkOut() {
  checkedOutAt.value = nowHM()
}

async function logout() {
  await authStore.logout()
  router.push('/login')
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
  --danger: #d9485f;
  --success: #1f8a4d;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
  --shadow-md: 0 14px 34px rgba(16, 33, 42, 0.1);
  --grad: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);

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
.hero h2 {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.25;
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

.stack {
  margin-top: -52px;
  position: relative;
  z-index: 4;
}
.section {
  padding: 0 16px;
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
.badge.success { background: #e6f7ed; color: var(--success); }
.badge.muted { background: #eef3f4; color: var(--text-2); }

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
  background: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);
  color: #fff;
  box-shadow: var(--shadow-sm);
}
.btn.danger {
  background: #fff0f2;
  color: var(--danger);
}
.btn.ghost {
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--line);
}
.btn.full {
  width: 100%;
}
</style>