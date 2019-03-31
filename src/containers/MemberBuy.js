import React, { Component } from 'react'
import { List, Radio, Modal, Button } from 'antd-mobile'
import withUser from 'components/withUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './MemberBuy.module.scss'
import ax from 'utils/ax'
import { wechatPay, paymentType } from 'utils'

const Item = List.Item

class MemberBuy extends Component {
  state = {
    paymentVisible: false,
    payment: 'wechat',
  }

  componentDidMount() {
    ax.get('member').then((r) => {
      this.setState({
        ...r
      })
    })
  }

  paymentSet = (v) => {
    this.setState({
      paymentVisible: false,
      payment: v,
    })
  }

  pay = async () => {
    if (this.state.payment === 'wechat') {
      wechatPay({}, 'member', () => {
        this.props.history.push('/my')
      })
    }
  }

  render() {
    const state = this.state
    return (
      <div>
        <div>
          <div className={styles.card}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>VIP会员</div>
            <div >会员有效期一年，有效期内可享会员价优惠</div>
          </div>
          <div style={{ padding: '0 15px', fontSize: 18, marginBottom: 10 }}>会员说明</div>
          <div style={{ padding: '0 15px', fontSize: 16, whiteSpace: 'pre-line', height: 'calc(100vh - 400px)' }}>{state.description}</div>
        </div>

        <List>
          <Item arrow="horizontal"
            extra={<span>
              {/* {state.payment == 'balance' ? <span style={{ fontSize: 14 }}>(剩余：￥{this.props.user.balance})</span> : ''} */}
              <FontAwesomeIcon icon={paymentType[state.payment].icon} style={{ width: 32, color: paymentType[state.payment].color }} />
              {paymentType[state.payment].name}
            </span>}
            onClick={() => this.setState({ paymentVisible: true })}>
            支付方式
          </Item>
        </List>
        <div className={styles.pay}>
          <div className={styles.payLeft}>
            <span>限时优惠: ￥{state.price}/年</span>

          </div>
          <div className={styles.payRight}>
            <Button type="primary" onClick={this.pay} disabled={!this.state.price} >确认开通</Button>
          </div>
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
            <Radio.RadioItem checked={state.payment === 'wechat'} onClick={() => this.paymentSet('wechat')}>
              <FontAwesomeIcon icon={paymentType.wechat.icon} className={styles.icon} style={{ color: paymentType.wechat.color }} />微信支付
            </Radio.RadioItem>
            {/* <Radio.RadioItem checked={state.payment === 'alipay'} onClick={() => this.paymentSet('alipay')}>
              <FontAwesomeIcon icon={paymentType.alipay.icon} className={styles.icon} style={{ color: paymentType.alipay.color }} />支付宝
            </Radio.RadioItem> */}
          </List>
        </Modal>
      </div>
    )
  }
}

export default withUser(MemberBuy)