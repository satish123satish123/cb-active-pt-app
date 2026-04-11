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
        path: '/appointments',
        component: () => import('pages/AppointmentsPage.vue'),
      },
      {
        path: '/exercises',
        component: () => import('pages/ExercisesPage.vue'),
        meta: { requiresAuth: true },
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
