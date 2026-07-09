<template>
  <div class="ph-page">
    <div class="ph-screen" style="padding-bottom: 120px">
      <!-- ============ TOPBAR ============ -->
      <div class="topbar">
        <button class="back" @click="$router.push('/physio')">←</button>
        <div class="grow">
          <h2 class="font-sora">Billing</h2>
          <div class="muted" style="font-size: 12.5px">{{ p.name }} · {{ fmtDate(todayISO) }}</div>
        </div>
      </div>

      <PhysioStepper :step="2" />

      <div class="section" style="margin-top: 8px">
        <p class="muted" style="margin: 0 2px">
          Tap the treatment(s) given in this session.
          <template v-if="p.package">
            The package treatment is taken from their package automatically while sessions last.
          </template>
        </p>
      </div>

      <!-- ============ PACKAGE CARD ============ -->
      <div v-if="p.package" class="section" style="margin-top: 6px">
        <div
          class="card"
          :style="inv.pkgDeduct > 0 ? 'background: var(--grad-soft); border-color: #cfeee6' : ''"
        >
          <div class="between">
            <strong style="font-size: 14px">{{ p.package.name }}</strong>
            <span v-if="inv.pkgDeduct > 0" class="badge brand">Using 1 session</span>
            <span v-else class="badge muted">Not used today</span>
          </div>
          <div class="muted" style="margin-top: 6px">
            {{ p.package.used + inv.pkgDeduct }} of {{ p.package.total }} used ·
            <strong>{{ p.package.total - p.package.used - inv.pkgDeduct }} left</strong>
          </div>
          <div class="pkg-bar">
            <i :style="{ width: ((p.package.used + inv.pkgDeduct) / p.package.total) * 100 + '%' }"></i>
          </div>
        </div>
      </div>

      <!-- ============ TREATMENT GIVEN ============ -->
      <div class="section" style="margin-top: 12px">
        <div class="section-title"><h3 class="font-sora">Treatment given</h3></div>
        <div class="card">
          <div
            v-for="t in TREATMENTS"
            :key="t.id"
            class="pick"
            :class="{ on: selected.has(t.id) }"
            style="margin-bottom: 10px"
            @click="toggle(t.id)"
          >
            <div class="check" :class="{ on: selected.has(t.id) }">
              <template v-if="selected.has(t.id)">✓</template>
              <span v-else style="color: var(--text-3)">+</span>
            </div>
            <div class="grow">
              <div style="font-weight: 700; font-size: 14px">{{ t.name }}</div>
              <div v-if="pkgMatches(p, t.id)" class="tiny" style="color: var(--brand)">
                In package — comes from package{{ selected.has(t.id) ? ' (1 session)' : '' }}
              </div>
            </div>
            <div class="muted">
              <span v-if="selected.has(t.id) && pkgMatches(p, t.id)" style="color: var(--brand); font-weight: 700">Included</span>
              <template v-else>{{ rupee(t.price) }}</template>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ DISCOUNT ============ -->
      <div v-if="inv.subtotal > 0" class="section" style="margin-top: 12px">
        <div class="section-title"><h3 class="font-sora">Discount (optional)</h3></div>
        <div class="card">
          <div class="row" style="gap: 8px">
            <div class="seg" style="flex: none; width: 120px">
              <button :class="{ active: d.discType === 'amt' }" @click="d.discType = 'amt'">₹</button>
              <button :class="{ active: d.discType === 'pct' }" @click="d.discType = 'pct'">%</button>
            </div>
            <input v-model.number="d.discount" class="input grow" type="number" min="0" placeholder="0" />
          </div>
          <p class="tiny" style="margin-top: 8px">
            Applies to charged items only — packages are never discounted.
          </p>
        </div>
      </div>

      <!-- ============ BILL ============ -->
      <div class="section" style="margin-top: 12px">
        <div class="section-title"><h3 class="font-sora">Bill</h3></div>
        <div class="card">
          <template v-if="inv.items.length">
            <div v-for="(it, i) in inv.items" :key="i" class="inv-row">
              <span>{{ it.label }}</span>
              <strong>{{ it.pkg ? 'Included' : rupee(it.amt) }}</strong>
            </div>
          </template>
          <div v-else class="muted" style="text-align: center; padding: 8px 0">
            No treatment selected yet.
          </div>
          <div v-if="inv.discount > 0" class="inv-row">
            <span style="color: var(--success)">Discount{{ d.discType === 'pct' ? ` (${d.discount}%)` : '' }}</span>
            <strong style="color: var(--success)">− {{ rupee(inv.discount) }}</strong>
          </div>
          <div class="inv-total"><span>To collect at counter</span><span>{{ rupee(inv.total) }}</span></div>
          <p v-if="inv.items.length && inv.total === 0" class="tiny" style="margin-top: 10px">
            Fully covered by package — nothing to collect today.
          </p>
        </div>
      </div>

      <!-- ============ COUNTER NOTE ============ -->
      <div class="section" style="margin-top: 12px">
        <div class="card" style="background: #fff4dd; border-color: #ffe6b0">
          <strong style="font-size: 13px">💳 Payment is taken at the counter</strong>
          <div class="muted" style="margin-top: 4px">
            You're only generating the bill — reception collects and marks it paid.
          </div>
        </div>
      </div>
    </div>

    <!-- ============ STICKY FOOT ============ -->
    <div class="sticky-foot">
      <button
        class="btn primary full"
        :disabled="!inv.items.length"
        :style="inv.items.length ? '' : 'opacity:.45'"
        @click="generateBill"
      >
        Generate bill & go to follow-up →
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PhysioStepper from './PhysioStepper.vue'
import {
  getAppt, getPatient, TREATMENTS, invDraft, pkgMatches, computeInvoice,
  rupee, fmtDate, todayISO,
} from './physioDemoData'

