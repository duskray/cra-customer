import React, { Component } from 'react';
// import { Picker } from 'antd-mobile';
import ax from 'utils/ax'
import { getUrlParam } from 'utils'
import DRListView from 'components/DRListView'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import api from '../api'

const localStorage = window.localStorage
const wx = window.wx
class StoreList extends Component {
  state = {
    citys: [],
    city: '', // 当前城市id
    lat: undefined,
    lon: undefined,
  }

  back = () => {
    this.props.history.push('/')
  }

  citySet = (v) => {
    this.setState({
      city: v[0],
    })
  }

  storeSet = (v) => {
    localStorage.setItem('store', v)
    this.props.history.push('/' + getUrlParam('from'))
  }

  getter = async (pageSize, pageIndex) => {
    return await api.getStoreList({
      pageSize,
      pageIndex,
      lat: this.state.lat,
      lon: this.state.lon,
    })
  }

  renderRow = (rowData, sectionID, rowID) => {
    return (
      <div key={rowData.id}>
        <div style={{ padding: '10px 15px 5px', display: 'flex' }} onClick={e => this.storeSet(rowData.id)}>
          <img src={rowData.thumb} alt="" width="80" height="80" />
          <div style={{ flexGrow: 1, textAlign: 'left', padding: '10px' }}>
            <div style={{ fontSize: 18, lineHeight: '20px', marginBottom: '12px' }}>
              {rowData.name}
              {
                rowData.distance ?
                  <span style={{ float: 'right', fontSize: 12 }}><FontAwesomeIcon icon="location-arrow" style={{ color: 'var(--base-color)', marginRight: '2px' }} />离我{rowData.distance}</span>
                  : ''
              }
            </div>
            <div style={{ color: '#ababab', lineHeight: '20px' }}>{rowData.address}</div>
            <div style={{ color: '#ababab', lineHeight: '20px' }}>营业时间:{rowData.openingHours}</div>
          </div>
        </div>
        <hr className="hr-light" />
      </div>
    )
  }

  componentDidMount = () => {
    const component = this
    ax.get('sdk', {
      url: window.location.href.split('#')[0]
    }).then(sdk => {
      wx.config({
        debug: false, // 开启调试模式
        appId: sdk.appId, // 必填，公众号的唯一标识
        timestamp: sdk.timestamp, // 必填，生成签名的时间戳
        nonceStr: sdk.noncestr, // 必填，生成签名的随机串
        signature: sdk.signature,// 必填，签名
        jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表
      })

      wx.ready(function () {
        wx.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            component.setState({
              lat: res.latitude,
              lon: res.longitude,
            }, e => {
              component.list.get()
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      })
    })
    // ax.get('cities').then(citys => {
    //   this.setState({
    //     citys,
    //   })
    // })

  }


  render() {
    // const { citys, city } = this.state

    return (
      <div style={{ padding: '12px 15px', boxSizing: 'border-box', height: '100vh' }}>
        {/* <Picker
          extra=""
          cols={1}
          data={citys}
          title="选择城市"
          onOk={this.citySet}
          className="forss"
        >
          <div style={{ fontSize: 18, color: 'var(--main-color)', height: 30 }}>
            <FontAwesomeIcon icon="map-marker-alt" /> {city ? citys.find(e => e.value === city).label : '城市'}
          </div>
        </Picker> */}
        <DRListView ref={el => this.list = el}
          getter={this.getter} renderRow={this.renderRow} listName="stores" height="calc(100vh - 54px)"
        />
      </div>
    );
  }
}

export default (StoreList)
