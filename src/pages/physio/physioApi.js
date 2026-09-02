/* =====================================================================
   PHYSIO API LAYER — real CRM endpoints for the physio module.
   Uses the same axios `api` instance as authStore (CRM base URL +
   Bearer token are already configured after login).
===================================================================== */
import { reactive } from 'vue'
import { api } from 'src/boot/axios'

/**
 * The doctor_id comes from the login response (authStore.user).
 * Field name may vary by backend — try the likely ones in order.
 */
export function resolveDoctorId(user) {
  // CRM login response carries the physio's doctor id in `doctor` (e.g. "561").
  // `id`/`user_id` are the LOGIN ACCOUNT id (e.g. "10188") — only a last-resort fallback.
  return user?.doctor || user?.doctor_id || user?.doctorId || user?.id || user?.user_id || null
}

/**
 * The hospital_id also comes from the login response (authStore.user.hospital_id).
 */
export function resolveHospitalId(user) {
  return user?.hospital_id || user?.hospitalId || null
}

/**
 * Live treatment sessions started from the dashboard, keyed by appointment_id
 * → { patient, session, log[] }. PERSISTED to localStorage so a page refresh
 * doesn't lose the running session (works on the same device/browser).
 * A proper server-side "resume session" API is still the long-term fix.
 */
const LIVE_LS_KEY = 'activpt_live_sessions_v1'
function readLive() {
  try {
    return JSON.parse(localStorage.getItem(LIVE_LS_KEY) || '{}')
  } catch {
    return {}
  }
}
export const liveSessions = reactive(readLive())

/**
 * Billing outcome per appointment ('invoiced' | 'paid') — bridges the gap until
 * the list API's payment_status reflects a just-created invoice. PERSISTED to
 * localStorage (entries valid for today only) so a refresh doesn't resurface
 * "Generate invoice" for an already-invoiced appointment.
 */
const BILL_LS_KEY = 'activpt_billing_state_v1'
function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function readBillingState() {
  try {
    const o = JSON.parse(localStorage.getItem(BILL_LS_KEY) || '{}')
    for (const k of Object.keys(o)) if (o[k]?.date !== todayKey()) delete o[k]
    return o
  } catch {
    return {}
  }
}
export const apptBillingState = reactive(readBillingState())
function persistBillingState() {
  try {
    localStorage.setItem(BILL_LS_KEY, JSON.stringify(apptBillingState))
  } catch (e) {
    console.log('persistBillingState failed:', e)
  }
}
export function setApptBillingState(apptId, outcome) {
  apptBillingState[apptId] = { outcome, date: todayKey() }
  persistBillingState()
}
export function clearApptBillingState(apptId) {
  delete apptBillingState[apptId]
  persistBillingState()
}
export function getApptBillingOutcome(apptId) {
  const e = apptBillingState[apptId]
  return typeof e === 'string' ? e : e?.outcome || null
}
export function persistLiveSessions() {
  try {
    localStorage.setItem(LIVE_LS_KEY, JSON.stringify(liveSessions))
  } catch (e) {
    console.log('persistLiveSessions failed:', e)
  }
}

/**
 * Local "status overlay" — remembers check-in / in-treatment done from THIS
 * device so a refresh doesn't visually revert them while the list API lacks
 * those states. Safeguards: entries are valid for today only, and only apply
 * while the server still reports the appointment as booked/confirmed.
 * Interim fix — the list API should ultimately return these states itself.
 */
const OVERLAY_LS_KEY = 'activpt_status_overlay_v1'
export function readLocalApptStatuses() {
  try {
    return JSON.parse(localStorage.getItem(OVERLAY_LS_KEY) || '{}')
  } catch {
    return {}
  }
}
export function rememberLocalApptStatus(apptId, status, dateISO) {
  const o = readLocalApptStatuses()
  o[apptId] = { status, date: dateISO }
  try {
    localStorage.setItem(OVERLAY_LS_KEY, JSON.stringify(o))
  } catch (e) {
    console.log('overlay write failed:', e)
  }
}
export function clearLocalApptStatus(apptId) {
  const o = readLocalApptStatuses()
  delete o[apptId]
  try {
    localStorage.setItem(OVERLAY_LS_KEY, JSON.stringify(o))
  } catch (e) {
    console.log('overlay write failed:', e)
  }
}

/**
 * getPhysioRoster — today's + tomorrow's roster and attendance state.
 * Params: doctor_id
 */
export async function getPhysioRoster(doctorId) {
  const { data } = await api.post('getPhysioRoster', { doctor_id: doctorId })
  return data
}

/**
 * getPhysioTodayAppointments — today's appointments grouped by status.
 * Params: doctor_id
 * Groups: treated / pending_confirmation / cancelled / confirmed / other (+counts)
 */
export async function getPhysioTodayAppointments(doctorId) {
  const { data } = await api.post('getPhysioTodayAppointments', { doctor_id: doctorId })
  return data
}

