import React, { Component } from 'react'
import { Button, Tabs, List, Modal, PickerView, Toast } from 'antd-mobile'
import Navbar from 'components/NavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Booking.module.scss'
import api from '../api'
const tabs = [
  { title: <div style={{fontWeight:'bold',fontSize:17}}>按技师预约</div> },
  { title: <div style={{fontWeight:'bold',fontSize:17}}>按时间预约</div> },
]
const localStorage = window.localStorage

export default class Booking extends Component {
  state = {
    store: {
      employees: [],
      time: [],
    },
    employeeDetail: {},
    bookingType: localStorage.getItem('bookingType') ? Number(localStorage.getItem('bookingType')) : 0,

    time: [],
    timeStr: '',

  }



  componentDidMount = async () => {
    let storeID = localStorage.getItem('store')
    if (storeID === 'null' || storeID === 'undefined') {
      storeID = undefined
    }
    if (storeID) {
      const store = await api.getAppointMenu({
        storeId: storeID,
      })
      this.setState({
        store: store,
        time: store.current,
      }, e => {
        this.onTimeChange(store.current)
      })
    } else {
      const component = this
      window.wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          component.setState({
            lat: res.latitude,
            lon: res.longitude,
          })
          component.getStore(res.latitude, res.longitude)
        }
      })
      this.getStore(this.state.lat, this.state.lon)
    }

  }

  getStore = async (lat, lon) => {
    const { id } = await api.getNearestStore({
      lat,
      lon,
    })
    const store = await api.getAppointMenu({
      storeId: id,
    })
    localStorage.setItem('store', id)
    this.setState({
      store: store,
      time: store.current,
    }, e => {
      this.onTimeChange(store.current)
    })
  }

  storeChange = () => {
    this.props.history.push({
      pathname: '/store/list',
      search: '?from=booking',
    })
  }


  onTimeChange = (time) => {
    const current = this.state.store.current
    const currentStr = `${current[0]} ${current[1]}:${current[2]}:00`
    const timeStr = `${time[0]} ${time[1]}:${time[2]}:00`
    
    if (timeStr < currentStr) {
      Toast.info('不可小于当前时间', 1, null, false);
      this.setState({
        time: current,
        timeStr: currentStr,
      })
    } else {
      this.setState({
        time: time,
        timeStr: timeStr,
      })
    }
  }

  employeeBuy = (v) => {
    this.props.history.push('/booking-employee/buy', {
      storeID: this.state.store.storeId,
      employeeID: v.id,
      employeeNum: v.employeeNum,
      employeeImg: v.avatar,
    })
  }

  timeBuy = () => {
    api.getAppointEmployees({
      time: this.state.timeStr,
      store: this.state.store.storeId,
    }).then(r => {
      this.props.history.push('/booking-time/buy', {
        storeID: this.state.store.storeId,
        time: this.state.timeStr,
      })
    })

  }

  typeChange = (index) => {
    localStorage.setItem('bookingType', index)
  }

  detailOpen = (id) => {
    api.getEmployeeDetail({
      empId: id,
    }).then(r => {
      this.setState({
        employeeDetail: r,
        employeeVisible: true,
      })
    })
  }

  render() {
    const state = this.state
    return (
      <div style={{ textAlign: 'center', padding: '15px' }}>
        <Tabs tabs={tabs}
          initialPage={state.bookingType}
          tabBarInactiveTextColor="var(--text-color)"
          tabBarActiveTextColor="var(--main-color)"
          tabBarUnderlineStyle={{ width: '25%', transform: 'translateX(50%)', borderColor: 'var(--main-background-color)' }}
          onTabClick={(tab, index) => this.typeChange(index)}
          swipeable={false}
        >
          <div>
            <List.Item arrow="horizontal" onClick={this.storeChange} extra={state.store.storeName}>服务门店</List.Item>
            <div style={{ overflowY: 'auto', height: 'calc(100vh - 160px)' }}>
              {
                state.store.employees.map((v, i) => (
                  <div key={v.id} className={styles.item}>
                    <img src={v.avatar} alt="" width="80" height="80" style={{borderRadius:'50%'}} onClick={e => this.detailOpen(v.id)} />
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{v.employeeNum}</div>
                      <div className={styles.rate}>
                        <span>
                          {
                            new Array(v.star).fill('').map((v, i) => <FontAwesomeIcon key={'faStar' + i} icon="star" />)
                          }
                          {
                            new Array(5 - v.star).fill('').map((v, i) => <FontAwesomeIcon key={'farStar' + i} icon={['far', 'star']} />)
                          }
                        </span>
                        {v.rate}
                      </div>
                      <div className={styles.rate}>服务{v.times}次</div>
                      <span className={styles.itemBuy} onClick={e => this.employeeBuy(v)}>预约</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div>
            <List className="dr-list-without-padding">
              <List.Item arrow="horizontal" onClick={this.storeChange} extra={state.store.storeName}>服务门店</List.Item>
              <List.Item extra={state.timeStr} multipleLine>预约时间</List.Item>
            </List>
            <div>
              <PickerView
                onChange={this.onTimeChange}
                value={this.state.time}
                data={this.state.store.time}
                cascade={false}
              />
              <Button type="primary" onClick={this.timeBuy} style={{marginTop:30}}>下一步</Button>
            </div>
          </div>
        </Tabs>

        <Modal
          popup
          visible={this.state.employeeVisible}
          onClose={e => this.setState({
            employeeVisible: false,
          })}
          animationType="slide-up"
          closable={true}
          title="技师详情"
        >
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #dddddd', paddingBottom: 10, marginBottom: 10 }}>
              <img src={state.employeeDetail.img} alt="" style={{ width: '80px', borderRadius: '50%', height: '80px' }} />
              <div style={{ flexGrow: 1, textAlign: 'left', paddingLeft: 20, lineHeight: '2.2em', fontSize: '12px' }}>
                <div style={{ fontSize: '18px' }}>{state.employeeDetail.name}</div>
                <div>{
                  state.employeeDetail.service ?
                    state.employeeDetail.service.map(v => (
                      <span style={{ border: '1px solid #707070', margin: '0 10px 0 0', padding: '2px 5px' }}>{v}</span>
                    )) : ''
                }</div>
                <div>评分:{state.employeeDetail.rate}  服务:{state.employeeDetail.count}次</div>
              </div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div>个人简介</div>
              <div style={{ fontSize: 14 }}>
                {state.employeeDetail.brief}
              </div>
            </div>
          </div>
        </Modal>

        <Navbar />
      </div>
    )
  }
}