import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/UserStore.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/client/Home.vue'),
    meta: {
      requireAuth: false,
      showSidebar: false, // Public: No sidebar
      showHeader: true, // Public: Show header
    },
  },
  {
    path: '/announce/:id',
    name: 'Announce',
    component: () => import('@/views/client/Announce.vue'),
    meta: {
      requireAuth: false,
      showSidebar: false,
      showHeader: true,
    },
    props: true,
  },
  {
    path: '/reservation',
    name: 'Reservation',
    component: () => import('@/views/Reserve.vue'),
    meta: {
      requireAuth: true,
      showSidebar: false,
      showHeader: true,
    },
    props: true,
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/client/Search.vue'),
    meta: {
      requireAuth: false,
      showSidebar: false,
      showHeader: true,
    },
    props: true,
  },
  {
    path: '/login',
    name: 'Auth',
    component: () => import('@/views/authentification/Auth.vue'),
    meta: {
      requireAuth: false,
      showSidebar: false,
      showHeader: true,
    },
    children: [
      {
        path: '/',
        redirect: '/login',
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/components/core/authentification/Login.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/components/core/authentification/Register.vue'),
      },
    ],
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/user/Account.vue'),
    meta: {
      requireAuth: true,
      showSidebar: true,
      showHeader: false,
    },
    children: [
      {
        path: '',
        name: 'MainAccount',
        component: () => import('@/views/user/feature/MainAccount.vue'),
      },
      {
        path: 'reservations',
        name: 'ReservationsAccount',
        component: () => import('@/views/user/feature/ReservationAccount.vue'),
      },
      {
        path: 'cars',
        name: 'CarsAccount',
        component: () => import('@/views/user/feature/CarAccount.vue'),
      },
      {
        path: 'cars/add',
        name: 'NewCarAccount',
        component: () => import('@/views/user/feature/AddCar.vue'),
      },
      {
        path: 'cars/edit/:carID',
        name: 'EditCarAccount',
        component: () => import('@/views/user/feature/EditCar.vue'),
        props: true,
      },
      {
        path: 'settings',
        name: 'SettingsAccount',
        component: () => import('@/views/user/feature/SettingsAccount.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth && !useUserStore().isLoggedIn()) {
    console.log('The user is not logged in')
    next('/login')
  } else {
    next()
  }
})

export default router
