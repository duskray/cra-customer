import axios from 'axios'
import { Toast } from 'antd-mobile'
// import qs from 'qs'

const ax = {
  loading: false,
  token: ``,

  q: (method = 'get', url = '', data = {}) => {
    if (!ax.loading) {
      ax.loading = true
      Toast.loading('加载中...', 0, null, true)
    }
    const paramsKey = method === 'get' ? 'params' : 'data';
    // const paramsValue = method === 'get' ? data : qs.stringify(data, { arrayFormat: 'brackets' })
    return new Promise((resolve, reject) => {
      axios({
        method: method,
        baseURL: process.env.NODE_ENV === 'development' ? '/' : window.REACT_APP_URL,
        url: url,
        [paramsKey]: { Data: [data] },
        withCredentials: true,
        headers: {
          'Authorization': 'Bearer ' + ax.token,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then(r => {
        Toast.hide()
        ax.loading = false
        if (r.status >= 200 && r.status < 300) {
          if (r.data.Data == null) {
            if (r.data.Msg) {
              Toast.info(r.data.Msg, 2, null, false)
            }
            reject(r.data)
            return
          }
          const d = JSON.parse(r.data.Data[0].data)
          console.log(decodeURI(url))
          console.log(d)
          resolve(d)
        } else {
          reject(r.data);
          if (r.data.Msg) {
            Toast.fail(r.data.Msg, 2, null, false)
          }
        }
      }).catch(e => {
        Toast.hide()
        ax.loading = false
        reject(e)
        const status = e.response.status
  
        if (status === 401) {
          Toast.fail(e.response.data.Msg, 2, null, false)
          return;
        }
        if (e.response) {
          console.log(e.response)
          Toast.fail(e.response.data.Msg ? e.response.data.Msg : e.response.statusText, 2, null, false)
        } else if (e.request) {
          console.log(e.request);
          Toast.offline('网络连接失败', 2, null, false)
        } else {
          console.log('Error', e.message);
        }
      })
    })
  },
  get: (url, data) => {
    if (url.startsWith('/')) {
      return ax.q('get', url, data);
    } else {
      return ax.q('get', ax.baseUrl + url, data);
    }
  },
  post: (url, data) =>  ax.q('post', url, data),
  patch: (url, data) => ax.q('patch', url, data),
  put: (url, data) => ax.q('put', url, data),
  delete: (url, data) => ax.q('delete', url, data),
  all: axios.all,
  spread: axios.spread,
}

export default ax
