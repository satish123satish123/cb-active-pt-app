<template>
  <section class="screen">
    <ScreenHeader title="Payments & Packages" sub="Track dues, sessions, and package balance" />

    <!-- Financial Summary Hero -->
    <div class="section">
      <div class="card " :style="{ background: cardBackground, border: cardBorder, boxShadow: 'var(--shadow-sm)' }">
        <div class="title-row" style="margin-bottom:14px; align-items:flex-start;">
          <div>
            <div class="eyebrow" :style="{ color: eyebrowColor }">Account Summary</div>
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:8px;">
              <span :style="{ width:'34px', height:'34px', borderRadius:'12px', display:'inline-flex', alignItems:'center', justifyContent:'center', background: amountPillBackground, border: amountPillBorder, color: valueAccent, fontSize:'16px', fontWeight:'900' }">{{ balanceIcon }}</span>
              <div class="title" :style="{ color: valueAccent, fontSize:'28px', marginTop:'0' }">{{ balanceLabel }} ₹{{ balanceValue.toLocaleString('en-IN') }}</div>
            </div>
            <div :style="{ color: isAdvance ? '#dff7f1' : (isDue ? 'var(--danger)' : subTextColor), fontSize:'13px', fontWeight: isDue || isAdvance ? '700' : '600', marginTop:'8px' }">{{ balanceMicrocopy }}</div>
          </div>
          <span class="badge" :style="statusBadgeStyle">{{ statusLabel }}</span>
        </div>

        <div style="display:grid; gap:10px;">
          <div :style="{ display:'grid', gridTemplateColumns: hasRefund ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', gap:'10px' }">
            <div :style="{ padding:'12px 14px', borderRadius:'18px', background: isAdvance ? 'rgba(255,255,255,.13)' : '#ffffff', border: isAdvance ? '1px solid rgba(255,255,255,.16)' : '1px solid #e4ecee', boxShadow: isAdvance ? 'none' : '0 6px 16px rgba(16,33,42,.04)' }">
              <div style="display:flex; align-items:center; gap:8px;">
                <span :style="{ width:'30px', height:'30px', borderRadius:'10px', display:'inline-flex', alignItems:'center', justifyContent:'center', background: isAdvance ? 'rgba(255,255,255,.16)' : '#eef6f5', color: isAdvance ? '#fff' : 'var(--brand)', fontSize:'14px', fontWeight:'800' }">↗</span>
                <div style="min-width:0;">
                  <div class="muted sm" :style="{ color: isAdvance ? 'rgba(255,255,255,.72)' : 'var(--text-2)' }">Invoiced</div>
                  <div :style="{ marginTop:'2px', fontSize:'19px', fontWeight:'800', color: cardTextColor, letterSpacing:'-.02em' }">₹{{ paymentSummary.invoiced.toLocaleString('en-IN') }}</div>
                </div>
              </div>
            </div>

            <div :style="{ padding:'12px 14px', borderRadius:'18px', background: isAdvance ? 'rgba(255,255,255,.13)' : '#ffffff', border: isAdvance ? '1px solid rgba(255,255,255,.16)' : '1px solid #e4ecee', boxShadow: isAdvance ? 'none' : '0 6px 16px rgba(16,33,42,.04)' }">
              <div style="display:flex; align-items:center; gap:8px;">
                <span :style="{ width:'30px', height:'30px', borderRadius:'10px', display:'inline-flex', alignItems:'center', justifyContent:'center', background: isAdvance ? 'rgba(255,255,255,.16)' : '#e9f7ef', color: isAdvance ? '#fff' : 'var(--success)', fontSize:'14px', fontWeight:'800' }">✓</span>
                <div style="min-width:0;">
                  <div class="muted sm" :style="{ color: isAdvance ? 'rgba(255,255,255,.72)' : 'var(--text-2)' }">Paid</div>
                  <div :style="{ marginTop:'2px', fontSize:'19px', fontWeight:'800', color: cardTextColor, letterSpacing:'-.02em' }">₹{{ paymentSummary.paid.toLocaleString('en-IN') }}</div>
                </div>
              </div>
            </div>

            <div v-if="hasRefund" :style="{ padding:'12px 14px', borderRadius:'18px', background: isAdvance ? 'rgba(255,255,255,.13)' : '#ffffff', border: isAdvance ? '1px solid rgba(255,255,255,.16)' : '1px solid #e4ecee', boxShadow: isAdvance ? 'none' : '0 6px 16px rgba(16,33,42,.04)' }">
              <div style="display:flex; align-items:center; gap:8px;">
                <span :style="{ width:'30px', height:'30px', borderRadius:'10px', display:'inline-flex', alignItems:'center', justifyContent:'center', background: isAdvance ? 'rgba(255,255,255,.16)' : '#fff4e7', color: isAdvance ? '#fff' : '#c78810', fontSize:'14px', fontWeight:'800' }">↺</span>
                <div style="min-width:0;">
                  <div class="muted sm" :style="{ color: isAdvance ? 'rgba(255,255,255,.72)' : 'var(--text-2)' }">Refunded</div>
                  <div :style="{ marginTop:'2px', fontSize:'19px', fontWeight:'800', color: cardTextColor, letterSpacing:'-.02em' }">₹{{ paymentSummary.refunded.toLocaleString('en-IN') }}</div>
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <div :style="{ display:'inline-flex', alignItems:'center', gap:'8px', minHeight:'34px', padding:'0 12px', borderRadius:'999px', background: isAdvance ? 'rgba(255,255,255,.12)' : '#f6faf9', border: isAdvance ? '1px solid rgba(255,255,255,.14)' : '1px solid #e4ecee', color: isAdvance ? 'rgba(255,255,255,.92)' : 'var(--text)', fontSize:'12px', fontWeight:'700' }">
              <span :style="{ width:'8px', height:'8px', borderRadius:'50%', background: isAdvance ? '#bff3ea' : 'var(--brand)' }"></span>
              Net collected ₹{{ (paymentSummary.paid - paymentSummary.refunded).toLocaleString('en-IN') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Packages -->
    <div class="section">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; padding:0 4px;">
        <div>
          <div class="eyebrow" style="margin:0;">Active Packages</div>
          <div class="muted sm">Currently available sessions</div>
        </div>
        <span class="badge brand">2 Active</span>
      </div>
      
      <div style="display:grid; gap:12px;">
        <!-- Package 1 -->
        <div class="card soft">
          <div class="split" style="margin-bottom:10px;">
            <div>
              <div style="font-size:16px; font-weight:800; letter-spacing:-.01em;">8 Sessions Basic Physiotherapy</div>
              <div class="muted" style="margin-top:4px;">Valid until May 28, 2026</div>
            </div>
            <span class="badge brand">Active</span>
          </div>
          
          <div class="progress-wrap" style="margin-top:12px;">
            <div class="split">
              <span class="muted sm">Session consumption</span>
              <strong style="color:var(--brand);">3 of 8 used</strong>
            </div>
            <div class="progress-rail" style="margin-top:8px;">
              <div class="progress-fill" style="width:37.5%; background:var(--grad);"></div>
            </div>
          </div>

          <div style="margin-top:14px; padding-top:14px; border-top:1px solid var(--line);">
            <div class="split">
              <div>
                <div class="muted sm">Package Value</div>
                <div style="font-weight:800; font-size:15px; margin-top:2px;">₹7,000</div>
              </div>
              <div>
                <div class="muted sm">Sessions Remaining</div>
                <div style="font-weight:800; font-size:15px; margin-top:2px; color:var(--brand);">5 sessions</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Package 2 (Expiring Soon) -->
        <div class="card soft" style="border:1.5px solid #fff4dd;">
          <div class="split" style="margin-bottom:10px;">
            <div>
              <div style="font-size:16px; font-weight:800; letter-spacing:-.01em;">4 Sessions Advanced Treatment</div>
              <div style="margin-top:4px; display:flex; align-items:center; gap:8px;">
                <span class="muted sm">Valid until April 22, 2026</span>
                <span class="badge warn" style="font-size:10px; min-height:22px;">⚠️ Expiring Soon</span>
              </div>
            </div>
            <span class="badge brand">Active</span>
          </div>
          
          <div class="progress-wrap" style="margin-top:12px;">
            <div class="split">
              <span class="muted sm">Session consumption</span>
              <strong style="color:var(--warning);">2 of 4 used</strong>
            </div>
            <div class="progress-rail" style="margin-top:8px;">
              <div class="progress-fill" style="width:50%; background:linear-gradient(135deg, #c78810 0%, #d69520 100%);"></div>
            </div>
          </div>

          <div style="margin-top:14px; padding-top:14px; border-top:1px solid var(--line);">
            <div class="split">
              <div>
                <div class="muted sm">Package Value</div>
                <div style="font-weight:800; font-size:15px; margin-top:2px;">₹4,500</div>
              </div>
              <div>
                <div class="muted sm">Sessions Remaining</div>
                <div style="font-weight:800; font-size:15px; margin-top:2px; color:var(--warning);">2 sessions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="section">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; padding:0 4px;">
        <div>
          <div class="eyebrow" style="margin:0;">Transaction History</div>
          <div class="muted sm">Payments made by patient and all invoice records</div>
        </div>
      </div>

      <div class="segment" style="margin-bottom:12px;">
        <button :class="{ active: transactionFilter === 'all' }" @click="setTransactionFilter('all')">All</button>
        <button :class="{ active: transactionFilter === 'payments' }" @click="setTransactionFilter('payments')">Payments</button>
        <button :class="{ active: transactionFilter === 'invoices' }" @click="setTransactionFilter('invoices')">Invoices</button>
      </div>

      <div class="card">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; padding-bottom:12px; border-bottom:1px solid var(--line);">
          <div>
            <div style="font-size:16px; font-weight:800; letter-spacing:-.02em;">
              {{ transactionFilter === 'payments' ? 'Payments' : (transactionFilter === 'invoices' ? 'Invoices' : 'Payments & Invoices') }}
            </div>
            <div class="muted sm" style="margin-top:4px;">
              {{ transactionFilter === 'payments'
                ? 'Package, session, and advance payments made by the patient'
                : (transactionFilter === 'invoices'
                  ? 'Session, package, forfeit, and refund invoices'
                  : 'Combined financial activity across payments and invoices') }}
            </div>
          </div>
          <span class="badge brand">{{ visibleTransactions.length }} records</span>
        </div>

        <div class="list" style="gap:0;">
          <div v-for="(item, index) in visibleTransactions" :key="index" class="list-item" :style="{ border:'none', borderBottom: index === visibleTransactions.length - 1 ? 'none' : '1px solid var(--line)', borderRadius:'0', boxShadow:'none', padding:'14px 0', background:'transparent' }">
            <div class="split" style="align-items:flex-start; gap:14px;">
              <div style="display:flex; align-items:flex-start; gap:12px; min-width:0; flex:1;">
                <div :style="{ width:'44px', height:'44px', borderRadius:'12px', background: item.iconBg, color: item.iconColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:'800', flexShrink:'0' }">{{ item.icon }}</div>
                <div style="min-width:0;">
                  <div style="font-size:15px; font-weight:800; line-height:1.35;">{{ item.title }}</div>
                  <div class="muted" style="margin-top:3px;">{{ item.subtitle }}</div>
                  <div class="muted sm" style="margin-top:4px;">{{ item.meta }}</div>
                </div>
              </div>
              <div style="text-align:right; flex-shrink:0;">
                <div style="font-weight:800; font-size:16px;" :style="{ color: item.amountColor }">{{ item.amount }}</div>
                <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:6px; flex-wrap:wrap;">
                  <span class="badge" :class="item.statusClass">{{ item.status }}</span>
                  <button v-if="(transactionFilter === 'invoices' || transactionFilter === 'all') && item.title.includes('Invoice')" class="btn secondary small" style="font-size:12px;" @click="openInvoicePdf()">⤓ Invoice</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historical Packages (Collapsible) -->
    <div class="section">
      <div class="card soft" style="cursor:pointer;" @click="toggleHistorical()">
        <div class="split">
          <div>
            <div style="font-size:16px; font-weight:800;">Historical Packages</div>
            <div class="muted">View completed and expired packages</div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="badge" style="background:var(--bg-soft); color:var(--text-2);">3 Completed</span>
            <span class="toggle-icon" style="font-size:18px; color:var(--text-3);">{{ isHistoricalOpen ? '▼' : '▶' }}</span>
          </div>
        </div>

        <div class="historical-content" v-show="isHistoricalOpen" style="margin-top:16px; padding-top:16px; border-top:1px solid var(--line);">
          <div style="display:grid; gap:10px;">
            <!-- Historical Package 1 -->
            <div style="padding:12px; border-radius:12px; background:#fff; border:1px solid var(--line);">
              <div class="split">
                <div>
                  <div style="font-size:14px; font-weight:800;">6 Sessions Post-Surgery Rehab</div>
                  <div class="muted sm" style="margin-top:4px;">Jan 15 - Feb 28, 2026</div>
                </div>
                <span class="badge success">Completed</span>
              </div>
              <div class="split" style="margin-top:10px;">
                <span class="muted sm">6 of 6 sessions used</span>
                <span style="font-weight:700; font-size:13px;">₹6,500</span>
              </div>
            </div>

            <!-- Historical Package 2 -->
            <div style="padding:12px; border-radius:12px; background:#fff; border:1px solid var(--line);">
              <div class="split">
                <div>
                  <div style="font-size:14px; font-weight:800;">10 Sessions Basic Physiotherapy</div>
                  <div class="muted sm" style="margin-top:4px;">Nov 10 - Dec 20, 2025</div>
                </div>
                <span class="badge success">Completed</span>
              </div>
              <div class="split" style="margin-top:10px;">
                <span class="muted sm">10 of 10 sessions used</span>
                <span style="font-weight:700; font-size:13px;">₹8,000</span>
              </div>
            </div>

            <!-- Historical Package 3 - Expired with refund -->
            <div style="padding:12px; border-radius:12px; background:#fff; border:1px solid var(--line);">
              <div class="split">
                <div>
                  <div style="font-size:14px; font-weight:800;">4 Sessions Dry Needling</div>
                  <div class="muted sm" style="margin-top:4px;">Sep 5 - Oct 10, 2025 • Expired</div>
                </div>
                <span class="badge" :style="{ background:'#f5f5f5', color:'#666' }">Expired</span>
              </div>
              <div class="split" style="margin-top:10px;">
                <span class="muted sm">1 of 4 sessions used • ₹2,250 refunded</span>
                <span style="font-weight:700; font-size:13px;">₹3,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ScreenHeader from 'src/components/ScreenHeader.vue'

const transactionFilter = ref('all')

const paymentSummary = {
  invoiced: 11500,
  paid: 10500,
  refunded: 1000
}

const netBalance = computed(() => paymentSummary.paid - paymentSummary.invoiced - paymentSummary.refunded)
const hasRefund = computed(() => paymentSummary.refunded > 0)
const isDue = computed(() => netBalance.value < 0)
const isAdvance = computed(() => netBalance.value > 0)

const balanceLabel = computed(() => isDue.value ? 'Due' : (isAdvance.value ? 'Advance' : 'Settled'))
const statusLabel = computed(() => isDue.value ? 'Payment Pending' : (isAdvance.value ? 'Advance Available' : 'All Settled'))
const balanceMicrocopy = computed(() => isDue.value ? 'You owe this amount' : (isAdvance.value ? 'Advance balance available' : 'No pending balance'))
const balanceIcon = computed(() => isDue.value ? '↓' : (isAdvance.value ? '↑' : '•'))
const balanceValue = computed(() => Math.abs(netBalance.value))

const cardBackground = computed(() => isAdvance.value ? 'var(--grad)' : 'linear-gradient(135deg, #fbfdfd 0%, #f2f7f7 100%)')
const cardBorder = computed(() => '1px solid rgba(220,231,234,0.85)')
const cardTextColor = computed(() => isAdvance.value ? '#fff' : 'var(--text)')
const eyebrowColor = computed(() => isAdvance.value ? 'rgba(255,255,255,.72)' : 'var(--text-3)')
const subTextColor = computed(() => isAdvance.value ? 'rgba(255,255,255,.84)' : 'var(--text-2)')
const valueAccent = computed(() => isDue.value ? 'var(--danger)' : (isAdvance.value ? '#1f8a4d' : 'var(--success)'))

const amountPillBackground = computed(() => isDue.value ? 'rgba(217,72,95,.10)' : (isAdvance.value ? 'rgba(31,138,77,.14)' : '#eef8f3'))
const amountPillBorder = computed(() => isDue.value ? '1px solid rgba(217,72,95,.16)' : '1px solid rgba(31,138,77,.16)')
const statusBadgeStyle = computed(() => isDue.value 
  ? 'background:#fde8ec; color:var(--danger); border:1px solid #f4cfd8;' 
  : (isAdvance.value 
    ? 'background:rgba(255,255,255,.16); color:#fff; border:1.5px solid rgba(255,255,255,.3);' 
    : 'background:#edf6f4; color:var(--success); border:1px solid #d7e8e2;'))

const paymentEntries = [
  {
    title: 'Package Payment',
    subtitle: '8 Sessions Basic Physiotherapy',
    meta: 'March 28, 2026 • UPI',
    amount: '₹7,000',
    status: 'Paid',
    icon: '₹',
    iconBg: '#e6f7ed',
    iconColor: 'var(--success)',
    amountColor: 'var(--success)',
    statusClass: 'success'
  },
  {
    title: 'Session Payment',
    subtitle: 'Session 2 - Basic Treatment',
    meta: 'April 3, 2026 • Card',
    amount: '₹1,500',
    status: 'Paid',
    icon: '₹',
    iconBg: '#e6f7ed',
    iconColor: 'var(--success)',
    amountColor: 'var(--success)',
    statusClass: 'success'
  },
  {
    title: 'Advance Payment',
    subtitle: 'Advance kept on account for future sessions',
    meta: 'April 5, 2026 • Cash',
    amount: '₹2,000',
    status: 'Paid',
    icon: '₹',
    iconBg: '#e6f7ed',
    iconColor: 'var(--success)',
    amountColor: 'var(--success)',
    statusClass: 'success'
  }
]

const invoiceEntries = [
  {
    title: 'Package Invoice #2819',
    subtitle: '8 Sessions Basic Physiotherapy',
    meta: 'March 28, 2026 • Package Invoice',
    amount: '₹7,000',
    status: 'Issued',
    icon: '🧾',
    iconBg: '#edf9f6',
    iconColor: 'var(--brand)',
    amountColor: 'var(--brand)',
    statusClass: 'brand'
  },
  {
    title: 'Session Invoice #2847',
    subtitle: 'Session 1 - Shoulder Assessment',
    meta: 'March 30, 2026 • Session Invoice',
    amount: '₹2,000',
    status: 'Issued',
    icon: '🧾',
    iconBg: '#edf9f6',
    iconColor: 'var(--brand)',
    amountColor: 'var(--brand)',
    statusClass: 'brand'
  },
  {
    title: 'Session Invoice #2891',
    subtitle: 'Session 2 - Basic Treatment',
    meta: 'April 3, 2026 • Session Invoice',
    amount: '₹1,500',
    status: 'Issued',
    icon: '🧾',
    iconBg: '#edf9f6',
    iconColor: 'var(--brand)',
    amountColor: 'var(--brand)',
    statusClass: 'brand'
  },
  {
    title: 'Forfeit Invoice #2910',
    subtitle: 'Late cancellation charge',
    meta: 'April 6, 2026 • Forfeit Invoice',
    amount: '₹1,000',
    status: 'Issued',
    icon: '⚠️',
    iconBg: '#fff4dd',
    iconColor: 'var(--warning)',
    amountColor: 'var(--warning)',
    statusClass: 'warn'
  },
  {
    title: 'Refund Invoice #2917',
    subtitle: 'Refund processed for one unused session',
    meta: 'April 8, 2026 • Refund Invoice',
    amount: '₹1,000',
    status: 'Refunded',
    icon: '↩',
    iconBg: '#fde8ec',
    iconColor: 'var(--danger)',
    amountColor: 'var(--danger)',
    statusClass: 'danger'
  }
]

const visibleTransactions = computed(() => {
  if (transactionFilter.value === 'payments') return paymentEntries
  if (transactionFilter.value === 'invoices') return invoiceEntries
  return [...paymentEntries, ...invoiceEntries]
})

const setTransactionFilter = (filter) => {
  transactionFilter.value = filter
}

const isHistoricalOpen = ref(false)
const toggleHistorical = () => {
  isHistoricalOpen.value = !isHistoricalOpen.value
}

const openInvoicePdf = () => {
  // Mock logic for opening PDF
  console.log('Opening invoice PDF...')
}
</script>
