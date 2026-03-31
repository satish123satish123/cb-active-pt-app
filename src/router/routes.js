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
    path: '/session',
    component: () => import('pages/SessionPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    component: () => import('layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '/', component: () => import('pages/DashboardPage.vue') },
      { path: '/report', component: () => import('pages/ReportPage.vue') },
      { path: '/appointments', component: () => import('pages/AppointmentsPage.vue') },
      { path: '/profile', component: () => import('pages/ProfilePage.vue') },
      {
        path: '/profile/personal-info',
        component: () => import('pages/profile/PersonalInfoPage.vue'),
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
