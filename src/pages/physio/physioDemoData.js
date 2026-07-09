/* =====================================================================
   PHYSIO DEMO DATA — single reactive source for all physio UI screens.
   When APIs are ready, replace this one file with API-backed stores;
   the page templates won't need to change.
===================================================================== */
import { reactive } from 'vue'

/* ---------------- dates & formatting helpers ---------------- */
export const isoDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const TODAY = new Date()
export const todayISO = isoDate(TODAY)

export const addDays = (d, n) => {
    const x = new Date(d)
    x.setDate(x.getDate() + n)
    return x
}

export const dayName = (iso) =>
    new Date(iso + 'T00:00').toLocaleDateString('en-IN', { weekday: 'long' })

export const fmtDate = (iso) =>
    new Date(iso + 'T00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })

export function ampm(t) {
    if (!t) return ''
    const [h, m] = t.split(':').map(Number)
    const ap = h >= 12 ? 'PM' : 'AM'
    const hh = ((h + 11) % 12) + 1
    return `${hh}:${String(m).padStart(2, '0')} ${ap}`
}

export const initials = (name) =>
    name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export const rupee = (n) => '₹' + Number(n).toLocaleString('en-IN')

export function fmtElapsed(ms) {
    const s = Math.max(0, Math.floor(ms / 1000))
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
export function fmtDur(sec) {
    return sec >= 60 ? `${Math.round(sec / 60)} min` : `${Math.max(1, Math.round(sec))}s`
}

/* ---------------- physio ---------------- */
export const PHYSIO = {
    name: 'Dr. Kavya Nair',
    initials: 'KN',
    designation: 'Sr. Physiotherapist',
    clinic: 'CB Physiotherapy — Saket',
}

/* ---------------- catalogues ---------------- */
export const TREATMENTS = [
    { id: 'basic', name: 'Basic Physiotherapy', price: 600 },
    { id: 'advanced', name: 'Advanced Physiotherapy', price: 900 },
    { id: 'chiro', name: 'Chiropractic', price: 1200 },
    { id: 'sports', name: 'Sports Massage', price: 1000 },
    { id: 'cupping', name: 'Cupping', price: 400 },
]
export const txName = (id) => (TREATMENTS.find((x) => x.id === id) || { name: id }).name
export const txPrice = (id) => (TREATMENTS.find((x) => x.id === id) || { price: 0 }).price

// clinical modalities applied in-session — std = typical minutes
export const MODALITIES = reactive([
    { id: 'ift', name: 'IFT', std: 15 },
    { id: 'us', name: 'Ultrasound', std: 8 },
    { id: 'tens', name: 'TENS', std: 20 },
    { id: 'hotpack', name: 'Moist Heat', std: 15 },
    { id: 'cryo', name: 'Cryotherapy', std: 10 },
    { id: 'laser', name: 'Laser', std: 8 },
    { id: 'traction', name: 'Traction', std: 15 },
    { id: 'manual', name: 'Manual Therapy', std: 20 },
    { id: 'taping', name: 'Taping', std: 5 },
])

export const EXERCISES = [
    { id: 'chintuck', name: 'Chin Tucks', part: 'Neck', sets: 3, reps: 10, hold: 5, equip: 'None' },
    { id: 'neckiso', name: 'Neck Isometrics (multi-direction)', part: 'Neck', sets: 3, reps: 8, hold: 6, equip: 'Recovery Station' },
    { id: 'postret', name: 'Postural Retraction', part: 'Neck', sets: 3, reps: 12, hold: 3, equip: 'None' },
    { id: 'scapret', name: 'Scapular Retraction', part: 'Shoulder', sets: 3, reps: 12, hold: 3, equip: 'Band' },
    { id: 'pendulum', name: 'Pendulum Swings', part: 'Shoulder', sets: 2, reps: 15, hold: 0, equip: 'None' },
    { id: 'catcow', name: 'Cat-Cow Mobility', part: 'Spine', sets: 2, reps: 10, hold: 2, equip: 'Mat' },
    { id: 'birddog', name: 'Bird Dog', part: 'Core', sets: 3, reps: 10, hold: 4, equip: 'Mat' },
    { id: 'bridge', name: 'Bridging', part: 'Hip', sets: 3, reps: 12, hold: 4, equip: 'Mat' },
    { id: 'clamshell', name: 'Clamshell', part: 'Hip', sets: 3, reps: 15, hold: 0, equip: 'Band' },
    { id: 'quadset', name: 'Quad Sets', part: 'Knee', sets: 3, reps: 12, hold: 6, equip: 'None' },
    { id: 'heelslide', name: 'Heel Slides', part: 'Knee', sets: 3, reps: 12, hold: 0, equip: 'None' },
    { id: 'slr', name: 'Straight Leg Raise', part: 'Knee', sets: 3, reps: 10, hold: 3, equip: 'None' },
]
export const exDef = (id) => EXERCISES.find((e) => e.id === id) || {}

/* ---------------- status map ---------------- */
export const STATUS = {
    pending: { label: 'To confirm', cls: 'pending', color: '#6d4bff' },
    booked: { label: 'Booked', cls: 'muted', color: '#8da0aa' },
    checked_in: { label: 'Checked in', cls: 'warn', color: '#c78810' },
    in_treatment: { label: 'In treatment', cls: 'info', color: '#2563eb' },
    done: { label: 'Treatment done', cls: 'brand', color: '#0a7e6e' },
    invoiced: { label: 'Payment pending', cls: 'warn', color: '#c78810' },
    paid: { label: 'Paid', cls: 'success', color: '#1f8a4d' },
    declined: { label: 'Declined', cls: 'danger', color: '#d9485f' },
}

/* ---------------- patients (reactive) ---------------- */
export const PATIENTS = reactive({
    p1: {
        id: 'p1', name: 'Rohan Mehra', age: 34, sex: 'M', phone: '98xxxxxx21',
        condition: 'Mechanical Neck Pain', billing: 'package',
        package: { treatmentId: 'basic', name: 'Basic Physiotherapy — 10', total: 10, used: 3 },
        exercises: [{ id: 'chintuck' }, { id: 'neckiso' }, { id: 'postret' }],
        feedback: { pain: 3, difficulty: 'Moderate', note: 'Stiffness eased, evenings still tight', when: 'Yesterday' },
    },
    p2: {
        id: 'p2', name: 'Priya Sharma', age: 28, sex: 'F', phone: '99xxxxxx04',
        condition: 'Post-op ACL Rehab (Wk 6)', billing: 'per_visit', package: null,
        exercises: [{ id: 'quadset' }, { id: 'heelslide' }, { id: 'slr' }], feedback: null,
    },
    p3: {
        id: 'p3', name: 'Anjali Verma', age: 52, sex: 'F', phone: '98xxxxxx77',
        condition: 'Adhesive Capsulitis (Frozen Shoulder)', billing: 'package',
        package: { treatmentId: 'advanced', name: 'Advanced Physiotherapy — 12', total: 12, used: 8 },
        exercises: [{ id: 'pendulum' }, { id: 'scapret' }],
        feedback: { pain: 5, difficulty: 'Hard', note: 'Overhead reach painful', when: '2 days ago' },
    },
    p4: {
        id: 'p4', name: 'Vikram Singh', age: 41, sex: 'M', phone: '97xxxxxx10',
        condition: 'Mechanical Low Back Pain', billing: 'per_visit', package: null,
        exercises: [{ id: 'catcow' }, { id: 'birddog' }, { id: 'bridge' }], feedback: null,
    },
    p5: {
        id: 'p5', name: 'Sana Kapoor', age: 30, sex: 'F', phone: '98xxxxxx55',
        condition: 'New consult — Lower back', billing: 'per_visit', package: null,
        exercises: [], feedback: null,
    },
})

/* ---------------- appointments (reactive) ---------------- */
export const APPTS = reactive([
    { id: 'a1', pid: 'p1', date: todayISO, time: '10:00', status: 'checked_in', modLog: [], exConfirmed: null, note: '', draftInv: null, invoice: null, followUp: null },
    { id: 'a2', pid: 'p2', date: todayISO, time: '10:30', status: 'booked', modLog: [], exConfirmed: null, note: '', draftInv: null, invoice: null, followUp: null },
    { id: 'a3', pid: 'p3', date: todayISO, time: '11:15', status: 'booked', modLog: [], exConfirmed: null, note: '', draftInv: null, invoice: null, followUp: null },
    {
        id: 'a4', pid: 'p4', date: todayISO, time: '09:15', status: 'paid', modLog: [], exConfirmed: ['catcow', 'birddog', 'bridge'],
        note: 'Tolerated well. Progress core stability next visit.', draftInv: null,
        invoice: { items: [{ label: 'Basic Physiotherapy', amt: 600 }, { label: 'Cupping', amt: 400 }], total: 1000, status: 'paid' },
        followUp: { date: isoDate(addDays(TODAY, 2)), time: '09:15' },
    },
    { id: 'a5', pid: 'p5', date: todayISO, time: '16:30', status: 'pending', modLog: [], exConfirmed: null, note: '', draftInv: null, invoice: null, followUp: null, source: 'New booking' },
    { id: 'a6', pid: 'p2', date: todayISO, time: '18:00', status: 'pending', modLog: [], exConfirmed: null, note: '', draftInv: null, invoice: null, followUp: null, source: 'Reschedule request' },
    {
        id: 'a0', pid: 'p1', date: isoDate(addDays(TODAY, -3)), time: '10:00', status: 'paid', modLog: [], exConfirmed: null, note: '', draftInv: null,
        invoice: { items: [{ label: 'Basic Physiotherapy — package session', amt: 0 }], total: 0, status: 'package' },
        followUp: { date: todayISO, time: '10:00' },
    },
])

export const getAppt = (id) => APPTS.find((a) => a.id === id)
export const getPatient = (id) => PATIENTS[id]

/* ---------------- treatment timer helpers (tap-to-time) ---------------- */
export function modEntry(a, id) {
    return a.modLog.find((m) => m.id === id)
}
export function startMod(a, id) {
    const e = a.modLog.find((m) => m.id === id)
    if (e) {
        e.start = Date.now()
        e.end = null
    } else a.modLog.push({ id, start: Date.now(), end: null })
}
export function endMod(a, id) {
    const m = a.modLog.find((x) => x.id === id && x.end === null)
    if (m) m.end = Date.now()
}
export function endAllRunning(a) {
    a.modLog.forEach((m) => {
        if (m.end === null) m.end = Date.now()
    })
}

/* ---------------- invoice helpers ---------------- */
export function invDraft(a) {
    if (!a.draftInv) a.draftInv = { lines: [], discType: 'amt', discount: 0 }
    return a.draftInv
}
export function pkgMatches(p, txId) {
    return !!(p.package && p.package.treatmentId === txId && p.package.used < p.package.total)
}
export function computeInvoice(a) {
    const p = getPatient(a.pid)
    const d = invDraft(a)
    const items = []
    let subtotal = 0
    let pkgDeduct = 0
    d.lines.forEach((ln) => {
        if (pkgMatches(p, ln.txId)) {
            items.push({ label: `${txName(ln.txId)} — package session`, amt: 0, pkg: true })
            pkgDeduct += 1
        } else {
            const pr = txPrice(ln.txId)
            items.push({ label: txName(ln.txId), amt: pr })
            subtotal += pr
        }
    })
    let discount = 0
    if (d.discount > 0 && subtotal > 0) {
        discount = d.discType === 'pct' ? Math.round((subtotal * Math.min(d.discount, 100)) / 100) : Math.min(d.discount, subtotal)
    }
    const total = subtotal - discount
    return { items, subtotal, discount, total, pkgDeduct, status: 'draft' }
}