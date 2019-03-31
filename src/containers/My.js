import React, { Component } from 'react'
import { List, Carousel } from 'antd-mobile'
import styles from './My.module.scss'
import Navbar from 'components/NavBar'
import withUser from 'components/withUser'
import api from '../api'

const carouselHeight = 80

class My extends Component {

  state = {
    appointment: [],
  }

  componentDidMount = async () => {
    api.getAppointList().then(appointment => {
      this.setState({
        appointment,
      })
    })
  }

  orderList = (v) => {
    this.props.history.push('/order', {
      type: v,
    })
  }

  options = () => {
    this.props.history.push('/options')
  }

  goBalance = () => {
    // this.props.history.push('/balance')
    this.props.history.push('/cards')
  }

  goCoupon = () => {
    this.props.history.push('/coupons')
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.user}>
          <div className={styles.userInfo}>
            <img src={this.props.user.wechatAvatar} alt="" className={styles.userImg} />
            <span className={styles.userName}>{this.props.user.wechatName || '用户'}</span>
            {
              this.props.user.memberType === 1 ?
                // 会员
                <span className={styles.userGetMember}
                // onClick={e => this.props.history.push('/member')}
                >VIP会员</span>
                // 非会员
                : ''
              // <span className={styles.userGetMember} onClick={e => this.props.history.push('/member/buy')}>开通会员</span>
            }
          </div>
          <div className={styles.userAsset}>
            <div className={styles.userBalance} onClick={this.goBalance}>
              <div style={{ fontSize: 20 }}>{(this.props.user.balance || this.props.user.balance === 0) ? this.props.user.balance : '...'}</div>
              <div>余额</div>
            </div>
            <div className={styles.userVerticalLine}></div>
            <div className={styles.userCoupon} onClick={this.goCoupon}>
              <div style={{ fontSize: 20 }}>{(this.props.user.coupon || this.props.user.coupon === 0) ? this.props.user.coupon : '...'}</div>
              <div>优惠券</div>
            </div>
          </div>
        </div>

        <List.Item arrow="horizontal" onClick={e => this.orderList(0)} style={{ marginBottom: 15 }} className="dr-list-without-padding">
          <span style={{ color: 'var(--text-black-color)' }}>我的订单</span>
        </List.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', }} onClick={e => this.orderList(1)}>
            <img alt="" style={{ display: 'block', margin: '0 auto 5px' }} src={require('../assets/wait_pay.png')} srcSet={require('../assets/wait_pay@2x.png') + ' 2x,' + require('../assets/wait_pay@3x.png') + ' 3x'} />
            <span className={styles.text}>待支付</span>
          </div>
          <div style={{ textAlign: 'center', }} onClick={e => this.orderList(2)}>
            <img alt="" style={{ display: 'block', margin: '0 auto 5px' }} src={require('../assets/paid.png')} srcSet={require('../assets/paid@2x.png') + ' 2x,' + require('../assets/paid@3x.png') + ' 3x'} />
            <span className={styles.text}>已支付</span>
          </div>
          <div style={{ textAlign: 'center', }} onClick={e => this.orderList(3)}>
            <img alt="" style={{ display: 'block', margin: '0 auto 5px' }} src={require('../assets/wait_service.png')} srcSet={require('../assets/wait_service@2x.png') + ' 2x,' + require('../assets/wait_service@3x.png') + ' 3x'} />
            <span className={styles.text}>待服务</span>
          </div>
          <div style={{ textAlign: 'center', }} onClick={e => this.orderList(4)}>
            <img alt="" style={{ display: 'block', margin: '0 auto 5px' }} src={require('../assets/servicing.png')} srcSet={require('../assets/servicing@2x.png') + ' 2x,' + require('../assets/servicing@3x.png') + ' 3x'} />
            <span className={styles.text}>服务中</span>
          </div>
          <div style={{ textAlign: 'center', }} onClick={e => this.orderList(5)}>
            <img alt="" style={{ display: 'block', margin: '0 auto 5px' }} src={require('../assets/done.png')} srcSet={require('../assets/done@2x.png') + ' 2x,' + require('../assets/done@3x.png') + ' 3x'} />
            <span className={styles.text}>已完成</span>
          </div>
        </div>
        <hr className="hr-light" style={{ marginTop: 20 }} />
        <List.Item className="dr-list-without-padding" >
          <span style={{ color: 'var(--text-black-color)' }} >我的预约</span>
        </List.Item>

        <Carousel
          autoplay={false}
          infinite
          style={{ height: carouselHeight }}
        >
          {
            this.state.appointment.map(v => (
              <div key={v.id} style={{ height: carouselHeight, overflow: 'hidden', position: 'relative' }}
                onClick={e => this.props.history.push('/order/' + v.id)}
              >
                <div style={{ display: 'flex' }}>
                  <img src={v.img} alt="" style={{ width: carouselHeight, height: carouselHeight }} />
                  <div className={styles.text} style={{ flexGrow: 1, padding: '5px 0 0 10px' }}>
                    <div style={{ marginBottom: 10 }}><span style={{ fontSize: 18, color: 'var(--text-black-color)', marginRight: 5 }}>{v.service}</span>{v.duration}分钟</div>
                    <div style={{ marginBottom: 5 }}>预约时间: {v.startTime}</div>
                    <div style={{ marginBottom: 5 }}>预约技师: {v.employeeNum}</div>
                    <div style={{ position: 'absolute', right: 20, top: 0 }}>已预约</div>
                  </div>
                </div>
              </div>
            ))
          }
        </Carousel>

        <hr className="hr-light" style={{ marginTop: 15 }} />
        {/* <List.Item arrow="horizontal" onClick={this.options} className="dr-list-without-padding">设置</List.Item>
        <hr className="hr-light" /> */}
        <Navbar />
      </div>
    )
  }
}

export default withUser(My)