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
                  <div :style="{ marginTop:'2px', fontSize:'19px', fontWeight:'800', color: cardTextColor, letterSpacing:'-.02em' }">₹{{ (paymentSummary.invoiced || 0).toLocaleString('en-IN') }}</div>
                </div>
              </div>
            </div>

            <div :style="{ padding:'12px 14px', borderRadius:'18px', background: isAdvance ? 'rgba(255,255,255,.13)' : '#ffffff', border: isAdvance ? '1px solid rgba(255,255,255,.16)' : '1px solid #e4ecee', boxShadow: isAdvance ? 'none' : '0 6px 16px rgba(16,33,42,.04)' }">
              <div style="display:flex; align-items:center; gap:8px;">
                <span :style="{ width:'30px', height:'30px', borderRadius:'10px', display:'inline-flex', alignItems:'center', justifyContent:'center', background: isAdvance ? 'rgba(255,255,255,.16)' : '#e9f7ef', color: isAdvance ? '#fff' : 'var(--success)', fontSize:'14px', fontWeight:'800' }">✓</span>
                <div style="min-width:0;">
                  <div class="muted sm" :style="{ color: isAdvance ? 'rgba(255,255,255,.72)' : 'var(--text-2)' }">Paid</div>
                  <div :style="{ marginTop:'2px', fontSize:'19px', fontWeight:'800', color: cardTextColor, letterSpacing:'-.02em' }">₹{{ (paymentSummary.paid || 0).toLocaleString('en-IN') }}</div>
                </div>
              </div>
            </div>

            <div v-if="hasRefund" :style="{ padding:'12px 14px', borderRadius:'18px', background: isAdvance ? 'rgba(255,255,255,.13)' : '#ffffff', border: isAdvance ? '1px solid rgba(255,255,255,.16)' : '1px solid #e4ecee', boxShadow: isAdvance ? 'none' : '0 6px 16px rgba(16,33,42,.04)' }">
              <div style="display:flex; align-items:center; gap:8px;">
                <span :style="{ width:'30px', height:'30px', borderRadius:'10px', display:'inline-flex', alignItems:'center', justifyContent:'center', background: isAdvance ? 'rgba(255,255,255,.16)' : '#fff4e7', color: isAdvance ? '#fff' : '#c78810', fontSize:'14px', fontWeight:'800' }">↺</span>
                <div style="min-width:0;">
                  <div class="muted sm" :style="{ color: isAdvance ? 'rgba(255,255,255,.72)' : 'var(--text-2)' }">Refunded</div>
                  <div :style="{ marginTop:'2px', fontSize:'19px', fontWeight:'800', color: cardTextColor, letterSpacing:'-.02em' }">₹{{ (paymentSummary.refunded || 0).toLocaleString('en-IN') }}</div>
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <div :style="{ display:'inline-flex', alignItems:'center', gap:'8px', minHeight:'34px', padding:'0 12px', borderRadius:'999px', background: isAdvance ? 'rgba(255,255,255,.12)' : '#f6faf9', border: isAdvance ? '1px solid rgba(255,255,255,.14)' : '1px solid #e4ecee', color: isAdvance ? 'rgba(255,255,255,.92)' : 'var(--text)', fontSize:'12px', fontWeight:'700' }">
              <span :style="{ width:'8px', height:'8px', borderRadius:'50%', background: isAdvance ? '#bff3ea' : 'var(--brand)' }"></span>
              Net collected ₹{{ (paymentSummary.net_collected || 0).toLocaleString('en-IN') }}
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
        <span class="badge brand">{{ activePackages.length }} Active</span>
      </div>
      
      <div style="display:grid; gap:12px;">
        <div v-for="(pkg, i) in activePackages" :key="'active-'+i" class="card soft">
          <div class="split" style="margin-bottom:10px;">
            <div>
              <div style="font-size:16px; font-weight:800; letter-spacing:-.01em;">{{ pkg.package_name }}</div>
              <div class="muted" style="margin-top:4px;">Valid until {{ pkg.validity }}</div>
            </div>
            <span class="badge brand">Active</span>
          </div>
          
          <div v-if="pkg.total_session" class="progress-wrap" style="margin-top:12px;">
            <div class="split">
              <span class="muted sm">Session consumption</span>
              <strong style="color:var(--brand);">{{ pkg.total_session - pkg.sessions_left }} of {{ pkg.total_session }} used</strong>
            </div>
            <div class="progress-rail" style="margin-top:8px;">
              <div class="progress-fill" :style="{ width: `${((pkg.total_session - pkg.sessions_left) / pkg.total_session) * 100}%`, background: 'var(--grad)' }"></div>
            </div>
          </div>

          <div style="margin-top:14px; padding-top:14px; border-top:1px solid var(--line);">
            <div class="split">
              <div>
                <div class="muted sm">Value Per Session</div>
                <div style="font-weight:800; font-size:15px; margin-top:2px;">₹{{ Math.round(pkg.charges_per_session || 0).toLocaleString('en-IN') }}</div>
              </div>
              <div>
                <div class="muted sm">Sessions Remaining</div>
                <div style="font-weight:800; font-size:15px; margin-top:2px; color:var(--brand);">{{ pkg.sessions_left }} sessions</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activePackages.length === 0" class="muted text-center" style="padding:20px; background:#f9fbfb; border-radius:12px;">
          No active packages
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
                  <button v-if="(transactionFilter === 'invoices' || transactionFilter === 'all') && item.link" class="btn secondary small" style="font-size:12px;" @click="openInvoicePdf(item.link)">⤓ Invoice</button>
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
            <span class="badge" style="background:var(--bg-soft); color:var(--text-2);">{{ historicalPackages.length }} Completed</span>
            <span class="toggle-icon" style="font-size:18px; color:var(--text-3);">{{ isHistoricalOpen ? '▼' : '▶' }}</span>
          </div>
        </div>

        <div class="historical-content" v-show="isHistoricalOpen" style="margin-top:16px; padding-top:16px; border-top:1px solid var(--line);">
          <div style="display:grid; gap:10px;">
            <div v-for="(pkg, i) in historicalPackages" :key="'hist-'+i" style="padding:12px; border-radius:12px; background:#fff; border:1px solid var(--line);">
              <div class="split">
                <div>
                  <div style="font-size:14px; font-weight:800;">{{ pkg.package_name }}</div>
                  <div class="muted sm" style="margin-top:4px;">Valid until {{ pkg.validity }}</div>
                </div>
                <span class="badge success">Completed</span>
              </div>
              <div class="split" style="margin-top:10px;">
                <span class="muted sm">{{ pkg.sessions_left }} sessions left</span>
                <span style="font-weight:700; font-size:13px;">₹{{ Math.round(pkg.charges_per_session || 0).toLocaleString('en-IN') }} per session</span>
              </div>
            </div>
            <div v-if="historicalPackages.length === 0" class="muted text-center sm" style="padding:10px;">
              No historical packages
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/authStore'
import ScreenHeader from 'src/components/ScreenHeader.vue'

