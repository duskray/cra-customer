import React, { Component } from 'react'
import { Button, Toast } from 'antd-mobile'
import styles from './OrderSuccess.module.scss'
import api from '../api'

export default class OrderSuccess extends Component {
  state = {

  }

  componentDidMount() {
    api.getOrderDetail({
      orderId: this.props.location.state.orderId
    }).then(d => {
      this.setState(d)
    })
  }

  choose = () => {
    api.getOrderDetail({
      orderId: this.props.location.state.orderId
    }).then(d => {
      this.setState(d)
      if (d.status === 2) {
        this.props.history.push(`/order/${d.id}/waiters`, {
          serviceId: d.service.id
        })
      } else {
        Toast.fail('请凭二维码到店开单后进行自选技师', 2, null, false)
      }
    })
  }

  render() {
    return (
      <div style={{ textAlign: 'center', padding: '40px 15px' }}>
        <div className={styles.successIcon} style={{ marginBottom: 15 }}>

        </div>
        <div style={{ marginBottom: 30, fontSize: 32, fontWeight: 'bold' }}>
          下单成功
        </div>
        <div style={{ marginBottom: 15, fontSize: 17, color: 'var(--text-black-color)' }}>
          到店凭二维码享受服务
        </div>

        <div style={{ marginBottom: 15 }}>
          <img src={this.state.prCodeUrl} alt="" />
        </div>
        <div style={{ marginBottom: 25, color: 'var(--text-color)', fontSize: 15 }}>
          订单编号:{this.state.id}
        </div>
        <div className={styles.finish}>
          <p style={{ color: 'var(--main-color)' }}>到店凭二维码开单后可自选服务技师</p>
          {
            this.state.type === 0 ?
              <Button type="primary" style={{ marginBottom: '10px' }} onClick={this.choose}>自选技师</Button>
              : ''
          }
          <Button onClick={e => this.props.history.push('/')}>返回首页</Button>
        </div>

      </div>
    )
  }
}