/**
 * getPhysioAppointments — this physio's appointments across a date range, for the
 * "All appointments" screen. Items carry the SAME shape as the today endpoint's, so
 * both screens share one mapper.
 * Payload: { doctor_id, from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
 * → { appointments: [ ... ] }  — flat, sorted by date then start time
 */
export async function getPhysioAppointments(payload) {
  const { data } = await api.post('getPhysioAppointments', payload)
  return data
}

/**
 * physioCheckin — mark attendance start for today.
 * Params: doctor_id
 * Response: { status, message, checkin: "HH:MM" }
 */
export async function physioCheckin(doctorId) {
  const { data } = await api.post('physioCheckin', { doctor_id: doctorId })
  return data
}

/**
 * physioCheckout — mark attendance end for today.
 * Params: doctor_id
 * Response: { status, message, checkout: "HH:MM" }
 */
export async function physioCheckout(doctorId) {
  const { data } = await api.post('physioCheckout', { doctor_id: doctorId })
  return data
}

/**
 * confirmAppointment — physio confirms a pending appointment.
 * Payload: { appointment_id, doctor_id, hospital_id, remarks, time_slot ("02:30 PM"), duration }
 */
export async function confirmAppointment(payload) {
  const { data } = await api.post('confirmAppointment', payload)
  return data
}

/**
 * cancelAppointment — physio declines/cancels an appointment.
 * Payload: { appointment_id, doctor_id, hospital_id, remark }
 */
export async function cancelAppointment(payload) {
  const { data } = await api.post('cancelAppointment', payload)
  return data
}

/**
 * checkInPatient — mark a booked patient as arrived/ready.
 * Payload: { appointment_id, doctor_id, hospital_id } → { ready_time }
 */
export async function checkInPatient(payload) {
  const { data } = await api.post('checkInPatient', payload)
  return data
}

/**
 * startAppointment — start the treatment session.
 * Payload: { appointment_id, doctor_id, hospital_id }
 * → { actual_session_start, tracking, data: modalities_data }
 */
export async function startAppointment(payload) {
  const { data } = await api.post('startAppointment', payload)
  return data
}

/**
 * startModality — start one modality's timer on the server.
 * Payload: { appointment_id, modality_id, hospital_id, patient_id,
 *            modality_label, started_at ("11:42"), start_at_iso }
 * → { data: { status, start_at_hm, start_at_iso }, redirect_url? }
 */
export async function startModality(payload) {
  const { data } = await api.post('startModality', payload)
  return data
}

/**
 * endModality — stop one modality's timer on the server.
 * Payload: { appointment_id, modality_id, hospital_id, patient_id,
 *            ended_at ("12:55"), end_at_iso }
 * → { data: { status, end_at_hm, end_at_iso, started_at_iso, duration_ms } }
 */
export async function endModality(payload) {
  const { data } = await api.post('endModality', payload)
  return data
}

/**
 * Time helpers for modality start/end payloads (IST +05:30).
 */
