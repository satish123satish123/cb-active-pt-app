import { ROLE } from 'src/stores/authStore'

/**
 * The lead-manager screens are a UI-only preview: the app has no lead-manager
 * login or endpoints yet, so the routes are left open for the team to review.
 *
 * Flip this to `false` the day the lead-manager login goes live — the guard
 * then turns on with no other change anywhere.
 */
const LEAD_MANAGER_UI_PREVIEW = true
const LEAD_MANAGER_META = LEAD_MANAGER_UI_PREVIEW
  ? { requiresAuth: false }
  : { requiresAuth: true, requiresRole: ROLE.LEAD_MANAGER }

const routes = [
  {
    path: '/corporate-assessment',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PreAssessmentForm.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        component: () => import('src/pages/auth/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/AppLayout.vue'),
    meta: { requiresAuth: true, requiresRole: ROLE.PATIENT },
    children: [
      {
        path: '/',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: '/progress',
        component: () => import('pages/ProgressPage.vue'),
      },
      {
        path: '/session-timeline',
        component: () => import('pages/SessionTimeline.vue'),
      },
      {
        path: '/appointments',
        component: () => import('pages/AppointmentsPage.vue'),
      },
      {
        path: '/exercises',
        component: () => import('pages/ExercisesPage.vue'),
      },
      {
        path: '/exercise-player/:exercise_id',
        component: () => import('pages/ExercisePlayerScreen.vue'),
      },
      {
        path: '/exercise-history',
        component: () => import('pages/ExerciseHistoryScreen.vue'),
      },
      {
        path: '/payments-packages',
        component: () => import('pages/PaymantAndPackagesScreen.vue'),
      },
      {
        path: '/education',
        component: () => import('pages/EducationScreen.vue'),
      },
      {
        path: '/support',
        component: () => import('pages/SupportPage.vue'),
      },
      {
        path: '/treatment-plan',
        component: () => import('pages/ClinicalTreatmentPlan.vue'),
      },
      { path: '/profile', component: () => import('pages/ProfilePage.vue') },
      {
        path: '/profile/personal-info',
        component: () => import('pages/profile/PersonalInfoPage.vue'),
      },
      {
        path: '/profile/reset-pin',
        component: () => import('pages/profile/ResetPinPage.vue'),
      },
    ],
  },
  {
    path: '/physio',
    component: () => import('layouts/AppLayout.vue'),
    meta: { requiresAuth: true, requiresRole: ROLE.DOCTOR },
    children: [
      {
        path: '',
        component: () => import('pages/physio/DashboardPage.vue'),
      },
      {
        path: 'patients',
        component: () => import('pages/physio/PatientList.vue'),
      },
      {
        path: 'roster',
        component: () => import('pages/physio/RosterPage.vue'),
      },
      {
        path: 'patients/:id',
        component: () => import('pages/physio/PatientDetailPage.vue'),
      },
      {
        path: 'treatment/:id',
        component: () => import('pages/physio/TreatmentPage.vue'),
      },
      {
        path: 'invoice/:id',
        component: () => import('pages/physio/InvoicePage.vue'),
      },
      {
        path: 'followup/:id',
        component: () => import('pages/physio/FollowupPage.vue'),
      },
      {
        path: 'appointments',
        component: () => import('pages/physio/AppointmentsPage.vue'),
      },
      {
        path: 'profile',
        component: () => import('pages/physio/ProfilePage.vue'),
      },
    ],
  },
  {
    path: '/lead-manager',
    component: () => import('layouts/LeadManagerLayout.vue'),
    meta: LEAD_MANAGER_META,
    children: [
      {
        path: '',
        meta: { title: 'Dashboard' },
        component: () => import('pages/lead-manager/DashboardPage.vue'),
      },
      {
        path: 'leads',
        meta: { title: 'Leads' },
        component: () => import('pages/lead-manager/LeadsPage.vue'),
      },
      {
        path: 'leads/:id',
        meta: { title: 'Lead Details' },
        component: () => import('pages/lead-manager/LeadDetailPage.vue'),
      },
      {
        path: 'feedback',
        meta: { title: 'Patient Feedbacks' },
        component: () => import('pages/lead-manager/FeedbackPage.vue'),
      },
      {
        path: 'communications',
        redirect: '/lead-manager/communications/queries',
      },
      {
        path: 'communications/queries',
        meta: { title: 'Queries' },
        component: () => import('pages/lead-manager/QueriesPage.vue'),
      },
      {
        path: 'communications/exophones',
        meta: { title: 'Exophones' },
        component: () => import('pages/lead-manager/ExophonesPage.vue'),
      },
      {
        path: 'profile',
        meta: { title: 'Profile' },
        component: () => import('pages/lead-manager/ProfilePage.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
