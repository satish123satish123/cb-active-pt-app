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
    return user?.doctor_id || user?.doctorId || user?.id || user?.user_id || null
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

/* TODO(API): pending endpoints from backend —
   - physio check-in / check-out (mark attendance)
   - confirm / decline a pending appointment
   Wire them in DashboardPage when ready — TODO markers are in place. */