const route = useRoute()
const router = useRouter()

const a = getAppt(route.params.id) || getAppt('a1')
const p = getPatient(a.pid)
const d = invDraft(a)

const inv = computed(() => computeInvoice(a))
const selected = computed(() => new Set(d.lines.map((l) => l.txId)))

function toggle(txId) {
  const i = d.lines.findIndex((l) => l.txId === txId)
  if (i >= 0) d.lines.splice(i, 1)
  else d.lines.push({ txId })
}

function generateBill() {
  if (!inv.value.items.length) return
  const result = { ...inv.value, status: inv.value.total === 0 && inv.value.pkgDeduct > 0 ? 'package' : 'pending' }
  a.invoice = result
  if (inv.value.pkgDeduct > 0 && p.package) p.package.used += inv.value.pkgDeduct
  a.status = result.status === 'package' ? 'paid' : 'invoiced'
  router.push(`/physio/followup/${a.id}`)
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
  --brand-2: #0f9886;
  --brand-3: #d8f1eb;
  --warning: #c78810;
  --success: #1f8a4d;
  --shadow-sm: 0 6px 16px rgba(16, 33, 42, 0.06);
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
  animation: ph-fade 0.25s ease;
}
@keyframes ph-fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

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
.topbar h2 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
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

.section { padding: 0 16px; }
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 18px 4px 10px;
}
.section-title h3 { margin: 0; font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
.row { display: flex; align-items: center; gap: 12px; }
.between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.grow { flex: 1; }
.muted { color: var(--text-2); font-size: 13px; }
.tiny { color: var(--text-3); font-size: 12px; }

.card {
  background: var(--card);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  padding: 16px;
  border: 1px solid rgba(220, 231, 234, 0.85);
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
.badge.muted { background: #eef3f4; color: var(--text-2); }

.pick {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  cursor: pointer;
  background: #fff;
  transition: 0.15s;
}
.pick.on { border-color: var(--brand-2); background: var(--grad-soft); }
.check {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 2px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  flex: none;
  background: #fff;
}
.check.on { background: var(--brand); border-color: var(--brand); }

.seg {
  display: flex;
  gap: 6px;
  background: #eef4f4;
  padding: 5px;
  border-radius: 14px;
}
.seg button {
  flex: 1;
  border: none;
  background: transparent;
  border-radius: 10px;
  min-height: 38px;
  font-weight: 800;
  font-size: 13px;
  color: var(--text-2);
  cursor: pointer;
}
.seg button.active {
  background: #fff;
  color: var(--brand);
  box-shadow: var(--shadow-sm);
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
.input:focus {
  border-color: var(--brand-2);
  box-shadow: 0 0 0 3px rgba(15, 152, 134, 0.12);
}

.inv-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 0;
  border-bottom: 1px dashed var(--line);
}
.inv-row:last-of-type { border-bottom: none; }
.inv-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 6px;
  border-top: 2px solid var(--line);
  font-weight: 800;
  font-size: 18px;
}

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
  background: var(--grad);
  border-radius: 99px;
}

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
.btn:active { transform: scale(0.985); }
.btn.primary { background: var(--grad); color: #fff; box-shadow: var(--shadow-sm); }
.btn.full { width: 100%; }

.sticky-foot {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100%;
  max-width: 460px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--line);
  z-index: 25;
}
</style>