import React, { Component } from 'react'
import styles from './BookingTimeBuy.module.scss'
import { List, Modal, Button, Toast, NavBar, Icon } from 'antd-mobile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withUser from 'components/withUser'
import { wechatPay, paymentType } from 'utils'
import PwdModal from 'components/PwdModal'
import classnames from 'classnames'
import api from '../api'

const Item = List.Item

// let defaultPayment = localStorage.getItem('defaultPayment') || 'wechat'
let defaultPayment = 'balance'

class BookingTimeBuy extends Component {
  state = {
    //from Booking
    storeID: '',
    time: '',

    store: {
      services: [],
      employees: [],
    },
    servicesVisible: false,
    employeeVisible: false,
    employeeEnable: false,
    couponVisible: false,
    selectableEmployee: [],
    price: null,
    deduction: 0,
    pwdVisible: false,
    coupons: [],
    password: '',

    service: {},
    employee: [],
    payment: defaultPayment,
    coupon: null,
    spread: 0,
  }

  order = null // 创建的订单

  componentDidMount = async () => {
    const params = this.props.location.state
    if (!params) {
      this.props.history.push('/booking')
      return
    }

    this.setState({
      ...params
    })


    const store = await api.getStoreDetail({
      storeId: params.storeID
    })
    this.setState({
      store,
    })

  }

  serviceSet = (v) => {
    api.getAppointEmployees({
      time: this.state.time,
      store: this.state.storeID,
      service: v.id,
    }).then(({ employee }) => {
      this.setState({
        selectableEmployee: employee,
        servicesVisible: false,
        service: v,
        employeeEnable: true,
        employee: [],
        price: null,
        deduction: 0,
        coupons: [],
        coupon: null,
        spread: v.price - v.memberPrice,
      })
    })
  }

  paymentSet = (v) => {
    this.setState({
      payment: v,
    }, e => {
      this.getPrice()
    })
  }

  couponSet = (v) => {
    this.setState({
      couponVisible: false,
      coupon: v,
    }, e => {
      this.getPrice()
    })
  }



  employeeModalOpen = () => {
    if (this.state.employeeEnable) {
      this.setState({
        employeeVisible: true,
      })
    } else {
      Toast.info('请先选择服务项目', 1, null, false);
    }
  }

  employeeChange = (id) => {
    let employee = this.state.employee
    if (employee.includes(id)) {
      this.setState({
        employee: employee.filter(e => e !== id)
      }, e => {
        this.getPrice()
      })
    } else {
      employee.push(id)
      this.setState({
        employee,
      }, e => {
        this.getPrice()
      })
    }
  }

  getPrice = async () => {
    if (!this.state.service.id || this.state.employee.length === 0) {
      this.setState({
        price: null,
        deduction: 0,
        coupons: [],
        coupon: null,
      })
    } else {
      const { price, deduction, originPrice } = await api.getPrice({
        service: this.state.service.id,
        peopleNumber: this.state.employee.length,
        coupon: this.state.coupon ? this.state.coupons.find(v => v.id === this.state.coupon).value : '',
        payment: this.state.payment,
      })
      this.setState({
        price,
        deduction,
      })
      if (deduction === 0) {
        this.getCoupons(originPrice)
      }
    }
  }

  getCoupons = (price) => {
    api.getEnableCouponList({
      serviceId: this.state.service.id,
      price: price,
    }).then(r => {
      this.setState({
        coupons: r.coupons
      })
    })
  }

  couponModalOpen = () => {
    if (this.state.coupons.length > 0) {
      this.setState({ couponVisible: true })
    }
  }

  pay = async () => {
    if (this.state.payment === 'balance' || this.state.price <= 0) {
      if (this.props.user.balance < this.state.price) {
        Toast.fail('账户余额不足', 2, null, false)
      } else {
        if (this.props.user.password === 1) {
          this.setState({ pwdVisible: true })
        } else {
          this.pwdSubmit()
        }
      }
    } else if (this.state.payment === 'storeBalance') {
      if (this.props.user.storeBalance[this.state.storeID] < this.state.price) {
        Toast.fail('账户余额不足', 2, null, false)
      } else {
        if (this.props.user.password === 1) {
          this.setState({ pwdVisible: true })
        } else {
          this.pwdSubmit()
        }
      }
    } else if (this.state.payment === 'wechat') {
      // if (!this.order) {
      this.order = await this.createOrder()
      // }
      wechatPay(this.order, 'order', () => {
        this.props.history.push('/success', {
          qrCode: this.order.qrCode,
          orderNumber: this.order.orderNumber,
        })
      })
    }
  }

