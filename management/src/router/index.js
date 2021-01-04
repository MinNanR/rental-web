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
                component: () => import('../components/index/index.vue'),
                meta: {
                    title: "主页"
                }
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
            },
            {
                path: 'room',
                component: () => import('../components/room/index.vue'),
                meta: {
                    title: '房间信息'
                }
            },
            {
                path: 'addRoom',
                component: () => import('../components/room/addRoom.vue'),
                meta: {
                    title: "添加房间"
                }
            },
            {
                path: 'updateRoom',
                component: () => import('../components/room/updateRoom.vue'),
                meta: {
                    title: "修改房间"
                }
            },
            {
                path: 'roomInfo',
                component: () => import('../components/room/roomInfo.vue'),
                meta: {
                    title: "房间信息"
                }
            },
            {
                path: 'tenant',
                component: () => import('../components/tenant/index.vue'),
                meta: {
                    title: "房客信息"
                }
            },
            {
                path: 'addTenant',
                component: () => import('../components/tenant/addTenant.vue'),
                meta: {
                    title: '添加房客'
                }
            },
            {
                path: 'tenantInfo',
                component: () => import('../components/tenant/updateTenant.vue'),
                meta: {
                    title: '修改房客信息'
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