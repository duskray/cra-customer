import React, { Component } from 'react'
import styles from './Buy.module.scss'
import { List, Modal, Button, Toast, Icon } from 'antd-mobile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { wechatPay, paymentType } from 'utils'
import withUser from 'components/withUser'
import PwdModal from 'components/PwdModal'
import classnames from 'classnames'
import api from '../api'

const Item = List.Item

let defaultPayment = 'balance'

class Buy extends Component {
  state = {
    service: '', // from Home
    store: '', // from Home
    storeName: '', // from Home
    spread: 0, // from Home
    serviceDetail: {},
    coupons: [],
    couponVisible: false,
    pwdVisible: false,

    coupon: '',
    payment: defaultPayment,
    price: null,
    deduction: 0,
    password: '',
  }

  order = null // 创建的订单

  componentDidMount = async () => {
    const params = this.props.location.state
    if (!params) {
      this.props.history.push('/')
      return
    }

    const { service } = await api.getServiceDetail({
      storeId: params.store,
      serviceId: params.service,
    })
    const coupons = await api.getEnableCouponList({
      serviceId: params.service,
      price: service.price,
    })

    this.setState({
      ...params,
      serviceDetail: service,
      coupons,
    }, e => {
      this.getPrice()
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

  getPrice = async () => {
    const { price, deduction, originPrice } = await api.getPrice({
      service: this.state.service,
      peopleNumber: 1,
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

  getCoupons = async (price) => {
    const coupons = await api.getEnableCouponList({
      serviceId: this.state.service,
      price: price,
    })
    this.setState({
      coupons,
    })
  }

  pay = async () => {
    if (this.state.payment === 'balance' || this.state.price <= 0) {
      if (this.props.user.commonBalance < this.state.price) {
        Toast.fail('账户余额不足', 2, null, false)
      } else {
        if (this.props.user.password === 1) {
          this.setState({ pwdVisible: true })
        } else {
          this.pwdSubmit()
        }
      }
    } else if (this.state.payment === 'storeBalance') {
      if (this.props.user.storeBalance[this.state.store] < this.state.price) {
        Toast.fail('账户余额不足', 2, null, false)
      } else {
        if (this.props.user.password === 1) {
          this.setState({ pwdVisible: true })
        } else {
          this.pwdSubmit()
        }
      }
    } else if (this.state.payment === 'wechat') {
      // const { id, price, title, outTradeNo } = await ax.post(`orders`, {

      this.order = await this.createOrder()
      wechatPay(this.order, 'order', () => {
        this.props.history.push('/success', {
          qrCode: this.order.qrCode,
          orderId: this.order.orderId,
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
      serviceId: this.state.service,
      payment: paymentType[this.state.payment].string,
      coupon: this.state.coupon,
      isApp: 0,
      type: 0, // 0 买单 1预约
    })
  }

  couponModalOpen = () => {
    if (this.state.coupons.length > 0) {
      this.setState({ couponVisible: true })
    }
  }



  render() {
    const state = this.state
    return (
      <div>
        <div style={{ padding: '10px 20px 40px', boxSizing: 'border-box', overflowY: 'auto', height: 'calc(100vh - 70px)' }}>
          <div style={{ marginBottom: '40px' }}>
            <span style={{ fontSize: 32, color: 'var(--text-black-color)' }}>{state.serviceDetail.name}</span>
            <span className={styles.price}><i>￥</i>{state.serviceDetail.originalPrice}</span>
          </div>
          <div style={{ fontSize: 17, marginBottom: 10, color: 'var(--main-color)' }}>
            <FontAwesomeIcon icon={['far', 'clock']} className="icon" style={{ width: 18, height: 18, marginRight: 10 }} />
            {state.serviceDetail.duration}分钟
        </div>
          <div style={{ fontSize: 17, marginBottom: 20, fontWeight: 'bold', color: 'var(--main-color)' }}>
            <FontAwesomeIcon icon="map-marker-alt" className="icon" style={{ width: 18, height: 18, marginRight: 10 }} />
            {state.storeName}
          </div>
          <List className="dr-list-without-padding">
            <Item arrow="horizontal" onClick={this.couponModalOpen}
              extra={state.coupon ? <span style={{ color: 'var(--red-color)' }}>{`-${state.coupons.find(v => v.id === state.coupon).value}元`}</span>
                : <span style={{ color: 'var(--base-color)' }}>
                  {state.coupons.length > 0 ? `${state.coupons.length}张优惠券` : '无可用优惠券'}
                </span>}
            >
              优惠券
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
                <div style={{ color: 'var(--red-color)' }}>￥{this.props.user.storeBalance[state.store]}</div>
                {/* <div style={{ color: 'var(--red-color)' }}>￥{state.store}</div> */}
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
          visible={state.couponVisible}
          onClose={e => this.setState({ couponVisible: false })}
          animationType="slide-up"
        >
          <div className={styles.list}>
            <div style={{ marginBottom: '40px', textAlign: 'left' }}>
              <span style={{ fontSize: 32, color: 'var(--text-black-color)', fontWeight: 'bold' }}>选择优惠券</span>
              <Icon type="cross" onClick={e => this.setState({ couponVisible: false })} style={{ width: 40, height: 40, color: 'var(--text-black-color) !important', float: 'right' }} />
            </div>
            <div className={styles.noCoupon} onClick={e => this.couponSet('')}>
              不使用优惠券
            </div>
            {
              state.coupons.map(v => (
                <div key={v.id} className={styles.coupon} onClick={e => this.couponSet(v.id)}>
                  <div style={{ width: '30%' }}>
                    <div className={styles.couponWorth}><span>{v.value}</span>元</div>
                    <div style={{ color: 'var(--text-black-color)' }}>优惠券</div>
                  </div>
                  <div style={{ width: '70%', padding: '18px 0', boxSizing: 'border-box' }}>
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

export default withUser(Buy)