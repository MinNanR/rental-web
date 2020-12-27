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
        component: () => import('../components/layout/layout.vue'),
        children: [
            {
                path: "/",
                component: () => import('../components/index/index.vue')
            },
            {
                path: 'house',
                component: () => import('../components/house/index.vue'),
                meta: {
                    title: "房屋信息"
                },
            },
            {
                path: 'addHouse',
                component: () => import('../components/house/addHouse.vue'),
                meta: {
                    title: '添加房屋'
                }
            },
            {
                path: 'houseInfo',
                component: () => import('../components/house/updateHouse.vue'),
                meta: {
                    title: '修改房屋'
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/unauthorized' || to.path == '/login') {
        next()
    } else {
        const token = localStorage.getItem("token")
        if (token == null) {
            next('/login')
        } else {
            next()
        }
        document.title = `${to.meta.title}`
    }
})

export default router