  pwdSubmit = async () => {
    this.order = await this.createOrder()
    this.props.history.push('/success', {
      orderId: this.order.id
    })
  }

  createOrder = async () => {
    return await api.createOrder({
      bookingTime: this.state.time,
      serviceId: this.state.service.id,
      payment: paymentType[this.state.payment].string,
      waiters: this.state.employee.join(','),
      coupon: this.state.coupon,
      type: 1, // 0 买单 1预约
      isApp: 0,
    })
  }


  render() {
    const state = this.state
    return (
      <div>
        <div style={{ padding: '20px 20px 40px', boxSizing: 'border-box', overflowY: 'auto', height: 'calc(100vh - 90px)' }}>
          <div style={{ fontSize: 17, marginBottom: 10, fontWeight: 'bold', color: 'var(--main-color)' }}>
            <FontAwesomeIcon icon={['far', 'clock']} className="icon" style={{ width: 18, height: 18, marginRight: 10 }} />
            预约时间 {state.time}
          </div>
          <div style={{ fontSize: 17, marginBottom: 20, fontWeight: 'bold', color: 'var(--main-color)' }}>
            <FontAwesomeIcon icon="map-marker-alt" className="icon" style={{ width: 18, height: 18, marginRight: 10 }} />
            {state.store.name}
          </div>
          <List className="dr-list-without-padding">
            <Item arrow="horizontal"
              extra={state.service.name || <span style={{ color: 'var(--base-color)' }}>请选择</span>}
              onClick={() => this.setState({ servicesVisible: true })}>
              服务项目
          </Item>
            <Item arrow="horizontal"
              extra={state.employee.map(v => state.selectableEmployee.find(e => e.id === v).employeeNum).join(',') || <span style={{ color: 'var(--base-color)' }}>请选择</span>}
              onClick={this.employeeModalOpen}>
              技师
          </Item>
            <Item arrow="horizontal" onClick={this.couponModalOpen}
              extra={state.coupon ? <span style={{ color: 'var(--red-color)' }}>{`-${state.coupons.find(v => v.id === state.coupon).value}元`}</span>
                : <span style={{ color: 'var(--base-color)' }}>
                  {state.coupons.length > 0 ? `${state.coupons.length}张优惠券` : '无可用优惠券'}
                </span>}
            >
              优惠券
          </Item>
            <Item>
              支付方式
          </Item>
            <Item onClick={() => this.paymentSet('balance')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={classnames(styles.radio, { [styles.checked]: state.payment === 'balance' })}></div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>一卡通</div>
                  <div style={{ fontSize: '12px', color: 'var(--main-color)' }}>立享会员价</div>
                </div>
                <div style={{ color: 'var(--red-color)' }}>￥{this.props.user.balance}</div>
                <div style={{ color: '#ddd', margin: '0 10px' }}>|</div>
                <div style={{ fontSize: '15px' }} onClick={e => this.props.history.push('/charge')}>充值</div>
              </div>
            </Item>
            <Item onClick={() => this.paymentSet('storeBalance')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={classnames(styles.radio, { [styles.checked]: state.payment === 'storeBalance' })}></div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>门店会员卡</div>
                  <div style={{ fontSize: '12px', color: 'var(--main-color)' }}>立享会员价</div>
                </div>
                <div style={{ color: 'var(--red-color)' }}>￥{this.props.user.storeBalance[state.storeID]}</div>
                <div style={{ color: '#ddd', margin: '0 10px' }}>|</div>
                <div style={{ fontSize: '15px' }} onClick={e => this.props.history.push('/charge')}>充值</div>
              </div>
            </Item>
            <Item onClick={() => this.paymentSet('wechat')}>
              <span className={classnames(styles.radio, { [styles.checked]: state.payment === 'wechat' })}></span>
              <span style={{ fontWeight: 'bold' }}>微信支付</span>
            </Item>
          </List>

        </div>
        <div className={styles.pay}>
          <div style={{ position: 'absolute', bottom: 60, color: 'var(--text-color)' }}>温馨提示：提前60分钟可取消订单</div>
          <div className={styles.payLeft} style={{ opacity: !state.price ? '0.4' : '1', fontSize: 12, textAlign: 'left', paddingLeft: 20 }}>
            ￥<span style={{ fontSize: 24, fontWeight: 'bold' }}>{state.price}</span>
            {
              state.deduction === 0 ? '' : <span className={styles.cutOff}> 已抵扣{state.deduction}元</span>
            }
          </div>
          <div style={{ flexGrow: 1, fontWeight: 'bold' }}>
            <Button type="primary" onClick={this.pay} disabled={!state.price}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: 50, lineHeight: '50px' }}>立即支付</Button>
          </div>
        </div>

        <Modal
          popup
          visible={state.servicesVisible}
          onClose={e => this.setState({ servicesVisible: false })}
          animationType="slide-up"
        >
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={e => this.setState({ servicesVisible: false })}
          >
            选择项目
          </NavBar>
          <div style={{ height: '70vh', overflowY: 'auto' }}>
            {
              state.store.services.map((v, i) => (
                v.type === '1' ?
                  null :
                  <div key={v.id}>
                    <div className={styles.item}>
                      <img src={v.thumb.url} alt="" width="80" height="80" onClick={e => this.servceDetailOpen(v.id)} />
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{v.name}</div>
                        <div className={styles.itemTime}>服务时长：{v.duration}分钟</div>
                        <div className={styles.itemPrice}>
                          <span>￥</span>
                          <span className={styles.itemPrice1}>{v.price}</span>
                          <span className={styles.itemPrice2}>会员价￥{v.memberPrice}</span>
                          <span onClick={e => this.serviceSet(v)} className={styles.itemBuy}>选择</span>
                        </div>
                      </div>
                    </div>
                    <hr className="hr-light" />
                  </div>

              ))
            }
          </div>
        </Modal>
        <Modal
          popup
          visible={state.employeeVisible}
          onClose={e => this.setState({ employeeVisible: false })}
          animationType="slide-up"
        >
          <NavBar
            mode="light"
            rightContent={<span onClick={e => this.setState({ employeeVisible: false })}>确定</span>}
          >
            选择技师
          </NavBar>
          <div style={{ height: '70vh', overflowY: 'auto' }}>
            <List>
              {
                state.selectableEmployee.length > 0 ?
                  state.selectableEmployee.map((v, i) => (
                    <div key={v.id} className={styles.item} onClick={e => this.employeeChange(v.id)}>
                      <img src={v.avatar} alt="" width="80" height="80" />
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

                      </div>
                      <div>
                        {
                          state.employee.includes(v.id) ?
                            <Icon type="check-circle" style={{ width: 20, height: 20 }} /> :
                            <span style={{ display: 'inline-block', width: 20, height: 20, border: '1px solid #707070', borderRadius: '50%' }}></span>
                        }
                      </div>
                    </div>
                  )) :
                  <div style={{ padding: 20 }}>暂无可用技师</div>
              }
            </List>
          </div>
        </Modal>

        <Modal
          popup
          visible={state.couponVisible}
          onClose={e => this.setState({ couponVisible: false })}
          animationType="slide-up"
        >
          <div className={styles.list}>
            <div style={{ marginBottom: '40px', textAlign: 'left' }}>
              <span style={{ fontSize: 32, color: 'var(--text-black-color)' }}>选择优惠券</span>
              <Icon type="cross" onClick={e => this.setState({ couponVisible: false })} style={{ width: 40, height: 40, color: 'var(--text-black-color)', float: 'right' }} />
            </div>
            <div className={styles.noCoupon} onClick={e => this.couponSet('')}>
              不使用优惠券
            </div>
            {
              state.coupons.map(v => (
                <div key={v.id} className={styles.coupon} onClick={e => this.couponSet(v.id)}>
                  <div style={{ width: '30%' }}>
                    <div className={styles.couponWorth}><span>{v.value}</span>元</div>
                    <div>优惠券</div>
                  </div>
                  <div style={{ width: '70%', padding: '18px 20px', boxSizing: 'border-box' }}>
                    <div className={styles.couponTitle}>{v.name}<span>{v.invalid === 1 ? '即将到期' : ''}</span></div>
                    <ul className={styles.couponDetail}>
                      {
                        v.desc ? <li>{v.desc}</li> : ''
                      }
                      <li>有效期至 {v.endTime}</li>
                    </ul>
                  </div>
                </div>
              ))
            }

          </div>
        </Modal>

        <PwdModal
          visible={state.pwdVisible}
          onClose={e => this.setState({ pwdVisible: false })}
          price={state.price}
          submit={this.pwdSubmit}
        />
      </div>
    )
  }
}

export default withUser(BookingTimeBuy)