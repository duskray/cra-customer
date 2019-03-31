import React, { Component } from 'react'
import { List, Radio, Modal, Button, InputItem } from 'antd-mobile'
import withUser from 'components/withUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { wechatPay, paymentType } from 'utils'
import { getUrlParam } from 'utils'
import api from '../api'

const Item = List.Item

class Charge extends Component {
  state = {
    store: getUrlParam('store') || '',
    chargeLevel: [],
    chargeValue: '',
    chargeReferrer: '',

    paymentVisible: false,
    payment: 'wechat',
  }

  componentDidMount() {
    api.getChargeLevel().then(({ level }) => {
      this.setState({
        chargeLevel: level,
        chargeValue: level[0].unit,
      })
    })
  }

  levelSet = (v) => {
    this.setState({
      chargeValue: v,
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
      wechatPay({
        price: this.state.chargeValue,
        cellNumber: this.state.chargeReferrer,
        store: this.state.store,
      }, 'charge', () => {
        this.props.history.push('/my')
      })
    }
  }

  render() {
    const state = this.state
    return (
      <div >
        <h2 style={{ fontSize: 24, padding: '0 15px' }}>充值金额</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', padding: 15, boxSizing: 'border-box' }}>
          {
            this.state.chargeLevel.map((v, i) => {
              return (
                <div key={i} style={{
                  width: '50%',
                  boxSizing: 'border-box',
                  padding: 5,
                  display: 'table'
                }}
                  onClick={e => this.levelSet(v.unit)}
                >
                  <div style={{
                    border: '1px solid var(--main-color)',
                    color: v.unit === this.state.chargeValue ? '#ffffff' : 'var(--main-color)',
                    backgroundColor: v.unit === this.state.chargeValue ? 'var(--main-color)' : '#ffffff',
                    borderRadius: 5,
                    boxSizing: 'border-box',
                    padding: '5px 10px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    height: 65,
                    fontSize: 18,
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    lineHeight: '1.4em',
                  }}>
                    充{v.unit}元
                    <div style={{
                      fontSize: 13,
                      color: v.unit === this.state.chargeValue ? '#ffffff' : '#ababab',
                    }}>{v.price ? `赠送${v.price}元优惠券` : ''}</div>
                  </div>
                </div>
              )
            })
          }
        </div>
        <List>
          <InputItem clear value={state.chargeReferrer} onChange={v => this.setState({ chargeReferrer: v })} placeholder="">
            <span style={{ color: 'var(--text-color)' }}>推荐码</span>
          </InputItem>
          <Item arrow="horizontal"
            extra={<span>
              <FontAwesomeIcon icon={paymentType[state.payment].icon} style={{ width: 32, color: paymentType[state.payment].color }} />
              {paymentType[state.payment].name}
            </span>}
            onClick={() => this.setState({ paymentVisible: true })}>
            支付方式
          </Item>
        </List>
        <Button type="primary" style={{ margin: '20px 15px' }} onClick={this.pay} >立即充值</Button>
        <p style={{textAlign:'center'}}>点击立即充值，即表示您已经同意<span style={{color:'var(--main-color)'}} onClick={e => this.props.history.push('/agreement')}>《充值协议》</span></p>
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
              <FontAwesomeIcon icon={['fab', 'weixin']} style={{ color: '#06c104', width: 28, height: 28, marginRight: 10, verticalAlign: 'bottom' }} />微信支付
            </Radio.RadioItem>
            {/* <Radio.RadioItem checked={state.payment === 'alipay'} onClick={() => this.paymentSet('alipay')}>
              <FontAwesomeIcon icon={['fab', 'alipay']} style={{ color: '#0490df', width: 28, height: 28, marginRight: 10, verticalAlign: 'bottom' }} />支付宝
            </Radio.RadioItem> */}
          </List>
        </Modal>
      </div>
    )
  }
}

export default withUser(Charge)