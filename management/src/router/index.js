import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{
        path: '/login',
        component: () =>
            import ('../components/login/login.vue'),
        meta: {
            title: '登陆'
        }
    },
    {
        path: '/',
        component: () =>
            import ('../components/layout/layout.vue'),
        children: [{
                path: "/",
                component: () =>
                    import ('../components/index/index.vue'),
                meta: {
                    title: "主页"
                }
            },
            {
                path: 'house',
                component: () =>
                    import ('../components/house/index.vue'),
                meta: {
                    title: "房屋信息"
                },
            },
            {
                path: 'addHouse',
                component: () =>
                    import ('../components/house/addHouse.vue'),
                meta: {
                    title: '添加房屋'
                }
            },
            {
                path: 'houseInfo',
                component: () =>
                    import ('../components/house/updateHouse.vue'),
                meta: {
                    title: '修改房屋'
                }
            },
            {
                path: 'room',
                component: () =>
                    import ('../components/room/index.vue'),
                meta: {
                    title: '房间信息'
                }
            },
            {
                path: 'addRoom',
                component: () =>
                    import ('../components/room/addRoom.vue'),
                meta: {
                    title: "添加房间"
                }
            },
            {
                path: 'updateRoom',
                component: () =>
                    import ('../components/room/updateRoom.vue'),
                meta: {
                    title: "修改房间"
                }
            },
            {
                path: 'roomInfo',
                component: () =>
                    import ('../components/room/roomInfo.vue'),
                meta: {
                    title: "房间信息"
                }
            },
            {
                path: 'tenant',
                component: () =>
                    import ('../components/tenant/index.vue'),
                meta: {
                    title: "房客信息"
                }
            },
            {
                path: 'addTenant',
                component: () =>
                    import ('../components/tenant/addTenant.vue'),
                meta: {
                    title: '添加房客'
                }
            },
            {
                path: 'tenantInfo',
                component: () =>
                    import ('../components/tenant/updateTenant.vue'),
                meta: {
                    title: '修改房客信息'
                }
            },
            {
                path: 'user',
                component: () =>
                    import ('../components/user/index.vue'),
                meta: {
                    title: '用户信息'
                }
            },
            {
                path: 'adduser',
                component: () =>
                    import ('../components/user/addUser.vue'),
                meta: {
                    title: '添加用户'
                }
            },
            {
                path: 'updateUser',
                component: () =>
                    import ('../components/user/updateUser.vue'),
                meta: {
                    title: '修改用户信息'
                }
            },
            {
                path: 'utility',
                component: () =>
                    import ('../components/utility/index.vue'),
                meta: {
                    title: '水电'
                }
            },
            {
                path: "historyRecord",
                component: () =>
                    import ('../components/utility/historyRecord.vue'),
                meta: {
                    title: '水电记录'
                }
            },
            {
                path: "bill",
                component: () =>
                    import ('../components/bill/index.vue'),
                meta: {
                    title: '账单'
                }
            },
            {
                path: "settle",
                component: () =>
                    import ('../components/bill/settle.vue'),
                meta: {
                    title: '结算'
                }
            },
            {
                path: "receipt",
                component: () =>
                    import ('../components/bill/receipt.vue'),
                meta: {
                    title: "收据"
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory("rental"),
    routes: routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/unauthorized' || to.path == '/login') {
        next()
    } else {
        const token = localStorage.getItem("rental-token")
        if (token == null) {
            next('/login')
        } else {
            next()
        }
        document.title = to.meta.title || '出租屋管理系统'
    }
})

export default router