const authStore = useAuthStore()
const transactionFilter = ref('all')
const loading = ref(true)

const paymentSummary = ref({
  invoiced: 0,
  paid: 0,
  refunded: 0,
  net_due_advance: 0,
  net_collected: 0
})

const activePackages = ref([])
const historicalPackages = ref([])
const paymentEntries = ref([])
const invoiceEntries = ref([])

const fetchFinancialDetails = async () => {
  loading.value = true
  try {
    const patientId = authStore.user?.patient
    const hospitalId = authStore.user?.hospital_id || authStore.user?.network_id || ''

    const response = await api.post('getFinancialDetails', {
      patient_id: patientId,
      hospital_id: hospitalId
    })

    if (response.data?.status === 'success') {
      const data = response.data.financial_transactions
      
      if (data['Account Summary']) {
        paymentSummary.value = data['Account Summary']
      }
      
      activePackages.value = data['Active Packages'] || []
      historicalPackages.value = data['Historical Packages'] || []

      const payments = []
      const invoices = []

      const transactions = data['Transaction History'] || []
      transactions.forEach(group => {
        Object.keys(group).forEach(key => {
          const items = group[key]
          items.forEach(item => {
            const amount = Number(item.amount || 0)
            const formattedAmount = `₹${Math.round(amount).toLocaleString('en-IN')}`
            let dateStr = ''
            if (item.date) {
              if (item.date.includes('-')) {
                dateStr = item.date.split(' ')[0]
              } else {
                const d = new Date(Number(item.date) * 1000)
                dateStr = d.toISOString().split('T')[0]
              }
            }

            if (key === 'advance_payment') {
              payments.push({
                title: 'Advance Payment',
                subtitle: item.remarks || 'Advance kept on account',
                meta: `${dateStr} • ${item.paid_via || 'Cash'}`,
                amount: formattedAmount,
                status: 'Paid',
                icon: '₹',
                iconBg: '#e6f7ed',
                iconColor: 'var(--success)',
                amountColor: 'var(--success)',
                statusClass: 'success'
              })
            } else if (item.type === 'Payment') {
              payments.push({
                title: item.session_name ? 'Session Payment' : (item.package_details ? 'Package Payment' : 'Payment'),
                subtitle: item.package_details || item.session_name || item.remarks || '',
                meta: `${dateStr} • ${item.paid_via || 'Cash'}`,
                amount: formattedAmount,
                status: 'Paid',
                icon: '₹',
                iconBg: '#e6f7ed',
                iconColor: 'var(--success)',
                amountColor: 'var(--success)',
                statusClass: 'success'
              })
            } else if (item.type === 'Invoice' || item.link) {
              let title = item.session_name ? `Session Invoice #${item.payment_id || ''}` : (item.package_details ? `Package Invoice #${item.payment_id || ''}` : `Invoice #${item.payment_id || ''}`)
              let status = 'Issued'
              let icon = '🧾'
              let iconBg = '#edf9f6'
              let iconColor = 'var(--brand)'
              let amountColor = 'var(--brand)'
              let statusClass = 'brand'

              if (key === 'refund_invoices') {
                title = `Refund Invoice #${item.payment_id || ''}`
                status = 'Refunded'
                icon = '↩'
                iconBg = '#fde8ec'
                iconColor = 'var(--danger)'
                amountColor = 'var(--danger)'
                statusClass = 'danger'
              } else if (key === 'package_expiry_invoice') {
                title = `Package Expiry #${item.payment_id || ''}`
                status = 'Expired'
                icon = '⚠️'
                iconBg = '#fff4dd'
                iconColor = 'var(--warning)'
                amountColor = 'var(--warning)'
                statusClass = 'warn'
              } else if (key === 'package_cancellation_charge_invoice') {
                title = `Forfeit Invoice #${item.payment_id || ''}`
                icon = '⚠️'
                iconBg = '#fff4dd'
                iconColor = 'var(--warning)'
                amountColor = 'var(--warning)'
                statusClass = 'warn'
              }

              invoices.push({
                title,
                subtitle: item.package_details || item.session_name || item.remarks || '',
                meta: `${dateStr} • Invoice`,
                amount: formattedAmount,
                status,
                icon, iconBg, iconColor, amountColor, statusClass,
                link: item.link
              })
            }
          })
        })
      })

      paymentEntries.value = payments
      invoiceEntries.value = invoices
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFinancialDetails()
})

const netBalance = computed(() => paymentSummary.value.net_due_advance || 0)
const hasRefund = computed(() => (paymentSummary.value.refunded || 0) > 0)
const isDue = computed(() => netBalance.value > 0)
const isAdvance = computed(() => netBalance.value < 0)

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

const visibleTransactions = computed(() => {
  if (transactionFilter.value === 'payments') return paymentEntries.value
  if (transactionFilter.value === 'invoices') return invoiceEntries.value
  return [...paymentEntries.value, ...invoiceEntries.value]
})

const setTransactionFilter = (filter) => {
  transactionFilter.value = filter
}

const isHistoricalOpen = ref(false)
const toggleHistorical = () => {
  isHistoricalOpen.value = !isHistoricalOpen.value
}

const openInvoicePdf = (url) => {
  if(url) {
    window.open(url, '_blank')
  }
}
</script>
