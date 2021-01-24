const baseUrl = "http://192.168.137.1:2000/rental"
import localstorage from './localstorage.js'

const request = {
  post: function (url, param) {
    let header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    let token = localstorage.getStorage("token")
    if (token !== null && token !== '') {
      header.Authorization = token
    }
    return new Promise(resolve => {
      uni.request({
        url: `${baseUrl}${url}`,
        method: "POST",
        header: header,
        timeout: 5000,
        data: param,
        success: (response) => {
          if (response.statusCode === 200) {
            let data = response.data
            if (data.code === '000') {
              resolve(data)
            }
            else {
              return Promise.reject(data.message)
            }
          }
          else if (response.statusCode === 401) {
            localstorage.removeStorage("token")
            uni.showModal({
              showCancel: false,
              title: "身份校验失败",
              content: response.data.message | '登录信息缺失',
              confirmText: "确定",
              success: (res) => {
                if(res.confirm){
                  uni.navigateTo({url:"/pages/login/login"})
                }
              }
            })
          }
          else {
            return Promise.reject(response)
          }
        },
        fail: (err) => {
          return Promise.reject(err)
        }
      })
    })
  },

  get: function (url, param) {
    return new Promise(resolve => {
      uni.request({
        url: `${baseUrl}${url}`,
        method: "GET",
        timeout: 5000,
        data: param,
        success: (response) => {
          if (response.statusCode === 200) {
            let data = response.data
            if (data.code === '000') {
              resolve(data)
            } else {
              return Promise.reject(data.message)
            }
          } else {
            return Promise.reject()
          }
        },
        fail: (err) => {
          return Promise.reject(err)
        }
      })
    })
  },
}

export default request