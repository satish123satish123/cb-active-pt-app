<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ TOPBAR ============ -->
      <div class="topbar">
        <button class="back" @click="$router.push('/physio/patients')">←</button>
        <div class="grow">
          <h2 class="font-sora">{{ p.name }}</h2>
          <div class="muted" style="font-size: 12.5px">{{ p.age }}{{ p.sex }} · {{ p.phone }}</div>
        </div>
      </div>

      <!-- ============ CONDITION + PACKAGE ============ -->
      <div class="section">
        <div class="card">
          <span class="badge brand">{{ p.condition }}</span>
          <div v-if="p.package" style="margin-top: 14px">
            <div class="between">
              <strong style="font-size: 14px">{{ p.package.name }}</strong>
              <span class="muted">{{ p.package.used }}/{{ p.package.total }} used</span>
            </div>
            <div class="pkg-bar">
              <i :style="{ width: (p.package.used / p.package.total) * 100 + '%' }"></i>
            </div>
          </div>
          <div v-else class="muted" style="margin-top: 12px">Billing: per-visit</div>
        </div>
      </div>

      <!-- ============ LATEST FEEDBACK ============ -->
      <div v-if="p.feedback" class="section" style="margin-top: 12px">
        <div class="section-title"><h3 class="font-sora">Latest app feedback</h3></div>
        <div class="card" style="background: var(--grad-soft); border-color: #cfeee6">
          <div class="muted">
            Pain <strong style="color: var(--warning)">{{ p.feedback.pain }}/10</strong> · exercises
            felt <strong>{{ p.feedback.difficulty }}</strong> · {{ p.feedback.when }}
          </div>
          <div class="muted" style="margin-top: 4px; font-style: italic">"{{ p.feedback.note }}"</div>
        </div>
      </div>

      <!-- ============ VISIT HISTORY ============ -->
      <div class="section" style="margin-top: 12px">
        <div class="section-title"><h3 class="font-sora">Visit history</h3></div>
        <div v-for="a in history" :key="a.id" class="card">
          <div class="between">
            <div>
              <strong>{{ a.date === todayISO ? 'Today' : fmtDate(a.date) }}, {{ a.time }}</strong>
              <div class="tiny">{{ visitSummary(a) }}</div>
            </div>
            <span class="badge" :class="STATUS[a.status].cls">{{ STATUS[a.status].label }}</span>
          </div>
        </div>
        <div v-if="!history.length" class="card" style="text-align: center; color: var(--text-3)">
          No visits yet.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PATIENTS, APPTS, STATUS, todayISO, fmtDate } from './physioDemoData'

const route = useRoute()
const p = computed(() => PATIENTS[route.params.id] || PATIENTS.p1).value
const history = APPTS.filter((a) => a.pid === p.id)

function visitSummary(a) {
  return a.invoice && a.invoice.items
    ? a.invoice.items.map((it) => it.label.replace(' — package session', '')).join(', ')
    : '—'
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
  --brand-3: #d8f1eb;
  --warning: #c78810;
  --success: #1f8a4d;
  --info: #2563eb;
  --danger: #d9485f;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
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

/* topbar */
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

.section {
  padding: 0 16px;
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
.badge.brand { background: var(--brand-3); color: var(--brand); }
.badge.success { background: #e6f7ed; color: var(--success); }
.badge.warn { background: #fff4dd; color: var(--warning); }
.badge.danger { background: #fde8ec; color: var(--danger); }
.badge.info { background: #e6efff; color: var(--info); }
.badge.pending { background: #efeaff; color: #6d4bff; }
.badge.muted { background: #eef3f4; color: var(--text-2); }

.pkg-bar {
  height: 8px;
  background: #eef4f4;
  border-radius: 99px;
  overflow: hidden;
  margin-top: 8px;
}
.pkg-bar > i {
  display: block;
  height: 100%;
  background: linear-gradient(135deg, #0a7e6e 0%, #109885 100%);
  border-radius: 99px;
}
</style>