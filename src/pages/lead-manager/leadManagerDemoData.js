/* =====================================================================
   LEAD MANAGER DEMO DATA
   ---------------------------------------------------------------------
   Static source for every lead-manager screen. The mobile app has no
   lead-manager endpoints yet, so the whole module runs off this file.

   Every catalogue below mirrors the CRM (cb-crm, CodeIgniter) exactly, so
   the screens speak the same language as the desktop tool the team already
   uses. Sources, with the CRM's stored value in each entry's `code`:

     leadtracker_model::lead_status()          -> LEAD_STATUS
     leadtracker_model::lead_source()          -> SOURCES
     leadtracker_model::source_medium()        -> SOURCE_MEDIUMS
     leadtracker_model::lead_channel()         -> CHANNELS
     leadtracker_model::lead_types()           -> LEAD_TYPES
     leadtracker_model::lead_priorities()      -> PRIORITIES
     leadtracker_model::lost_lead_categories() -> LOST_CATEGORIES
     leadtracker_model::salutations()          -> SALUTATIONS
     sms/calls        (Communications → Queries)   -> QUERY_STATUS, QUERIES
     sms/exoPhones    (Communications → Exophones) -> EXOPHONES
     home/reviews     (Patient Feedbacks)          -> FEEDBACK_STATUS, FEEDBACKS

   When the API lands, replace this module: the pages only consume the
   shapes exported here, so the templates will not need to change.
===================================================================== */

/* ------------------------------------------------------------------
   date + format helpers
------------------------------------------------------------------ */
export const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const TODAY = new Date()
export const todayISO = isoDate(TODAY)

export const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** ISO date `n` days from today (negative = past). */
export const dayISO = (n) => isoDate(addDays(TODAY, n))

