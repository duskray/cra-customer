import React, { Component } from 'react'
import { Modal, Icon, InputItem, Button, Toast } from 'antd-mobile'
import PropTypes from 'prop-types'
import styles from './Login.module.scss'
import to from 'await-to-js'
import Logo from '../assets/ic_logo.svg'
import api from '../api'

class Login extends Component {

  state = {
    timer: 0,
    cellNumber: '',
    code: '',
    visible: false,
  }

  getCode = async () => {
    const c = this.state.cellNumber
    if (c && c.length === 13) {
      try {
        await api.getAuthCode({cellNumber: this.state.cellNumber.replace(/\s*/g, ""),})
      } catch (e) {
        return
      }
      this.timerOn()
    } else {
      Toast.info('请输入正确的手机号', 1);
    }
  }

  timerOn = () => {
    this.setState({
      timer: 60,
    }, () => {
      const interval = setInterval(() => {
        const t = this.state.timer
        if (t === 0) {
          clearInterval(interval)
          return
        }
        this.setState({
          timer: t - 1
        })
      }, 1000)
    })
  }

  login = async () => {
    const { cellNumber, code } = this.state
    const [err, res] = await to(api.login({
      cellNumber: cellNumber.replace(/\s*/g, ""),
      code,
    }))
    if (!err) {
      this.close()
      this.props.onLogin(res.user)
    }
  }

  open = () => {
    this.setState({
      visible: true,
    })
  }

  close = () => {
    this.setState({
      visible: false,
    })
  }

  onBlur = () => {
    window.scrollTo(0, 0)
  }

  render() {

    return (
      <Modal
        popup
        visible={this.state.visible}
        onClose={e => this.setState({ visible: false })}
        animationType="slide-up"
      >

        <div className={styles.login}>
          <Icon type="cross" onClick={this.close} className={styles.close} />
          <div style={{ textAlign: 'center' }}>
            <img src={Logo} alt="" width="60" />
            <div className={styles.title}>
              大智移芸
          </div>
          </div>

          <div className={styles.itemName}>
            手机号码
          </div>
          <InputItem type="phone" value={this.state.cellNumber} onChange={v => this.setState({ cellNumber: v })}
            extra={this.state.timer === 0 ? <span onClick={this.getCode}>获取验证码</span> : <span style={{ color: '#dddddd' }}>等待{this.state.timer}秒</span>}
            className={styles.item} onBlur={this.onBlur}></InputItem>
          <div className={styles.itemName}>
            验证码
          </div>
          <InputItem value={this.state.code} onChange={v => this.setState({ code: v })}  onBlur={this.onBlur} className={styles.item}></InputItem>
          <Button type="primary" onClick={this.login}>立即登录</Button>
        </div>
      </Modal>
    )
  }
}

Login.propTypes = {
  onLogin: PropTypes.func,
}

export default Login