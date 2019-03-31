import React, { Component } from 'react'
import { Modal, List, Radio, Toast } from 'antd-mobile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { orderStatus, paymentType, wechatPay } from 'utils'
import withUser from 'components/withUser'
import PwdModal from 'components/PwdModal'
import styles from './OrderDetail.module.scss'
import api from '../api'

const Item = List.Item

const OrderButton = (props) => {
  const type = props.type || 'text'
  return (
    <div style={{
      flexBasis: '25%', boxSizing: 'border-box', fontSize: 16, padding: '2px 5px', margin: '0 5px',
      borderRadius: '15% / 50%', textAlign: 'center',
      color: `var(--${type}-color)`, border: `1px solid var(--${type}-color)`,
    }}
      onClick={props.onClick}
    >
      {props.text}
    </div>
  )
}


class OrderDetail extends Component {
  state = {
    service: {},
    waiters: [],
    pwdVisible: false,

    paymentVisible: false,
    payment: 'wechat',
  }

  paymentSet = (v) => {
    this.setState({
      paymentVisible: false,
      payment: v,
    })
  }

  componentDidMount() {
    api.getOrderDetail({
      orderId: this.props.match.params.id
    }).then(r => {
      this.setState(Object.assign(r, { payment: r.payment || 'wechat' }))
    })
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
      if (this.props.user.storeBalance[this.state.storeId] < this.state.price) {
        Toast.fail('账户余额不足', 2, null, false)
      } else {
        if (this.props.user.password === 1) {
          this.setState({ pwdVisible: true })
        } else {
          this.pwdSubmit()
        }
      }
    } else if (this.state.payment === 'wechat') {
      wechatPay({
        id: this.state.id,
        sum: this.state.price,
      }, 'order', () => {
        this.props.history.push('/success', {
          qrCode: this.state.prCodeUrl,
          orderNumber: this.state.orderNumber,
        })
      })
    }
  }

  del = (id) => {
    Modal.alert('删除订单', '确定要删除订单么？', [
      { text: '取消', onPress: () => { } },
      {
        text: '确认', onPress: async () => {
          await api.deleteOrder({orderId: id})
          this.props.history.push('/')
        }
      },
    ])

  }

  pwdSubmit = async () => {
    this.order = await this.createOrder()
    this.props.history.push('/success', {
      orderId: this.order.id
    })
  }

  render() {
    const state = this.state
    return (
      <div >
        {
          state.status === 0 ?
            <div style={{ background: 'var(--red-color)', color: '#ffffff', padding: '8px 20px' }}>请于5分钟内付款，超时未支付将自动关闭订单</div>
            : ''
        }
        <div style={{ padding: '15px 20px', position: 'relative' }}>
          <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 5, }}>{state.service.name}</div>
          <div style={{ fontSize: 16, marginBottom: 36, fontWeight: '300' }}>{state.service.duration}分钟 x {state.quantity}人</div>
          <div style={{ fontSize: 16, marginBottom: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontSize: 18, marginRight: 20 }}>订单编号</span>
            <span style={{ color: 'var(--text-color)' }}>{state.orderNumber}</span>
          </div>
          <div style={{ fontSize: 16, marginBottom: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontSize: 18, marginRight: 20 }}>订单状态</span>
            <span style={{ color: 'var(--text-color)' }}>{orderStatus[state.status]}</span>
          </div>
          {
            state.startTime ?
              <div style={{ fontSize: 16, marginBottom: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <span style={{ fontSize: 18, marginRight: 20 }}>预约时间</span>
                <span style={{ color: 'var(--text-color)' }}>{state.startTime}</span>
              </div> :
              ''
          }
          <div style={{ fontSize: 16, marginBottom: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontSize: 18, marginRight: 20 }}>下单时间</span>
            <span style={{ color: 'var(--text-color)' }}>{state.createTime}</span>
          </div>
          <div style={{ fontSize: 16, marginBottom: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontSize: 18, marginRight: 20 }}>服务门店</span>
            <span style={{ color: 'var(--text-color)' }}>{state.storeName}</span>
          </div>
          <hr className="hr-light" />
          <div style={{ fontSize: 18, marginBottom: 20, marginTop: 18 }}>服务技师</div>
          <List className="dr-list-without-line dr-list-without-padding" style={{ marginBottom: 20 }}>
            {
              state.waiters.map(v => (
                <Item key={v.id} style={{ marginBottom: 17 }} thumb={
                  <img src={v.avatar} alt="" style={{ width: 64, height: 64, borderRadius: '50%' }} />
                }>
                  <span style={{ color: 'var(--text-black-color)' }}>{v.employeeId}</span>
                </Item>
              ))
            }
          </List>
          <hr className="hr-light" />
          <div style={{ fontSize: 18, marginBottom: 20, marginTop: 25 }}>付款明细</div>
          <div style={{ fontSize: 16, marginBottom: 10, color: 'var(--text-color)' }}>
            服务单价<span style={{ float: 'right', color: 'var(--text-black-color)' }}>￥{state.service.price}</span>
          </div>
          <div style={{ fontSize: 16, marginBottom: 10, color: 'var(--text-color)' }}>
            数量<span style={{ float: 'right', color: 'var(--text-black-color)' }}>x{state.quantity}</span>
          </div>
          <div style={{ fontSize: 16, marginBottom: 10, color: 'var(--text-color)' }}>
            总价<span style={{ float: 'right', color: 'var(--text-black-color)' }}>￥{state.originPrice}</span>
          </div>
          <div style={{ fontSize: 16, marginBottom: 10, color: 'var(--text-color)' }}>
            优惠金额<span style={{ float: 'right', color: 'var(--text-black-color)' }}>-￥{state.discount}</span>
          </div>
          <div style={{ fontSize: 16, marginBottom: 10, color: 'var(--text-color)' }}>
            总价<span style={{ float: 'right', color: 'var(--text-black-color)' }}>￥{state.price}</span>
          </div>

          {
            state.status === 0 ?
              <div>
                <List className="dr-list-without-padding">
                  <Item
                    // arrow="horizontal"
                    extra={<span>
                      {/* <FontAwesomeIcon icon={paymentType[state.payment].icon} style={{ width: 32, color: paymentType[state.payment].color }} /> */}
                      {paymentType[state.payment]}
                    </span>}
                  // onClick={() => this.setState({ paymentVisible: true })}>
                  >
                    支付方式
                  </Item>
                </List>
                <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0' }}>
                  <div style={{ color: 'var(--red-color)' }}>￥<span style={{ fontSize: 24 }}>{state.price}</span></div>
                  <div style={{ color: 'var(--red-color)', flexGrow: 1, paddingLeft: 10 }}>已抵扣￥{state.discount}</div>
                  <OrderButton text="取消订单" onClick={e => this.props.history.push('/cancel', { id: state.id })} />
                  <OrderButton text="立即支付" type="main" onClick={this.pay} />
                </div>
              </div>
              :
              <img src={state.prCodeUrl} alt="" style={{ position: 'absolute', right: 0, top: 0 }} />
          }
          {
            state.status === 1 ?
              <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0', flexDirection: 'row-reverse' }}>
                <OrderButton text="取消订单" onClick={e => this.props.history.push('/cancel', { id: state.id })} />
                <OrderButton text="自选技师" type="main" onClick={e => Toast.info('请凭二维码到店开单后进行自选技师')} />
              </div>
              : ''
          }
          {
            state.status === 2 && state.waiters.length <= 0 ?
              <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0', flexDirection: 'row-reverse' }}>
                <OrderButton text="自选技师" type="main" onClick={e => this.props.history.push(`/order/${state.id}/waiters/`)} />
              </div>
              : ''
          }
          {
            state.status === 4 ?
              <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0', flexDirection: 'row-reverse' }}>
                {
                  state.autoClose === 1 ?
                    '' :
                    <OrderButton text="评价" type="main" onClick={e => this.props.history.push('/comment/' + state.id)} />
                }
                <OrderButton text="删除订单" onClick={e => this.del(state.id)} />
              </div>
              : ''
          }
          {
            [5, 6, 7].includes(state.status) ?
              <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0', flexDirection: 'row-reverse' }}>
                <OrderButton text="删除订单" onClick={e => this.del(state.id)} />
              </div>
              : ''
          }

        </div>


        <Modal
          popup
          visible={this.state.paymentVisible}
          onClose={e => this.setState({ paymentVisible: false })}
          animationType="slide-up"
          closable={true}
          title="请选择支付方式"
        >
          <List>
            <Radio.RadioItem checked={state.payment === 'balance'} onClick={() => this.paymentSet('balance')}>
              <FontAwesomeIcon icon={paymentType.balance.icon} className={styles.icon} style={{ color: paymentType.balance.color }} />账户余额 {this.props.user.balance}元
            </Radio.RadioItem>
            <Radio.RadioItem checked={state.payment === 'wechat'} onClick={() => this.paymentSet('wechat')}>
              <FontAwesomeIcon icon={paymentType.wechat.icon} className={styles.icon} style={{ color: paymentType.wechat.color }} />微信支付
            </Radio.RadioItem>
            {/* <Radio.RadioItem checked={state.payment === 'alipay'} onClick={() => this.paymentSet('alipay')}>
              <FontAwesomeIcon icon={paymentType.alipay.icon} className={styles.icon} style={{ color: paymentType.alipay.color }} />支付宝
            </Radio.RadioItem> */}
          </List>
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

export default withUser(OrderDetail)