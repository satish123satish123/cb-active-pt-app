/* =====================================================================
   PHYSIO API LAYER — real CRM endpoints for the physio module.
   Uses the same axios `api` instance as authStore (CRM base URL +
   Bearer token are already configured after login).
===================================================================== */
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

/* TODO(API): pending endpoints from backend —
   - confirm / decline a pending appointment
   Wire them in DashboardPage when ready — TODO markers are in place. */