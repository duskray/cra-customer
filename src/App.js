import React, { Component } from 'react';
import './App.scss';
import Routes from "./Routes";
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPhone, faAngleRight, faLocationArrow, faMoneyCheck, faMapMarkerAlt, faSyncAlt, faPiggyBank,
  faStar
} from '@fortawesome/free-solid-svg-icons'
import { faClock, faUser, faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faWeixin, faAlipay } from '@fortawesome/free-brands-svg-icons'
import { Toast } from 'antd-mobile'
import axios from 'axios'
import ax from 'utils/ax'
import { getUrlParam } from 'utils'

library.add(
  faPhone, faAngleRight, faLocationArrow, faMoneyCheck, faClock, faMapMarkerAlt, faSyncAlt, faWeixin, faPiggyBank, faAlipay,
  faUser, faStar, farStar
)

class App extends Component {
  state = {
    token: ''
  }

  componentDidMount = async () => {
    if (process.env.NODE_ENV === 'development') {
      ax.token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImZhOGI3MGViYWZmY2M5MzFmNGM0ZTZjOWUwNGI0OGE5IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NDc0NjA0OTYsImV4cCI6MTU0NzQ3NDg5NiwiaXNzIjoiaHR0cDovL3d3dy5kYXFpYW4udGhpbmtidWlsZGVyLmNuIiwiYXVkIjpbImh0dHA6Ly93d3cuZGFxaWFuLnRoaW5rYnVpbGRlci5jbi9yZXNvdXJjZXMiLCI1OWQ1NDg3YzE3OWE3Y2I2Y2EwZGM1MzRmMzEyOWYwMiJdLCJjbGllbnRfaWQiOiJhcHBzZXJ2ZXJfMjAwODIiLCJzdWIiOiI1YzM0MDQxNTg1NWQ2NzAwMDk1ZmIzZGEiLCJhdXRoX3RpbWUiOjE1NDc0NjA0OTYsImlkcCI6ImxvY2FsIiwiSWQiOiI1YzM0MDQxNTg1NWQ2NzAwMDk1ZmIzZGEiLCJGdWxsTmFtZSI6IuWwj-aWuSIsIlVzZXJOYW1lIjoiMTU5Mjg4MDY0NDAiLCJDb21tcGFueU5hbWUiOiLlpKfosKbotrPnlpciLCJSb2xlcyI6IjVjMzQwNDAyODU1ZDY3MDAwOTVmYjNiZiIsIlJvbGVOYW1lcyI6IuWuouaItyIsIkxvZ2luSWQiOiI1YzNjNWY5MDdlOTI2NzAwMDhhYjYxOTciLCJzY29wZSI6WyI1OWQ1NDg3YzE3OWE3Y2I2Y2EwZGM1MzRmMzEyOWYwMiJdLCJhbXIiOlsicHdkIl19.JV_be3dHVD3MI5FNnqGdDAnJd2-ifLQtdSThGuyxKPUAvqxrmOVR5en-b6q5nyy9xHxye27uKhWWTTZPiI2BdB2HG5oPob3VpzqqXsOmDSrRgPl-x79SPLdOUBPlomV5RpD32ELAVX-m0y3DxefabAELA1RXcCFsm-bcN1Jp5tKkEEjCHO6ZUSOgD7e5zmIwphIvmwpEnUgljCjcnQOMwEHtOF--GjVK8vphRo5_YL1D1cekVWmmGgZRYAydL8s1k1LkMhjFsyaa_HKdcHbKUq072QqKWaU1H0kAGCZVGMifnDywoM-ukPG-Y8FNZvXyi897bWLz3COFDvmhxsgSmw'
      this.setState({
        token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImZhOGI3MGViYWZmY2M5MzFmNGM0ZTZjOWUwNGI0OGE5IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NDc0NjA0OTYsImV4cCI6MTU0NzQ3NDg5NiwiaXNzIjoiaHR0cDovL3d3dy5kYXFpYW4udGhpbmtidWlsZGVyLmNuIiwiYXVkIjpbImh0dHA6Ly93d3cuZGFxaWFuLnRoaW5rYnVpbGRlci5jbi9yZXNvdXJjZXMiLCI1OWQ1NDg3YzE3OWE3Y2I2Y2EwZGM1MzRmMzEyOWYwMiJdLCJjbGllbnRfaWQiOiJhcHBzZXJ2ZXJfMjAwODIiLCJzdWIiOiI1YzM0MDQxNTg1NWQ2NzAwMDk1ZmIzZGEiLCJhdXRoX3RpbWUiOjE1NDc0NjA0OTYsImlkcCI6ImxvY2FsIiwiSWQiOiI1YzM0MDQxNTg1NWQ2NzAwMDk1ZmIzZGEiLCJGdWxsTmFtZSI6IuWwj-aWuSIsIlVzZXJOYW1lIjoiMTU5Mjg4MDY0NDAiLCJDb21tcGFueU5hbWUiOiLlpKfosKbotrPnlpciLCJSb2xlcyI6IjVjMzQwNDAyODU1ZDY3MDAwOTVmYjNiZiIsIlJvbGVOYW1lcyI6IuWuouaItyIsIkxvZ2luSWQiOiI1YzNjNWY5MDdlOTI2NzAwMDhhYjYxOTciLCJzY29wZSI6WyI1OWQ1NDg3YzE3OWE3Y2I2Y2EwZGM1MzRmMzEyOWYwMiJdLCJhbXIiOlsicHdkIl19.JV_be3dHVD3MI5FNnqGdDAnJd2-ifLQtdSThGuyxKPUAvqxrmOVR5en-b6q5nyy9xHxye27uKhWWTTZPiI2BdB2HG5oPob3VpzqqXsOmDSrRgPl-x79SPLdOUBPlomV5RpD32ELAVX-m0y3DxefabAELA1RXcCFsm-bcN1Jp5tKkEEjCHO6ZUSOgD7e5zmIwphIvmwpEnUgljCjcnQOMwEHtOF--GjVK8vphRo5_YL1D1cekVWmmGgZRYAydL8s1k1LkMhjFsyaa_HKdcHbKUq072QqKWaU1H0kAGCZVGMifnDywoM-ukPG-Y8FNZvXyi897bWLz3COFDvmhxsgSmw'
      })
    } else {
      axios.get('/Weixin/GetTokenByOther', {
        params: {
          code: getUrlParam('code'),
        }
      }).then(r => {
        ax.token = r.data
        this.setState({
          token: r.data
        })
      }).catch(r => {
        Toast.offline('获取Token失败')
      })
    }
  }



  render() {
    const childProps = {

    }
    return (
      <div className="App">
        {
          this.state.token && <Routes childProps={childProps} />
        }
      </div>
    );
  }
}

export default (App);
