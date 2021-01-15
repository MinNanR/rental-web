const baseUrl = "http://localhost:2000/rental"

const request = function (url, param) {
  return new Promise(resolve => {
    uni.request({
      url: `${baseUrl}${url}`,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
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
}

export default request