export function nowHM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
export function nowISO() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  const off = -d.getTimezoneOffset()
  const sign = off >= 0 ? '+' : '-'
  const oh = p(Math.floor(Math.abs(off) / 60))
  const om = p(Math.abs(off) % 60)
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}${sign}${oh}:${om}`
}

/**
 * getPhysioDefaultModalities — the clinic's modality catalogue.
 * Payload: { hospital_id } → { items: [{ name, id, category }] }
 */
export async function getPhysioDefaultModalities(payload) {
  const { data } = await api.post('getPhysioDefaultModalities', payload)
  return data
}

/**
 * getPhysioAppointmentModalities — clinical context for this session.
 * Payload: { appointment_id, patient_id, hospital_id }
 * → { data: { selected_modalities, milestones, contraindications, session_number, assessment_id } }
 */
export async function getPhysioAppointmentModalities(payload) {
  const { data } = await api.post('getPhysioAppointmentModalities', payload)
  return data
}

/**
 * removeModality — remove a logged modality timing.
 * Payload: { appointment_id, modality_id, patient_id, hospital_id }
 */
export async function removeModality(payload) {
  const { data } = await api.post('removeModality', payload)
  return data
}

/**
 * endSession — finish the treatment session.
 * Payload: { appointment_id, doctor_id, hospital_id }
 * → { actual_session_end, redirect_url (CRM finance page) }
 */
export async function endSession(payload) {
  const { data } = await api.post('endSession', payload)
  return data
}

/**
 * saveNoModalityReasonAndEndSession — end session when no modality was given.
 * Payload: { appointment_id, doctor_id, hospital_id, reason }
 */
export async function saveNoModalityReasonAndEndSession(payload) {
  const { data } = await api.post('saveNoModalityReasonAndEndSession', payload)
  return data
}

/**
 * getPatientTreatmentDetails — full patient treatment profile.
 * Payload: { patient_id, hospital_id }
 * → { data: { patient_details, Billing, reassessment_details, session_number, visits } }
 */
export async function getPatientTreatmentDetails(payload) {
  const { data } = await api.post('getPatientTreatmentDetails', payload)
  return data
}

/**
 * getPhysioAppointmentSlots — available + booked slots for the confirm sheet.
 * Payload: { appointment_id, doctor_id, date? }
 * `date` ("MM/DD/YYYY") is optional — send it to see another day's slots, which is
 * what the follow-up sheet needs. `doctor_id` may be any physio of the hospital.
 * → { aslots, bslots, duration, duration_options, current_value, date }
 */
export async function getPhysioAppointmentSlots(payload) {
  const { data } = await api.post('getPhysioAppointmentSlots', payload)
  return data
}

/**
 * getHospitalPhysios — active physiotherapists of a hospital, for the
 * "book the follow-up with another physio" picker.
 * Payload: { hospital_id, doctor_id }  (doctor_id only marks is_self)
 * → { physios: [{ id, name, is_self }] }
 */
export async function getHospitalPhysios(payload) {
  const { data } = await api.post('getHospitalPhysios', payload)
  return data
}

/**
 * getAppointmentInvoiceDetails — billing context after a session ends.
 * Payload: { appointment_id, doctor_id, hospital_id, patient_id }
 * → { has_active_package, package_details[], treatment_procedures[], redirect_url }
 */
export async function getAppointmentInvoiceDetails(payload) {
  const { data } = await api.post('getAppointmentInvoiceDetails', payload)
  return data
}

/**
 * addPayment — create the invoice for a session.
 * Payload: { appointment_id, appointment_type: "Clinic", patient_id, doctor_id,
 *   hospital_id, category_id: [ids], quantity: [1,...], discount, remarks,
 *   appointment_date: "YYYY-MM-DD", package_payment_id? }
 * → is_in_package true (settled) | next_action "makepayment" + makePayment{...}
 */
export async function addPayment(payload) {
  const { data } = await api.post('addPayment', payload)
  return data
}

/**
 * patientDeposit — record the received payment (ids are salt-encoded).
 */
export async function patientDeposit(payload) {
  const { data } = await api.post('patientDeposit', payload)
  return data
}

/**
 * getPaidViaByPaymentMethod — payment method options (UPI, card, QR…).
 * Payload: { paid_to, hospital_id }
 */
export async function getPaidViaByPaymentMethod(payload) {
  const { data } = await api.post('getPaidViaByPaymentMethod', payload)
  return data
}

/**
 * getFollowupDetails — prefill + unique_identifier for booking a follow-up.
 * Payload: { appointment_id }
 */
export async function getFollowupDetails(payload) {
  const { data } = await api.post('getFollowupDetails', payload)
  return data
}

/**
 * addFollowupByPhysio — book the next appointment.
 * Payload: patient, doctor, parent_appointment, date ("MM/DD/YYYY"),
 *   time_slot ("10:00 AM To 10:45 AM"), duration, suggested_* arrays,
 *   current_session_number, remarks, unique_identifier, status "Confirmed"…
 */
export async function addFollowupByPhysio(payload) {
  const { data } = await api.post('addFollowupByPhysio', payload)
  return data
}

/** Helpers for the payment flow */
export function encodeWithSalt(id, salt) {
  return btoa(String(id) + String(salt || ''))
}
export function randHex32() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * getPhysioPatients — this physio's caseload (unique patients from appointments).
 * Payload: { doctor_id } → { patients: [{ id, name, salutation, phone, sex, age,
 *   status, is_active_patient, current_condition, package_*, pain_level }] }
 */
export async function getPhysioPatients(payload) {
  const { data } = await api.post('getPhysioPatients', payload)
  return data
}

/**
 * getPhysioPatientDetails — one patient's profile, package, latest feedback, visits.
 * Payload: { doctor_id, patient_id }
 */
export async function getPhysioPatientDetails(payload) {
  const { data } = await api.post('getPhysioPatientDetails', payload)
  return data
}

/**
 * getAssessmentResumeState — Start vs Resume for the ASSESSMENT/REASSESSMENT row.
 * The CRM does the version-aware lookup itself (v1 vs v2 assessment tool), so the
 * app must NOT query the assessment tool directly — the response's `checked_url`
 * shows which endpoint the server actually hit.
 * Payload: { appointment_id, hospital_id }
 * → { show_resume, assessment_id, assessment_version, resume_url, checked_url, lookup_failed }
 */
export async function getAssessmentResumeState(payload) {
  const { data } = await api.post('getAssessmentResumeState', payload)
  return data
}

/**
 * Out-of-package invoicing review — reason saved before invoicing a procedure
 * that isn't covered by the patient's active package.
 */
export async function saveInvoiceReviewReason(payload) {
  const { data } = await api.post('saveInvoiceReviewReason', payload)
  return data
}
export async function deleteInvoiceReviewReason(payload) {
  const { data } = await api.post('deleteInvoiceReviewReason', payload)
  return data
}

/**
 * addModality — attach a modality to the running session (no timer started yet).
 * Payload: { appointment_id, patient_id, hospital_id, modality_label }
 */
export async function addModality(payload) {
  const { data } = await api.post('addModality', payload)
  return data
}

/* TODO(API): pending endpoints from backend —
   - updatePhysioRoster (edit day from Roster screen)
   - updatePhysioRoster (edit day from Roster screen) */