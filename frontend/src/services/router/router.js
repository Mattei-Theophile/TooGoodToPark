import {createRouter, createWebHistory} from "vue-router";
import {isLoggedIn} from "@/services/Auth/auth.js";

import Auth from "@/pages/Auth.vue";
import Home from "@/pages/client/Home.vue";
import Account from "@/pages/Account.vue";
import Settings from "@/pages/Settings.vue";
import Announce from "@/pages/client/Announce.vue";

import Login from "@/components/core/login.vue";
import Register from "@/components/core/register.vue";

const routes = [
    {
        path:'/',
        name:'Home',
        component:Home,
        meta:{
            requireAuth:false,
        }
    },
    {
        path:'/announce',
        name:'Announce',
        component:Announce,
        meta:{
            requireAuth:false,
        }
    },
    {
        path:'/connect',
        name:'Auth',
        component:Auth,
        meta:{
            requireAuth:false,
        },
        children: [
            {
                path: '',
                redirect:'/login'
            },
            {
                path:'/login',
                name: 'Login',
                component: Login
            },
            {
                path:'/register',
                name: 'Register',
                component: Register
            }
        ]
    },
    {
        path:'/account',
        name:'Account',
        component:Account,
        meta:{
            requireAuth:true,
        }
    },
    {
        path:'/settings',
        name:'Settings',
        component:Settings,
        meta:{
            requireAuth:true,
        }
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth && !isLoggedIn()) {
        console.log("The user is not logged in");
        next('/login') // Redirect to login page
    } else {
        next() // Allow navigation
    }
})
export default router;