export const fmtDate = (iso) =>
  new Date(iso + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

export const fmtDateLong = (iso) =>
  new Date(iso + 'T00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export function ampm(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${String(m).padStart(2, '0')} ${ap}`
}

/** "Today" / "Yesterday" / "Tomorrow" / "12 Mar" — for list rows. */
export function relDay(iso) {
  if (!iso) return ''
  if (iso === todayISO) return 'Today'
  if (iso === dayISO(-1)) return 'Yesterday'
  if (iso === dayISO(1)) return 'Tomorrow'
  return fmtDate(iso)
}

/** "Today · 4:20 PM" — for timeline and activity rows. */
export const stamp = (iso, time) => `${relDay(iso)}${time ? ' · ' + ampm(time) : ''}`

export const initials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const rupee = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

/** 12000 -> "₹12k" — for tight KPI tiles. */
export function rupeeShort(n) {
  const v = Number(n || 0)
  if (v >= 10000000) return '₹' + (v / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr'
  if (v >= 100000) return '₹' + (v / 100000).toFixed(1).replace(/\.0$/, '') + 'L'
  if (v >= 1000) return '₹' + Math.round(v / 1000) + 'k'
  return '₹' + v
}

export function fmtDuration(sec) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return m ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`
}

/* ------------------------------------------------------------------
   hospitals — the chips on the CRM dashboard.
   'h-3' stands in for the CRM's synthetic id -3, "Not Allocated Leads"
   (patient.php::leads() appends it for lead managers).
------------------------------------------------------------------ */
export const CLINICS = [
  { id: 'h1', name: 'CB Jayanagar Bangalore', short: 'Jayanagar', city: 'Bengaluru' },
  { id: 'h2', name: 'CB Home Bangalore', short: 'Home — BLR', city: 'Bengaluru' },
  {
    id: 'h3',
    name: 'CB Neuro Physiotherapy Clinic Indiranagar',
    short: 'Indiranagar Neuro',
    city: 'Bengaluru',
  },
  { id: 'h4', name: 'CB Physiotherapy Clinic JP Nagar', short: 'JP Nagar', city: 'Bengaluru' },
  { id: 'h5', name: 'CB Physiotherapy Clinic Sarjapura', short: 'Sarjapura', city: 'Bengaluru' },
  { id: 'h6', name: 'CB Physiotherapy Clinic Whitefield', short: 'Whitefield', city: 'Bengaluru' },
  { id: 'h7', name: 'CB Physiotherapy Clinic Gottigere', short: 'Gottigere', city: 'Bengaluru' },
  { id: 'h8', name: 'CB-Tattva Sahakara Nagar', short: 'Sahakara Nagar', city: 'Bengaluru' },
  {
    id: 'h9',
    name: 'CB-Physiotattva-Electronic City',
    short: 'Electronic City',
    city: 'Bengaluru',
  },
  {
    id: 'h10',
    name: 'CB-Physiotattva-Bangaluru Neuro Clinic',
    short: 'BLR Neuro',
    city: 'Bengaluru',
  },
  { id: 'h11', name: 'CB-physiotattva Kukatpally', short: 'Kukatpally', city: 'Hyderabad' },
  { id: 'h12', name: 'CB-Physiotattva Banashankari', short: 'Banashankari', city: 'Bengaluru' },
  { id: 'h13', name: 'CB-Physiotattva Gachibowli', short: 'Gachibowli', city: 'Hyderabad' },
  { id: 'h14', name: 'CB-Physiotattva Malleshwaram', short: 'Malleshwaram', city: 'Bengaluru' },
  { id: 'h15', name: 'CB-Physiotattva Bellandur', short: 'Bellandur', city: 'Bengaluru' },
  { id: 'h16', name: 'CB-Physiotattva HSR Layout', short: 'HSR Layout', city: 'Bengaluru' },
  { id: 'h17', name: 'CBtattva-Jubilee Hills', short: 'Jubilee Hills', city: 'Hyderabad' },
  { id: 'h18', name: 'CB-Home-HYD', short: 'Home — HYD', city: 'Hyderabad' },
  { id: 'h-3', name: 'Not Allocated Leads', short: 'Not Allocated', city: '—' },
]

export const clinic = (id) =>
  CLINICS.find((c) => c.id === id) || { id, name: '—', short: '—', city: '—' }
export const clinicShort = (id) => clinic(id).short

/* ------------------------------------------------------------------
   lead status — leadtracker_model::lead_status()
   `onDashboard` marks the six the dashboard legend charts (after "All
   Leads"); `onFilter` marks the ones the Leads status dropdown offers.
   The CRM keeps Onhold (2) and Assigned-to-Freelancer (4) under empty
   keys in lead_status(), so they never reach that dropdown.
------------------------------------------------------------------ */
export const LEAD_STATUS = {
  active: {
    code: '0',
    label: 'Active',
    color: '#1f8a4d',
    tint: '#e7f6ed',
    onDashboard: true,
    onFilter: true,
  },
  assigned: {
    code: '1',
    label: 'Assigned',
    color: '#2563eb',
    tint: '#e8effd',
    onDashboard: true,
    onFilter: true,
  },
  on_hold: {
    code: '2',
    label: 'On Hold',
    color: '#7a4bd0',
    tint: '#f1eafc',
    onDashboard: true,
    onFilter: false,
  },
  lost: {
    code: '3',
    label: 'Lost',
    color: '#d9485f',
    tint: '#fdeaed',
    onDashboard: true,
    onFilter: true,
  },
  freelancer: {
    code: '4',
    label: 'Assigned To Freelancer',
    color: '#0b7285',
    tint: '#e2f2f5',
    onDashboard: true,
    onFilter: false,
  },
  not_applicable: {
    code: '5',
    label: 'Not Applicable',
    color: '#c78810',
    tint: '#fdf3e0',
    onDashboard: true,
    onFilter: true,
  },
  re_activated: {
    code: '6',
    label: 'Re-Activated',
    color: '#0a7e6e',
    tint: '#e4f4f1',
    onDashboard: false,
    onFilter: true,
  },
  re_assigned: {
    code: '7',
    label: 'Re-Assigned',
    color: '#4f46e5',
    tint: '#ecebfd',
    onDashboard: false,
    onFilter: true,
  },
}
export const statusMeta = (k) =>
  LEAD_STATUS[k] || { code: '', label: k, color: '#8da0aa', tint: '#f1f4f5' }

const statusKeys = Object.keys(LEAD_STATUS)

/** Legend order on the dashboard chart. */
export const DASHBOARD_STATUSES = statusKeys.filter((k) => LEAD_STATUS[k].onDashboard)

/** Options in the Leads screen status filter / change-status sheet. */
export const FILTER_STATUSES = statusKeys.filter((k) => LEAD_STATUS[k].onFilter)

/** Statuses that still need someone to act. */
export const OPEN_STATUSES = ['active', 'assigned', 'on_hold', 're_activated', 're_assigned']

/* ------------------------------------------------------------------
   lead catalogues — straight out of leadtracker_model
------------------------------------------------------------------ */
export const SOURCES = {
  digital: { code: '0', label: 'Digital', icon: '🌐' },
  reference: { code: '1', label: 'Reference', icon: '🤝' },
  walk_in: { code: '2', label: 'Walk-in', icon: '🚶' },
  just_dial: { code: '4', label: 'Just Dial', icon: '📒' },
  practo: { code: '5', label: 'Practo', icon: '🩺' },
}
export const sourceMeta = (k) => SOURCES[k] || { code: '', label: k, icon: '•' }

export const SOURCE_MEDIUMS = {
  facebook: { code: '2', label: 'Facebook' },
  instagram: { code: '4', label: 'Instagram' },
  organic: { code: '7', label: 'Organic (Search/Maps/SEO)' },
  google_ads: { code: '8', label: 'Google Ads' },
  meta: { code: '9', label: 'Meta' },
}
export const mediumLabel = (k) => (SOURCE_MEDIUMS[k] || { label: '—' }).label

export const CHANNELS = {
  call: { code: '1', label: 'Call' },
  whatsapp: { code: '2', label: 'WhatsApp' },
  double_tick: { code: '3', label: 'Double Tick' },
  website_callback: { code: '4', label: 'Website Callback Form' },
  website_booking: { code: '5', label: 'Website Booking Form' },
  walk_in: { code: '6', label: 'Walk-in' },
}
export const channelLabel = (k) => (CHANNELS[k] || { label: '—' }).label

export const LEAD_TYPES = {
  home: { code: '0', label: 'Home' },
  clinic: { code: '1', label: 'Clinic' },
  not_applicable: { code: '2', label: 'Not Applicable' },
  tele: { code: '3', label: 'Tele' },
}
export const leadTypeLabel = (k) => (LEAD_TYPES[k] || { label: '—' }).label

export const PRIORITIES = {
  hot: { code: 1, label: 'Hot', color: '#d9485f', tint: '#fdeaed' },
  warm: { code: 2, label: 'Warm', color: '#c78810', tint: '#fdf3e0' },
  cold: { code: 3, label: 'Cold', color: '#2563eb', tint: '#e8effd' },
}
export const priorityMeta = (k) =>
  PRIORITIES[k] || { code: 9, label: '—', color: '#8da0aa', tint: '#f1f4f5' }

export const LOST_CATEGORIES = {
  clinic_issue: { code: '0', label: 'Physio/Clinic Issue' },
  patient_issue: { code: '1', label: 'Patient Issue' },
}

/** lost_lead_reason rows, grouped by their lost_category. */
export const LOST_REASONS = {
  clinic_issue: [
    'Slot not available',
    'No physio for the speciality',
    'Clinic too far from patient',
    'Home visit not serviceable',
  ],
  patient_issue: [
    'Price too high',
    'Chose another clinic',
    'Only wanted information',
    'Not reachable (3 attempts)',
    'Postponed treatment',
    'Wrong number',
  ],
}

export const SALUTATIONS = {
  1: 'Mr.',
  2: 'Mrs.',
  3: 'Miss',
  4: 'Ms.',
  5: 'Baby',
  6: 'Dr.',
  7: 'Prof.',
  8: 'Mx.',
  9: 'Lt Col',
}

/** "Treatment Preferred" options on the CRM lead form. */
export const TREATMENTS = {
  6: 'Physiotherapy',
  3: 'Chiropractor',
}

/** Staff that leads are handled by. */
export const STAFF = [
  { id: 'u1', name: 'Anita Rao', clinics: ['h1', 'h4', 'h12'] },
  { id: 'u2', name: 'Deepak Shetty', clinics: ['h5', 'h6', 'h15', 'h16'] },
  { id: 'u3', name: 'Farheen Sultana', clinics: ['h11', 'h13', 'h17', 'h18'] },
  { id: 'u4', name: 'Rakesh Gowda', clinics: ['h3', 'h7', 'h8', 'h10'] },
  { id: 'u5', name: 'Sneha Pillai', clinics: ['h2', 'h9', 'h14'] },
]
export const staffName = (id) => (STAFF.find((s) => s.id === id) || { name: 'Unassigned' }).name

/* ------------------------------------------------------------------
   time filter — the CRM's dashboard_time_selection options.
   `days` is the window length and `offset` where it ends, relative to
   today. "This Year" is capped at 30 bars so the phone chart stays legible.
------------------------------------------------------------------ */
export const RANGES = [
  { id: '0', label: 'Today', days: 1, offset: 0 },
  { id: '5', label: 'Yesterday', days: 1, offset: -1 },
  { id: '2', label: 'This Month', days: TODAY.getDate(), offset: 0 },
  { id: '6', label: 'Previous Month', days: 30, offset: -TODAY.getDate() },
  { id: '4', label: 'This Year', days: 30, offset: 0 },
]
export const rangeMeta = (id) => RANGES.find((r) => r.id === id) || RANGES[0]

/** Inclusive [startISO, endISO] for a range id. */
export function rangeBounds(id) {
  const r = rangeMeta(id)
  return [dayISO(r.offset - (r.days - 1)), dayISO(r.offset)]
}

/* ------------------------------------------------------------------
   leads — each record carries every column of the CRM leadtracker table
------------------------------------------------------------------ */
export const LEADS = [
  {
    id: 'LD-10412',
    salutation: 1,
    name: 'Rohan Mehra',
    phone: '+91 98450 21134',
    email: 'rohan.mehra@gmail.com',
    age: 34,
    gender: 'Male',
    address: '14, 5th Cross, Koramangala',
    locality: 'Koramangala',
    pinCode: '560034',
    hospitalId: 'h1',
    leadType: 'clinic',
    condition: 'Knee pain after running injury',
    treatment: 6,
    source: 'digital',
    sourceMedium: 'google_ads',
    adName: 'BLR_Knee_Search_Aug',
    referrer: null,
    channel: 'website_callback',
    priority: 'hot',
    status: 'active',
    value: 12000,
    handledBy: 'u1',
    addedBy: 'System (Google Ads)',
    convertedBy: null,
    addedOn: todayISO,
    addedTime: '09:12',
    followUp: todayISO,
    followUpTime: '17:30',
    attempts: 1,
    remark: 'Wants evening slots, works in Koramangala.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'call',
        at: todayISO,
        time: '09:40',
        by: 'Anita Rao',
        text: 'Connected — 2m 10s. Wants evening slots.',
      },
      {
        type: 'status',
        at: todayISO,
        time: '09:20',
        by: 'System',
        text: 'Allocated to CB Jayanagar Bangalore, handled by Anita Rao',
      },
      {
        type: 'lead',
        at: todayISO,
        time: '09:12',
        by: 'Google Ads',
        text: 'Website callback form — "knee pain physiotherapy near me"',
      },
    ],
  },
  {
    id: 'LD-10411',
    salutation: 3,
    name: 'Priya Sharma',
    phone: '+91 99860 44107',
    email: 'priya.sharma91@gmail.com',
    age: 28,
    gender: 'Female',
    address: 'Brookefield, Whitefield',
    locality: 'Whitefield',
    pinCode: '560066',
    hospitalId: 'h6',
    leadType: 'clinic',
    condition: 'Post-op ACL rehabilitation',
    treatment: 6,
    source: 'digital',
    sourceMedium: 'organic',
    adName: null,
    referrer: null,
    channel: 'website_booking',
    priority: 'hot',
    status: 'assigned',
    value: 24000,
    handledBy: 'u2',
    addedBy: 'System (Website)',
    convertedBy: null,
    addedOn: todayISO,
    addedTime: '08:05',
    followUp: dayISO(1),
    followUpTime: '11:00',
    attempts: 2,
    remark: 'Surgery 5 weeks ago at Manipal. Needs a 12-session package quote.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'call',
        at: todayISO,
        time: '10:05',
        by: 'Deepak Shetty',
        text: 'Connected — 4m 32s. Callback scheduled tomorrow 11:00 AM.',
      },
      {
        type: 'whatsapp',
        at: todayISO,
        time: '08:20',
        by: 'Deepak Shetty',
        text: 'Sent clinic location and the ACL rehab package.',
      },
      {
        type: 'lead',
        at: todayISO,
        time: '08:05',
        by: 'Website',
        text: 'Website booking form — Whitefield clinic',
      },
    ],
  },
  {
    id: 'LD-10409',
    salutation: 1,
    name: 'Vikram Singh',
    phone: '+91 97400 88210',
    email: 'vikram.s@outlook.com',
    age: 41,
    gender: 'Male',
    address: 'HSR Layout Sector 2',
    locality: 'HSR Layout',
    pinCode: '560102',
    hospitalId: 'h16',
    leadType: 'clinic',
    condition: 'Chronic lower back pain',
    treatment: 6,
    source: 'digital',
    sourceMedium: 'meta',
    adName: 'BLR_BackPain_Meta_Sep',
    referrer: null,
    channel: 'whatsapp',
    priority: 'warm',
    status: 'assigned',
    value: 9000,
    handledBy: 'u2',
    addedBy: 'System (Meta Ads)',
    convertedBy: null,
    addedOn: todayISO,
    addedTime: '07:48',
    followUp: todayISO,
    followUpTime: '15:00',
    attempts: 0,
    remark: 'Not contacted yet.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'status',
        at: todayISO,
        time: '07:50',
        by: 'Lead Manager South',
        text: 'Allocated to CB-Physiotattva HSR Layout, handled by Deepak Shetty',
      },
      {
        type: 'lead',
        at: todayISO,
        time: '07:48',
        by: 'Meta Ads',
        text: 'Lead form — "Back pain relief in 6 sessions"',
      },
    ],
  },
  {
    id: 'LD-10404',
    salutation: 2,
    name: 'Anjali Verma',
    phone: '+91 98800 77451',
    email: 'anjali.verma@yahoo.in',
    age: 52,
    gender: 'Female',
    address: 'JP Nagar 6th Phase',
    locality: 'JP Nagar',
    pinCode: '560078',
    hospitalId: 'h4',
    leadType: 'clinic',
    condition: 'Frozen shoulder (adhesive capsulitis)',
    treatment: 6,
    source: 'reference',
    sourceMedium: null,
    adName: null,
    referrer: 'Dr. Iyer (Orthopaedic)',
    channel: 'call',
    priority: 'hot',
    status: 're_activated',
    value: 18000,
    handledBy: 'u1',
    addedBy: 'Anita Rao',
    convertedBy: 'Anita Rao',
    addedOn: dayISO(-1),
    addedTime: '11:20',
    followUp: dayISO(2),
    followUpTime: '10:00',
    attempts: 2,
    remark: 'Package confirmed — 12 sessions. First session Saturday 10 AM.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'status',
        at: dayISO(-1),
        time: '16:40',
        by: 'Anita Rao',
        text: 'Re-Activated — patient agreed to the 12-session package (₹18,000)',
      },
      {
        type: 'call',
        at: dayISO(-1),
        time: '16:10',
        by: 'Anita Rao',
        text: 'Connected — 6m 05s. Confirmed package and first appointment.',
      },
      {
        type: 'lead',
        at: dayISO(-1),
        time: '11:20',
        by: 'Reference',
        text: 'Referred by Dr. Iyer, orthopaedic consultant',
      },
    ],
  },
  {
    id: 'LD-10398',
    salutation: 4,
    name: 'Sana Kapoor',
    phone: '+91 98867 55093',
    email: 'sana.kapoor@gmail.com',
    age: 30,
    gender: 'Female',
    address: 'Bellandur',
    locality: 'Bellandur',
    pinCode: '560103',
    hospitalId: 'h-3',
    leadType: 'clinic',
    condition: 'Neck stiffness — desk job',
    treatment: 6,
    source: 'just_dial',
    sourceMedium: null,
    adName: null,
    referrer: null,
    channel: 'call',
    priority: 'warm',
    status: 'active',
    value: 6000,
    handledBy: null,
    addedBy: 'System (Just Dial)',
    convertedBy: null,
    addedOn: dayISO(-1),
    addedTime: '18:35',
    followUp: todayISO,
    followUpTime: '12:00',
    attempts: 1,
    remark: 'Pincode 560103 — nearest is Bellandur, waiting on capacity confirmation.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'note',
        at: dayISO(-1),
        time: '18:50',
        by: 'Lead Manager South',
        text: 'Not allocated yet — no clinic mapped to this pincode.',
      },
      {
        type: 'lead',
        at: dayISO(-1),
        time: '18:35',
        by: 'Just Dial',
        text: 'Enquiry — physiotherapy for neck pain',
      },
    ],
  },
  {
    id: 'LD-10396',
    salutation: 1,
    name: 'Mohammed Arif',
    phone: '+91 90080 12246',
    email: 'arif.m@gmail.com',
    age: 46,
    gender: 'Male',
    address: 'Gachibowli',
    locality: 'Gachibowli',
    pinCode: '500032',
    hospitalId: 'h13',
    leadType: 'home',
    condition: 'Sciatica — home visit preferred',
    treatment: 6,
    source: 'digital',
    sourceMedium: 'organic',
    adName: null,
    referrer: null,
    channel: 'call',
    priority: 'hot',
    status: 'assigned',
    value: 15000,
    handledBy: 'u3',
    addedBy: 'System (IVR)',
    convertedBy: null,
    addedOn: dayISO(-2),
    addedTime: '14:10',
    followUp: todayISO,
    followUpTime: '18:00',
    attempts: 3,
    remark: 'Comparing home-visit pricing, will decide today.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'call',
        at: dayISO(-1),
        time: '17:20',
        by: 'Farheen Sultana',
        text: 'Connected — 3m 44s. Sent home-visit charges.',
      },
      { type: 'call', at: dayISO(-2), time: '16:00', by: 'Farheen Sultana', text: 'No answer.' },
      {
        type: 'lead',
        at: dayISO(-2),
        time: '14:10',
        by: 'IVR',
        text: 'Call on the exophone — auto lead created',
      },
    ],
  },
  {
    id: 'LD-10391',
    salutation: 2,
    name: 'Lakshmi Narayan',
    phone: '+91 91640 30877',
    email: 'lakshmi.n@gmail.com',
    age: 61,
    gender: 'Female',
    address: 'Sahakara Nagar',
    locality: 'Sahakara Nagar',
    pinCode: '560092',
    hospitalId: 'h8',
    leadType: 'home',
    condition: 'Post-stroke neuro rehab',
    treatment: 6,
    source: 'walk_in',
    sourceMedium: null,
    adName: null,
    referrer: null,
    channel: 'walk_in',
    priority: 'warm',
    status: 'on_hold',
    value: 32000,
    handledBy: 'u4',
    addedBy: 'Rakesh Gowda',
    convertedBy: null,
    addedOn: dayISO(-3),
    addedTime: '10:05',
    followUp: dayISO(4),
    followUpTime: '10:30',
    attempts: 2,
    remark: 'Daughter is the decision maker. Family travelling until next week.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'status',
        at: dayISO(-2),
        time: '11:00',
        by: 'Rakesh Gowda',
        text: 'Moved to On Hold — revisit after 5 days',
      },
      {
        type: 'lead',
        at: dayISO(-3),
        time: '10:05',
        by: 'Walk-in',
        text: 'Walked into the Sahakara Nagar clinic',
      },
    ],
  },
  {
    id: 'LD-10387',
    salutation: 3,
    name: 'Tanvi Deshpande',
    phone: '+91 88840 61129',
    email: 'tanvi.d@gmail.com',
    age: 26,
    gender: 'Female',
    address: 'Bellandur',
    locality: 'Bellandur',
    pinCode: '560103',
    hospitalId: 'h15',
    leadType: 'clinic',
    condition: 'Posture correction programme',
    treatment: 6,
    source: 'digital',
    sourceMedium: 'instagram',
    adName: 'BLR_Posture_IG_Sep',
    referrer: null,
    channel: 'double_tick',
    priority: 'warm',
    status: 're_assigned',
    value: 7500,
    handledBy: 'u2',
    addedBy: 'System (Instagram)',
    convertedBy: null,
    addedOn: dayISO(-3),
    addedTime: '19:42',
    followUp: dayISO(1),
    followUpTime: '13:00',
    attempts: 1,
    remark: 'Moved from Sneha to Deepak — patient shifted to Bellandur.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'status',
        at: dayISO(-2),
        time: '13:15',
        by: 'Lead Manager South',
        text: 'Re-Assigned to Deepak Shetty (CB-Physiotattva Bellandur)',
      },
      {
        type: 'lead',
        at: dayISO(-3),
        time: '19:42',
        by: 'Instagram',
        text: 'Double Tick conversation started',
      },
    ],
  },
  {
    id: 'LD-10380',
    salutation: 1,
    name: 'Karthik Reddy',
    phone: '+91 93470 22558',
    email: 'karthik.reddy@gmail.com',
    age: 38,
    gender: 'Male',
    address: 'Kukatpally',
    locality: 'Kukatpally',
    pinCode: '500072',
    hospitalId: 'h11',
    leadType: 'clinic',
    condition: 'Shoulder impingement',
    treatment: 6,
    source: 'digital',
    sourceMedium: 'google_ads',
    adName: 'HYD_Shoulder_Search_Aug',
    referrer: null,
    channel: 'call',
    priority: 'cold',
    status: 'lost',
    value: 9000,
    handledBy: 'u3',
    addedBy: 'System (Google Ads)',
    convertedBy: null,
    addedOn: dayISO(-5),
    addedTime: '15:30',
    followUp: null,
    followUpTime: null,
    attempts: 3,
    remark: 'Started at a clinic closer to home.',
    lostCategory: 'patient_issue',
    lostReason: 'Chose another clinic',
    timeline: [
      {
        type: 'status',
        at: dayISO(-3),
        time: '11:10',
        by: 'Farheen Sultana',
        text: 'Marked Lost — Patient Issue / Chose another clinic',
      },
      {
        type: 'lead',
        at: dayISO(-5),
        time: '15:30',
        by: 'Google Ads',
        text: 'Search campaign — Hyderabad',
      },
    ],
  },
  {
    id: 'LD-10376',
    salutation: 2,
    name: 'Neha Agarwal',
    phone: '+91 99000 47712',
    email: 'neha.agarwal@gmail.com',
    age: 33,
    gender: 'Female',
    address: 'Banashankari 3rd Stage',
    locality: 'Banashankari',
    pinCode: '560085',
    hospitalId: 'h12',
    leadType: 'clinic',
    condition: 'Pregnancy back pain',
    treatment: 6,
    source: 'digital',
    sourceMedium: 'facebook',
    adName: 'BLR_Prenatal_FB_Sep',
    referrer: null,
    channel: 'whatsapp',
    priority: 'hot',
    status: 'assigned',
    value: 8000,
    handledBy: 'u1',
    addedBy: 'System (WhatsApp)',
    convertedBy: null,
    addedOn: dayISO(-1),
    addedTime: '20:15',
    followUp: todayISO,
    followUpTime: '11:30',
    attempts: 0,
    remark: 'Not contacted yet.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'status',
        at: dayISO(-1),
        time: '20:20',
        by: 'Lead Manager South',
        text: 'Allocated to CB-Physiotattva Banashankari, handled by Anita Rao',
      },
      {
        type: 'whatsapp',
        at: dayISO(-1),
        time: '20:15',
        by: 'Lead',
        text: '"Hi, do you have prenatal physiotherapy?"',
      },
    ],
  },
  {
    id: 'LD-10371',
    salutation: 1,
    name: 'Suresh Babu',
    phone: '+91 94480 10093',
    email: '',
    age: 57,
    gender: 'Male',
    address: 'Gottigere',
    locality: 'Gottigere',
    pinCode: '560083',
    hospitalId: 'h7',
    leadType: 'not_applicable',
    condition: '—',
    treatment: null,
    source: 'digital',
    sourceMedium: null,
    adName: null,
    referrer: null,
    channel: 'call',
    priority: 'cold',
    status: 'not_applicable',
    value: 0,
    handledBy: 'u4',
    addedBy: 'System (IVR)',
    convertedBy: null,
    addedOn: dayISO(-4),
    addedTime: '13:05',
    followUp: null,
    followUpTime: null,
    attempts: 2,
    remark: 'Wrong number, no enquiry.',
    lostCategory: 'patient_issue',
    lostReason: 'Wrong number',
    timeline: [
      {
        type: 'status',
        at: dayISO(-4),
        time: '14:00',
        by: 'Rakesh Gowda',
        text: 'Marked Not Applicable — Wrong number',
      },
      {
        type: 'lead',
        at: dayISO(-4),
        time: '13:05',
        by: 'IVR',
        text: 'Call on the exophone — auto lead created',
      },
    ],
  },
  {
    id: 'LD-10368',
    salutation: 2,
    name: 'Ritu Malhotra',
    phone: '+91 98450 90021',
    email: 'ritu.malhotra@gmail.com',
    age: 44,
    gender: 'Female',
    address: 'Jubilee Hills',
    locality: 'Jubilee Hills',
    pinCode: '500033',
    hospitalId: 'h17',
    leadType: 'clinic',
    condition: 'Plantar fasciitis',
    treatment: 6,
    source: 'reference',
    sourceMedium: null,
    adName: null,
    referrer: 'Ms. Padma (existing patient)',
    channel: 'call',
    priority: 'warm',
    status: 'active',
    value: 6500,
    handledBy: 'u3',
    addedBy: 'Farheen Sultana',
    convertedBy: null,
    addedOn: dayISO(-2),
    addedTime: '09:55',
    followUp: dayISO(1),
    followUpTime: '16:00',
    attempts: 1,
    remark: 'Offer a single-session trial at ₹700, then upsell the 8-session package.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'call',
        at: dayISO(-2),
        time: '10:20',
        by: 'Farheen Sultana',
        text: 'Connected — 3m 01s. Wants a trial session first.',
      },
      {
        type: 'lead',
        at: dayISO(-2),
        time: '09:55',
        by: 'Reference',
        text: 'Referred by Ms. Padma (Jubilee Hills)',
      },
    ],
  },
  {
    id: 'LD-10362',
    salutation: 1,
    name: 'Aditya Kulkarni',
    phone: '+91 90350 66714',
    email: 'aditya.k@gmail.com',
    age: 29,
    gender: 'Male',
    address: 'Electronic City Phase 1',
    locality: 'Electronic City',
    pinCode: '560100',
    hospitalId: 'h9',
    leadType: 'clinic',
    condition: 'Sports massage and recovery',
    treatment: 3,
    source: 'digital',
    sourceMedium: 'organic',
    adName: null,
    referrer: null,
    channel: 'website_callback',
    priority: 'cold',
    status: 'freelancer',
    value: 5000,
    handledBy: 'u5',
    addedBy: 'System (Website)',
    convertedBy: null,
    addedOn: dayISO(-1),
    addedTime: '16:48',
    followUp: todayISO,
    followUpTime: '19:00',
    attempts: 1,
    remark: 'No in-house chiropractor at Electronic City — routed to a freelancer.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'status',
        at: todayISO,
        time: '10:10',
        by: 'Lead Manager South',
        text: 'Assigned To Freelancer — no in-house chiropractor at this clinic',
      },
      {
        type: 'lead',
        at: dayISO(-1),
        time: '16:48',
        by: 'Website',
        text: 'Website callback form — Electronic City',
      },
    ],
  },
  {
    id: 'LD-10355',
    salutation: 3,
    name: 'Pooja Iyer',
    phone: '+91 99450 33298',
    email: 'pooja.iyer@gmail.com',
    age: 36,
    gender: 'Female',
    address: 'Malleshwaram',
    locality: 'Malleshwaram',
    pinCode: '560003',
    hospitalId: 'h14',
    leadType: 'clinic',
    condition: 'Cervical spondylosis',
    treatment: 6,
    source: 'digital',
    sourceMedium: 'google_ads',
    adName: 'BLR_Neck_Search_Aug',
    referrer: null,
    channel: 'call',
    priority: 'cold',
    status: 'lost',
    value: 11000,
    handledBy: 'u5',
    addedBy: 'System (Google Ads)',
    convertedBy: null,
    addedOn: dayISO(-6),
    addedTime: '12:22',
    followUp: null,
    followUpTime: null,
    attempts: 3,
    remark: 'Three attempts, never connected.',
    lostCategory: 'patient_issue',
    lostReason: 'Not reachable (3 attempts)',
    timeline: [
      {
        type: 'status',
        at: dayISO(-4),
        time: '18:00',
        by: 'System',
        text: 'Marked Lost after 3 failed attempts',
      },
      {
        type: 'lead',
        at: dayISO(-6),
        time: '12:22',
        by: 'Google Ads',
        text: 'Search campaign — Malleshwaram',
      },
    ],
  },
  {
    id: 'LD-10349',
    salutation: 1,
    name: 'Ganesh Prasad',
    phone: '+91 97310 55482',
    email: 'ganesh.prasad@gmail.com',
    age: 49,
    gender: 'Male',
    address: 'Sarjapur Road',
    locality: 'Sarjapura',
    pinCode: '562125',
    hospitalId: 'h5',
    leadType: 'clinic',
    condition: 'Tennis elbow',
    treatment: 6,
    source: 'walk_in',
    sourceMedium: null,
    adName: null,
    referrer: null,
    channel: 'walk_in',
    priority: 'warm',
    status: 're_activated',
    value: 10000,
    handledBy: 'u2',
    addedBy: 'Deepak Shetty',
    convertedBy: 'Deepak Shetty',
    addedOn: dayISO(-6),
    addedTime: '17:10',
    followUp: dayISO(3),
    followUpTime: '11:00',
    attempts: 1,
    remark: '8-session package running, 3 sessions done.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'status',
        at: dayISO(-5),
        time: '10:00',
        by: 'Deepak Shetty',
        text: 'Re-Activated — 8-session package started (₹10,000)',
      },
      {
        type: 'lead',
        at: dayISO(-6),
        time: '17:10',
        by: 'Walk-in',
        text: 'Walked into the Sarjapura clinic',
      },
    ],
  },
  {
    id: 'LD-10344',
    salutation: 3,
    name: 'Shweta Nambiar',
    phone: '+91 98862 71140',
    email: 'shweta.n@gmail.com',
    age: 31,
    gender: 'Female',
    address: 'Kondapur',
    locality: 'Kondapur',
    pinCode: '500084',
    hospitalId: 'h18',
    leadType: 'home',
    condition: 'Home physiotherapy for mother',
    treatment: 6,
    source: 'digital',
    sourceMedium: 'facebook',
    adName: 'HYD_Home_FB_Aug',
    referrer: null,
    channel: 'whatsapp',
    priority: 'warm',
    status: 'on_hold',
    value: 20000,
    handledBy: 'u3',
    addedBy: 'System (WhatsApp)',
    convertedBy: null,
    addedOn: dayISO(-7),
    addedTime: '08:30',
    followUp: dayISO(2),
    followUpTime: '12:00',
    attempts: 2,
    remark: 'Waiting for the orthopaedic report.',
    lostCategory: null,
    lostReason: null,
    timeline: [
      {
        type: 'status',
        at: dayISO(-5),
        time: '15:20',
        by: 'Farheen Sultana',
        text: 'Moved to On Hold — awaiting ortho report',
      },
      {
        type: 'whatsapp',
        at: dayISO(-7),
        time: '08:30',
        by: 'Lead',
        text: '"Need home physio for my mother in Kondapur"',
      },
    ],
  },
]

export const getLead = (id) => LEADS.find((l) => l.id === id) || null

/** Icon shown against each timeline entry type. */
export const TIMELINE_ICON = {
  lead: '✨',
  call: '📞',
  whatsapp: '💬',
  email: '✉️',
  note: '📝',
  status: '🔁',
}

/* ------------------------------------------------------------------
   dashboard widgets — "Expiring/Expired Subscriptions" and
   "Activ PT Followups" from dashboard_calendar_and_leads.php
------------------------------------------------------------------ */
export const SUBSCRIPTIONS = {
  expiring_today: [
    {
      id: 's1',
      patient: 'Anjali Verma',
      hospitalId: 'h4',
      pkg: 'Advanced Physiotherapy — 12',
      used: 12,
      total: 12,
      expiresOn: todayISO,
    },
    {
      id: 's2',
      patient: 'Ganesh Prasad',
      hospitalId: 'h5',
      pkg: 'Basic Physiotherapy — 8',
      used: 8,
      total: 8,
      expiresOn: todayISO,
    },
  ],
  expiring_tomorrow: [
    {
      id: 's3',
      patient: 'Rohan Mehra',
      hospitalId: 'h1',
      pkg: 'Basic Physiotherapy — 10',
      used: 9,
      total: 10,
      expiresOn: dayISO(1),
    },
  ],
  expired: [
    {
      id: 's4',
      patient: 'Tanvi Deshpande',
      hospitalId: 'h15',
      pkg: 'Posture Programme — 6',
      used: 6,
      total: 6,
      expiresOn: dayISO(-2),
    },
    {
      id: 's5',
      patient: 'Lakshmi Narayan',
      hospitalId: 'h8',
      pkg: 'Neuro Rehab — 15',
      used: 13,
      total: 15,
      expiresOn: dayISO(-5),
    },
  ],
}

export const PT_FOLLOWUPS = [
  {
    id: 'f1',
    patient: 'Rohan Mehra',
    hospitalId: 'h1',
    physio: 'Dr. Kavya Nair',
    due: todayISO,
    time: '17:30',
    note: 'Review knee pain score after 3 weeks',
  },
  {
    id: 'f2',
    patient: 'Mohammed Arif',
    hospitalId: 'h13',
    physio: 'Dr. Sneha Varma',
    due: todayISO,
    time: '18:00',
    note: 'Home-visit decision pending',
  },
  {
    id: 'f3',
    patient: 'Ritu Malhotra',
    hospitalId: 'h17',
    physio: 'Dr. Sneha Varma',
    due: dayISO(1),
    time: '16:00',
    note: 'Trial session outcome',
  },
  {
    id: 'f4',
    patient: 'Shweta Nambiar',
    hospitalId: 'h18',
    physio: 'Dr. Rahul Bose',
    due: dayISO(2),
    time: '12:00',
    note: 'Ortho report follow-up',
  },
]

/* ------------------------------------------------------------------
   patient feedback — home/reviews (treatment_feedback table).
   Feedback arrives through the WhatsApp flow, so `ratingText` is the
   label the patient tapped ("0_⭐⭐⭐⭐⭐_Excellent" → "Excellent").
------------------------------------------------------------------ */
export const FEEDBACK_STATUS = {
  unresolved: { label: 'Unresolved', color: '#d9485f', tint: '#fdeaed' },
  resolved: { label: 'Resolved', color: '#1f8a4d', tint: '#e7f6ed' },
  positive: { label: 'Positive', color: '#0a7e6e', tint: '#e4f4f1' },
}

export const FEEDBACKS = [
  {
    id: 'FB-2201',
    patient: 'Anjali Verma',
    phone: '+91 98800 77451',
    hospitalId: 'h4',
    rating: 5,
    ratingText: 'Excellent',
    suggestion:
      'Shoulder movement improved a lot in 8 sessions. The doctor explains every exercise properly.',
    at: todayISO,
    time: '11:40',
    status: 'positive',
    publish: true,
    resolvedBy: null,
    remarks: null,
  },
  {
    id: 'FB-2200',
    patient: 'Ganesh Prasad',
    phone: '+91 97310 55482',
    hospitalId: 'h5',
    rating: 2,
    ratingText: 'Poor',
    suggestion:
      'Had to wait 35 minutes past my slot time. Treatment was fine but scheduling is poor.',
    at: todayISO,
    time: '10:05',
    status: 'unresolved',
    publish: false,
    resolvedBy: null,
    remarks: null,
  },
  {
    id: 'FB-2198',
    patient: 'Tanvi Deshpande',
    phone: '+91 88840 61129',
    hospitalId: 'h15',
    rating: 4,
    ratingText: 'Good',
    suggestion: 'Good experience overall. Would like a printed home-exercise sheet.',
    at: dayISO(-1),
    time: '18:20',
    status: 'resolved',
    publish: true,
    resolvedBy: 'Lead Manager South',
    remarks: 'Shared the printable exercise sheet over WhatsApp.',
  },
  {
    id: 'FB-2195',
    patient: 'Rohan Mehra',
    phone: '+91 98450 21134',
    hospitalId: 'h1',
    rating: 5,
    ratingText: 'Excellent',
    suggestion: 'Knee pain down from 7 to 3 in three weeks. Very happy.',
    at: dayISO(-1),
    time: '12:10',
    status: 'positive',
    publish: true,
    resolvedBy: null,
    remarks: null,
  },
  {
    id: 'FB-2192',
    patient: 'Mohammed Arif',
    phone: '+91 90080 12246',
    hospitalId: 'h13',
    rating: 1,
    ratingText: 'Very Poor',
    suggestion:
      'Was charged a travel fee that nobody mentioned while booking. Please correct this.',
    at: dayISO(-2),
    time: '19:05',
    status: 'unresolved',
    publish: false,
    resolvedBy: null,
    remarks: null,
  },
  {
    id: 'FB-2190',
    patient: 'Lakshmi Narayan',
    phone: '+91 91640 30877',
    hospitalId: 'h8',
    rating: 4,
    ratingText: 'Good',
    suggestion: 'Patient and kind with elderly people. Parking near the clinic is a problem.',
    at: dayISO(-2),
    time: '15:30',
    status: 'resolved',
    publish: false,
    resolvedBy: 'Lead Manager South',
    remarks: 'Shared the paid-parking option two doors down with the clinic front desk.',
  },
  {
    id: 'FB-2186',
    patient: 'Aditya Kulkarni',
    phone: '+91 90350 66714',
    hospitalId: 'h9',
    rating: 3,
    ratingText: 'Average',
    suggestion: 'Session felt shorter than the 45 minutes promised.',
    at: dayISO(-3),
    time: '20:00',
    status: 'unresolved',
    publish: false,
    resolvedBy: null,
    remarks: null,
  },
  {
    id: 'FB-2181',
    patient: 'Ritu Malhotra',
    phone: '+91 98450 90021',
    hospitalId: 'h17',
    rating: 5,
    ratingText: 'Excellent',
    suggestion: 'Heel pain almost gone. The staff is very professional.',
    at: dayISO(-4),
    time: '09:45',
    status: 'positive',
    publish: true,
    resolvedBy: null,
    remarks: null,
  },
]

/* ------------------------------------------------------------------
   Communications → Queries  (sms/calls)
   CRM columns: Caller · Query Status · Direction · Call Status ·
   Managed By · Source · Time · Clinic · Current Status
------------------------------------------------------------------ */
export const QUERY_STATUS = {
  'New Query': { color: '#2563eb', tint: '#e8effd' },
  'Existing Lead': { color: '#7a4bd0', tint: '#f1eafc' },
  'Ongoing Patient': { color: '#1f8a4d', tint: '#e7f6ed' },
  'Ex Patient': { color: '#c78810', tint: '#fdf3e0' },
  'No Show': { color: '#d9485f', tint: '#fdeaed' },
}

/** The CRM's default selection on sms/calls — "Ongoing Patient" starts off. */
export const QUERY_STATUS_DEFAULT = ['New Query', 'Existing Lead', 'Ex Patient', 'No Show']

/** Exotel call statuses. */
export const CALL_STATUS = {
  completed: { label: 'Completed', color: '#1f8a4d', tint: '#e7f6ed' },
  'no-answer': { label: 'No answer', color: '#c78810', tint: '#fdf3e0' },
  busy: { label: 'Busy', color: '#8da0aa', tint: '#f1f4f5' },
  failed: { label: 'Failed', color: '#d9485f', tint: '#fdeaed' },
}
export const callStatusMeta = (k) =>
  CALL_STATUS[k] || { label: k, color: '#8da0aa', tint: '#f1f4f5' }

export const QUERIES = [
  {
    id: 'Q-9041',
    leadId: 'LD-10412',
    caller: 'Rohan Mehra',
    callFrom: '+91 98450 21134',
    exophone: '+91 80471 20055',
    queryStatus: 'Existing Lead',
    direction: 'outbound',
    callStatus: 'completed',
    managedBy: 'Anita Rao',
    source: 'Digital',
    durationSec: 130,
    at: todayISO,
    time: '09:40',
    hospitalId: 'h1',
    currentStatus: 'Active',
    recording: true,
  },
  {
    id: 'Q-9040',
    leadId: null,
    caller: 'Unknown caller',
    callFrom: '+91 96320 71188',
    exophone: '+91 80471 20055',
    queryStatus: 'New Query',
    direction: 'inbound',
    callStatus: 'completed',
    managedBy: 'Anita Rao',
    source: 'Digital',
    durationSec: 96,
    at: todayISO,
    time: '09:58',
    hospitalId: 'h-3',
    currentStatus: 'New Query',
    recording: true,
  },
  {
    id: 'Q-9039',
    leadId: 'LD-10411',
    caller: 'Priya Sharma',
    callFrom: '+91 99860 44107',
    exophone: '+91 80471 20066',
    queryStatus: 'Existing Lead',
    direction: 'outbound',
    callStatus: 'completed',
    managedBy: 'Deepak Shetty',
    source: 'Digital',
    durationSec: 272,
    at: todayISO,
    time: '10:05',
    hospitalId: 'h6',
    currentStatus: 'Assigned',
    recording: true,
  },
  {
    id: 'Q-9038',
    leadId: 'LD-10398',
    caller: 'Sana Kapoor',
    callFrom: '+91 98867 55093',
    exophone: '+91 80471 20055',
    queryStatus: 'New Query',
    direction: 'inbound',
    callStatus: 'no-answer',
    managedBy: '—',
    source: 'Just Dial',
    durationSec: 0,
    at: todayISO,
    time: '08:55',
    hospitalId: 'h-3',
    currentStatus: 'Active',
    recording: false,
  },
  {
    id: 'Q-9036',
    leadId: 'LD-10404',
    caller: 'Anjali Verma',
    callFrom: '+91 98800 77451',
    exophone: '+91 80471 20077',
    queryStatus: 'Ongoing Patient',
    direction: 'inbound',
    callStatus: 'completed',
    managedBy: 'Anita Rao',
    source: 'Reference',
    durationSec: 365,
    at: dayISO(-1),
    time: '16:10',
    hospitalId: 'h4',
    currentStatus: 'Re-Activated',
    recording: true,
  },
  {
    id: 'Q-9034',
    leadId: 'LD-10396',
    caller: 'Mohammed Arif',
    callFrom: '+91 90080 12246',
    exophone: '+91 40471 30011',
    queryStatus: 'Existing Lead',
    direction: 'outbound',
    callStatus: 'completed',
    managedBy: 'Farheen Sultana',
    source: 'Digital',
    durationSec: 224,
    at: dayISO(-1),
    time: '17:20',
    hospitalId: 'h13',
    currentStatus: 'Assigned',
    recording: true,
  },
  {
    id: 'Q-9031',
    leadId: 'LD-10387',
    caller: 'Tanvi Deshpande',
    callFrom: '+91 88840 61129',
    exophone: '+91 80471 20066',
    queryStatus: 'Ex Patient',
    direction: 'inbound',
    callStatus: 'busy',
    managedBy: 'Deepak Shetty',
    source: 'Digital',
    durationSec: 0,
    at: dayISO(-2),
    time: '11:12',
    hospitalId: 'h15',
    currentStatus: 'Re-Assigned',
    recording: false,
  },
  {
    id: 'Q-9028',
    leadId: 'LD-10355',
    caller: 'Pooja Iyer',
    callFrom: '+91 99450 33298',
    exophone: '+91 80471 20088',
    queryStatus: 'No Show',
    direction: 'outbound',
    callStatus: 'no-answer',
    managedBy: 'Sneha Pillai',
    source: 'Digital',
    durationSec: 0,
    at: dayISO(-5),
    time: '11:30',
    hospitalId: 'h14',
    currentStatus: 'Lost',
    recording: false,
  },
  {
    id: 'Q-9025',
    leadId: 'LD-10380',
    caller: 'Karthik Reddy',
    callFrom: '+91 93470 22558',
    exophone: '+91 40471 30011',
    queryStatus: 'No Show',
    direction: 'outbound',
    callStatus: 'failed',
    managedBy: 'Farheen Sultana',
    source: 'Digital',
    durationSec: 0,
    at: dayISO(-4),
    time: '10:15',
    hospitalId: 'h11',
    currentStatus: 'Lost',
    recording: false,
  },
]

/* ------------------------------------------------------------------
   Communications → Exophones  (sms/exoPhones)
   Exotel virtual numbers per network; add / edit / soft-delete / restore.
------------------------------------------------------------------ */
export const EXOPHONES = [
  {
    id: 'e1',
    exophone: '+91 80471 20055',
    networkId: 12,
    isActive: true,
    label: 'Bengaluru — main',
  },
  {
    id: 'e2',
    exophone: '+91 80471 20066',
    networkId: 12,
    isActive: true,
    label: 'Bengaluru — east',
  },
  {
    id: 'e3',
    exophone: '+91 80471 20077',
    networkId: 12,
    isActive: true,
    label: 'Bengaluru — south',
  },
  {
    id: 'e4',
    exophone: '+91 80471 20088',
    networkId: 12,
    isActive: true,
    label: 'Bengaluru — north',
  },
  {
    id: 'e5',
    exophone: '+91 40471 30011',
    networkId: 12,
    isActive: true,
    label: 'Hyderabad — main',
  },
  {
    id: 'e6',
    exophone: '+91 40471 30022',
    networkId: 12,
    isActive: false,
    label: 'Hyderabad — old',
  },
]

/* ------------------------------------------------------------------
   the signed-in lead manager
------------------------------------------------------------------ */
export const MANAGER = {
  name: 'Lead Manager South',
  role: 'Lead-manager',
  networkId: 12,
  region: 'South — Bengaluru & Hyderabad',
  email: 'leadmanagersouth@gmail.com',
  phone: '+91 80471 20055',
  employeeId: 'CB-LM-014',
  since: 'Mar 2024',
  clinicIds: CLINICS.map((c) => c.id),
}

/* ------------------------------------------------------------------
   dashboard trend series
------------------------------------------------------------------ */

/**
 * Deterministic pseudo-random in [0, 1). Keeps the demo chart stable
 * across re-renders — a real random source would make it flicker.
 */
function seeded(n) {
  const x = Math.sin(n * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/**
 * Daily lead counts per status for the dashboard chart.
 *
 * @param {string} rangeId - one of RANGES[].id
 * @param {string[]} clinicIds - selected hospitals; scales the volume
 * @param {number} shiftDays - slide the window back N days (pass the
 *   range length to get the immediately preceding period)
 * @returns {{iso: string, label: string, counts: Object, total: number}[]}
 */
export function trendSeries(rangeId, clinicIds = [], shiftDays = 0) {
  const r = rangeMeta(rangeId)
  // An empty selection means "nothing selected", so the chart goes flat.
  const share = clinicIds.length / CLINICS.length
  const end = r.offset - shiftDays
  const start = end - r.days + 1
  const out = []

  for (let i = start; i <= end; i++) {
    const iso = dayISO(i)
    const d = new Date(iso + 'T00:00')
    const weekend = d.getDay() === 0 ? 0.55 : 1
    const base = (14 + Math.round(seeded(i + 77) * 22)) * share * weekend

    const counts = {
      active: Math.round(base * (0.3 + seeded(i + 11) * 0.1)),
      assigned: Math.round(base * (0.26 + seeded(i + 23) * 0.08)),
      on_hold: Math.round(base * (0.09 + seeded(i + 31) * 0.04)),
      freelancer: Math.round(base * (0.05 + seeded(i + 47) * 0.03)),
      not_applicable: Math.round(base * (0.06 + seeded(i + 53) * 0.03)),
    }
    counts.lost = Math.max(0, Math.round(base) - Object.values(counts).reduce((s, v) => s + v, 0))

    out.push({
      iso,
      label: String(d.getDate()).padStart(2, '0'),
      counts,
      total: Object.values(counts).reduce((s, v) => s + v, 0),
    })
  }
  return out
}
