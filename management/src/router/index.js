import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: '/login',
        component: () => import('../components/login.vue'),
        meta: {
            title: '登陆'
        }
    },
    {
        path: '/',
        component: () => import('../components/layout/layout.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router