const routes = [
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
    meta: { requiresAuth: true },
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
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
