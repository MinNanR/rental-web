import axios from 'axios'
import config from './config.js'
import app from '../main.js'
console.log(config.baseUrl)

const request = axios.create({
    baseURL: config.baseUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    transformRequest: [
        (data) => {
            return JSON.stringify(data)
        }
    ]
})

request.interceptors.request.use(
    config => {
        let token = localStorage.getItem('token')
        config.headers.authorization = token
        return config;
    },
    error => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {
        if (response.status === 200) {
            let data = response.data
            if (data.code === '000') {
                return { data: data.data, message: data.message }
            } else {
                Promise.reject(data.message)
            }
        } else {
            Promise.reject()
        }
    },
    error => {
        if (error.response.status != null) {
            if (error.response.status === 401) {
                localStorage.removeItem("token")
                alert("登录信息过期")
                app.router.push("/login")
            } else if (error.response.status === 403) {
                localStorage.removeItem("token")
                alert("无权限")
                app.router.push('/login')
            }
            Promise.reject(error)
        } else {
            Promise.reject(error)
        }
    }
)

export default request
