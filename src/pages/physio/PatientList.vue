<template>
  <div class="ph-page">
    <div class="ph-screen">
      <!-- ============ HERO ============ -->
      <div class="hero" style="padding-bottom: 54px">
        <div class="hero-row">
          <div>
            <p class="subtle">Your caseload</p>
            <h2 class="font-sora">Patients</h2>
          </div>
          <div class="avatar">{{ physio.initials }}</div>
        </div>
      </div>

      <!-- ============ PATIENT CARDS ============ -->
      <div class="stack section">
        <div
          v-for="p in patientList"
          :key="p.id"
          class="card ph-qcard"
          @click="$router.push(`/physio/patients/${p.id}`)"
        >
          <div class="ph-qavatar">{{ initials(p.name) }}</div>
          <div class="grow">
            <div style="font-weight: 800">
              {{ p.name }} <span class="tiny">· {{ p.age }}{{ p.sex }}</span>
            </div>
            <div class="muted" style="font-size: 12.5px">{{ p.condition }}</div>
            <div class="chips">
              <span class="chip">
                {{ p.package ? `${p.package.used}/${p.package.total} sessions` : 'Per-visit billing' }}
              </span>
              <span
                v-if="p.feedback"
                class="chip"
                style="background: #fff4dd; color: var(--warning); border-color: #ffe6b0"
              >
                Pain {{ p.feedback.pain }}/10
              </span>
            </div>
          </div>
          <div style="align-self: center; color: var(--text-3)">›</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PHYSIO, PATIENTS, initials } from './physioDemoData'

const physio = PHYSIO
const patientList = Object.values(PATIENTS)
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
  --warning: #c78810;
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
.ph-qcard {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
}
.ph-qavatar {
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
</style>