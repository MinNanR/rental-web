import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import router from './router'
import request from './utils/request'
import App from './App.vue'

const app = createApp(App)

console.log(router)

router.beforeEach((to, from, next) => {
    console.log(to.path)
    if (to.path == '/unauthorized' || to.path == '/login') {
        next()
    } else {
        const token = localStorage.getItem("token")
        let whiteList = localStorage.getItem("whiteList")
        whiteList = whiteList == null ? [] : whiteList
        if (token == null) {
            next('/login')
        } else if (whiteList.indexOf(to.path) != -1) {
            next()
        } else {
            next('/unauthorized')
        }
    }
    document.title = `${to.meta.title}`
})

app.use(ElementPlus)
app.use(router)
app.request = request
app.$router = router
// app.use(request)
app.mount("#app")




export default app