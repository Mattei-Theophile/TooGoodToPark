import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/UserStore.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/client/Home.vue'),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/announce/',
    name: 'Announce',
    component: () => import('@/views/client/Announce.vue'),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/client/History.vue'),
    meta: {
      requireAuth: true,
    },
  },
  {
    path: '/car/:id',
    name: 'Car',
    component: () => import('@/views/Car.vue'),
    meta: {
      requireAuth: false,
    },
    props: true,
  },
  {
    path: '/reservation',
    name: 'Reservation',
    component: () => import('@/views/Reserve.vue'),
    meta: {
      requireAuth: true,
    },
    props: true,
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/client/Search.vue'),
    meta: {
      requireAuth: false,
    },
    props: true,
  },
  {
    path: '/login',
    name: 'Auth',
    component: () => import('@/views/authentification/Auth.vue'),
    meta: {
      requireAuth: false,
    },
    children: [
      {
        path: '/',
        redirect: '/login',
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/components/core/login.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/components/core/register.vue'),
      },
    ],
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/user/Account.vue'),
    meta: {
      requireAuth: true,
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
        component: () => import('@/views/user/feature/NewCar.vue'),
      },
      {
        path: 'cars/edit/:id',
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
    next('/login') // Redirect to login page
  } else {
    next() // Allow navigation
  }
})
export default router
