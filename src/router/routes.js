const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/app',
    component: () => import('layouts/AppLayout.vue'),
    children: [
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: '/profile', component: () => import('pages/ProfilePage.vue') },
      { path: '/profile/personal-info', component: () => import('pages/profile/PersonalInfoPage.vue') },
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
