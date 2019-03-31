import React, { Component } from 'react'
import styles from './Home.module.scss'
import { Link } from 'react-router-dom'
import { Carousel, Tabs, List, Modal, WingBlank, WhiteSpace, Button } from 'antd-mobile'
import { StickyContainer, Sticky } from 'react-sticky'
import Navbar from 'components/NavBar'
import ax from 'utils/ax'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Login from 'components/Login'
import withUser from 'components/withUser'
import { getUrlParam } from 'utils'
import api from '../api'

const Item = List.Item
const Brief = Item.Brief
const tabs = [
  { title: <div><span>服务项目</span></div> },
  { title: <div><span>附项</span></div> },
]
const initHeight = 220
const localStorage = window.localStorage
const wx = window.wx

function renderTabBar(props) {
  return (<Sticky>
    {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
  </Sticky>);
}

class Home extends Component {
  state = {
    store: '',
    storeDetail: {
      pics: [],
      services: [],
      attachServices: [],
    },
    serviceDetailVisible: false,
    serviceDetail: {},
    pwsCheckVisible: false,
    wxConfigComplete: false,
    to: '',
  }

  loginModel = {}
  lat = undefined
  lon = undefined

  servceDetailOpen = async (id) => {
    const sd = await api.getServiceDetail({
      storeId: this.state.store,
      serviceId: id,
    })
    this.setState({
      serviceDetail: sd.service,
      serviceDetailVisible: true,
    })
  }

  servceDetailClose = () => {
    this.setState({
      serviceDetailVisible: false,
    })
  }

  buy = (obj, e) => {
    e.stopPropagation()
    if (this.props.user.cellNumber) {
      this.props.history.push('/buy', obj)
    } else {
      this.loginModel.open()
    }

  }

  onLogin = () => {
    this.props.updateUser()
    if (this.to) {
      this.props.history.push(this.to)
    }
  }

  componentDidMount = async () => {
    this.to = getUrlParam('to')
    if (this.to) {
      if (this.props.user.cellNumber) {
        this.props.history.push(this.to)
      } else {
        this.loginModel.open()
      }
    }

    let storeCache = localStorage.getItem('store')
    if (storeCache === 'null' || storeCache === 'undefined') {
      storeCache = undefined
    }
    if (storeCache) {
      this.setStore(storeCache)
    } else {
      ax.get('sdk', {
        url: window.location.href.split('#')[0]
      }).then(sdk => {
        const component = this
        wx.config({
          debug: false, // 开启调试模式
          appId: sdk.appId, // 必填，公众号的唯一标识
          timestamp: sdk.timestamp, // 必填，生成签名的时间戳
          nonceStr: sdk.noncestr, // 必填，生成签名的随机串
          signature: sdk.signature,// 必填，签名
          jsApiList: ['getLocation', 'openLocation'] // 必填，需要使用的JS接口列表
        })
  
        wx.ready(function () {
  
          wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              // const speed = res.speed; // 速度，以米/每秒计
              // const accuracy = res.accuracy; // 位置精度
  
              component.lat = latitude
              component.lon = longitude
              component.setState({
                wxConfigComplete: true,
              })
                component.getStore()
            },
            fail: function (res) {
              component.setState({
                wxConfigComplete: true,
              })
              component.getStore()
            }
          })
        })
  
        wx.error(function () {
          component.setState({
            wxConfigComplete: true,
          })
          component.getStore()
        })
      }).catch(e => {
        this.getStore()
      })
    }
    
    setTimeout(() => {
      this.setState({
        wxConfigComplete: true,
      })
    }, 3000);
  }

  getStore = async () => {
    const { id } = await api.getNearestStore({
      lon: this.lon,
      lat: this.lat,
    })
    this.setStore(id)
  }

  setStore = async (id) => {
    localStorage.setItem('store', id)
    this.setState({
      store: id,
    })
    const storeDetail = await api.getStoreDetail({
      storeId: id,
    })
    this.setState({
      storeDetail,
    })
  }

  showMap = () => {
    const storeDetail = this.state.storeDetail
    wx.openLocation({
      latitude: storeDetail.location.x, // 纬度，浮点数，范围为90 ~ -90
      longitude: storeDetail.location.y, // 经度，浮点数，范围为180 ~ -180。
      name: storeDetail.name, // 位置名
      address: storeDetail.address, // 地址详情说明
      scale: 18, // 地图缩放级别,整形值,范围从1~28。默认为最大
      infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    })

  }

  render() {
    const { storeDetail, serviceDetail } = this.state
    return (
      <div className={styles.container}>
        {
          storeDetail.pics.length > 0 ?
            <Carousel
              autoplay={false}
              infinite
              style={{ height: initHeight, overflow: 'hidden' }}
            >
              {
                storeDetail.pics.map(v => (
                  <div key={v} style={{ height: initHeight, overflow: 'hidden' }}>
                    <img src={v + '?pixel=750'} alt="" style={{ width: '100%', verticalAlign: 'top' }}
                      onLoad={() => {
                        window.dispatchEvent(new Event('resize'));
                      }}
                    />
                  </div>
                ))
              }
            </Carousel> :
            <div style={{ height: initHeight }}></div>
        }

        <div className={styles.store}>
          <div className={styles.storeInfo}>
            <div className={styles.storeInfoLeft}>
              <div className={styles.storeName}>{storeDetail.name}</div>
              <div className={styles.storeTime}>营业时间：{storeDetail.openingHours}</div>
            </div>
            <div className={styles.storeInfoRight}>
              <a href={'tel:' + storeDetail.cellNumber}><img style={{ width: '100%' }} src={require('../assets/btn_call.png')} alt=""
                srcSet={require('../assets/btn_call@2x.png') + ' 2x,' + require('../assets/btn_call@3x.png') + ' 3x'}
              /></a>
            </div>
          </div>
          <div className={styles.storeAddr} onClick={this.showMap}>
            <FontAwesomeIcon icon="map-marker-alt" />
            <div style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 'calc(100% - 30px)', verticalAlign: 'top' }}>{storeDetail.address}</div>
            <FontAwesomeIcon icon="angle-right" style={{ float: 'right' }} />
          </div>
        </div>
        <div >
          <StickyContainer>
            <Tabs tabs={tabs}
              initialPage={0}
              swipeable={false}
              tabBarInactiveTextColor="var(--text-color)"
              tabBarActiveTextColor="var(--main-color)"
              renderTabBar={renderTabBar}
              tabBarUnderlineStyle={{ width: '16.66%', transform: 'translateX(100%)', borderColor: 'var(--main-background-color)' }}
            >
              <div>
                {
                  storeDetail.services.map((v, i) => (
                    <div key={v.id} className={styles.item} onClick={e => this.servceDetailOpen(v.id, e)}>
                      <img src={v.thumb.url} alt="" width="80" height="80" />
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{v.name}</div>
                        <div className={styles.itemTime}>服务时长：{v.duration}分钟</div>
                        <div className={styles.itemPrice}>
                          <span>￥</span>
                          <span className={styles.itemPrice1}>{v.price}</span>
                          <span className={styles.itemPrice2}>会员价￥{v.memberPrice}</span>
                          <span onClick={e => this.buy({
                            service: v.id,
                            store: storeDetail.id,
                            storeName: storeDetail.name,
                            spread: v.price - v.memberPrice,
                          }, e)} className={styles.itemBuy}>下单</span>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div style={{ minHeight: '50vh' }}>
                {
                  storeDetail.attachServices.map((v, i) => (
                    <div key={v.id} className={styles.item} onClick={e => this.servceDetailOpen(v.id, e)}>
                      <img src={v.thumb.url} alt="" width="80" height="80" />
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{v.name}</div>
                        <div className={styles.itemTime}>服务时长：{v.duration}分钟</div>
                        <div className={styles.itemPrice}>
                          <span>￥</span>
                          <span className={styles.itemPrice1}>{v.price}</span>
                          <span className={styles.itemPrice2}>会员价￥{v.memberPrice}</span>
                          <span onClick={e => this.buy({
                            service: v.id,
                            store: storeDetail.id,
                            storeName: storeDetail.name,
                            spread: v.price - v.memberPrice,
                          }, e)} className={styles.itemBuy}>下单</span>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </Tabs>
          </StickyContainer>
        </div>
        {
          this.state.wxConfigComplete ?
            <Link to={{
              pathname: '/store/list',
              search: '?from=',
            }} className={styles.storeChange}>
              <FontAwesomeIcon icon="sync-alt" />
              &nbsp;切换门店
          </Link>
            : <Link to={'/'} className={styles.storeChange}>
              <FontAwesomeIcon icon="sync-alt" />
              &nbsp;切换门店
          </Link>
        }

        <Modal
          popup
          visible={this.state.serviceDetailVisible}
          onClose={e => this.setState({
            serviceDetailVisible: false,
          })}
          animationType="slide-up"
          closable={true}
          title={serviceDetail.name}
          className={styles.modal}
        >
          <div>
            <List>
              <Item multipleLine>
                适宜人群 <Brief>{serviceDetail.appr}</Brief>
              </Item>
              <Item multipleLine>
                调理方法 <Brief>{serviceDetail.way}</Brief>
              </Item>
              <Item multipleLine>
                调理流程 <Brief>{serviceDetail.flow}</Brief>
              </Item>
            </List>
            <WhiteSpace />
            <WingBlank>
              <div style={{ display: 'flex' }}>
                <div className={styles.price} style={{ color: 'var(--main-color)' }}>会员价: {serviceDetail.memberPrice}</div>
                <div className={styles.price}>原价: {serviceDetail.originalPrice}</div>
              </div>
              <Button onClick={e => this.buy({
                service: serviceDetail.id,
                store: storeDetail.id,
                storeName: storeDetail.name,
                spread: serviceDetail.originalPrice - serviceDetail.memberPrice,
              }, e)} type="primary">立即下单</Button>
            </WingBlank>
            <WhiteSpace />
          </div>
        </Modal>

        <Login ref={v => this.loginModel = v} onLogin={this.onLogin} />
        <Navbar beforePush={this.props.user.cellNumber ? null : this.loginModel.open} />
      </div>
    );
  }
}

export default withUser(Home)