import React, { Component } from 'react'
import { Modal, Button, InputItem, NavBar, Icon } from 'antd-mobile'

class PwdModal extends Component {
  state = {
    password: '',
  }

  componentDidMount = async () => {
    if (this.pwdInput) {
      this.pwdInput.focus()
    }
  }

  render() {
    const { state, props } = this
    // props : {
    //   visible,
    //   onClose,
    //   price,
    //   submit,
    // }
    

    return (
      <Modal
        popup
        visible={props.visible}
        onClose={props.onClose}
        animationType="slide-up"
      >
        <div style={{ textAlign: 'center', padding: '15px', boxSizing: 'border-box', width: '100%', height: '100vh' }}>
          <NavBar
            mode="light"
            icon={<Icon type="down" />}
            onLeftClick={props.onClose}
          >
            安全验证
            </NavBar>
          <div style={{ marginBottom: 15 }}>
            <img src="" alt="" />
          </div>
          <div style={{ marginBottom: 10, fontSize: 18 }}>
            付款金额
            </div>
          <div style={{"marginBottom":"15px","fontSize":"22px","fontWeight":"bold","color":"var(--red-color)"}}>
            <span style={{ fontSize: 14 }}>￥</span>{props.price}
          </div>
          <div style={{ marginBottom: 15, fontSize: 16 }}>
            请输入支付密码，以验证身份
            </div>
          <div style={{ marginBottom: 10, }}>
            <InputItem
              type="password"
              value={state.password}
              onChange={v => this.setState({ password: v })}
              maxLength={6}
              style={{"borderBottom":"1px solid var(--base-color)","marginBottom":"15px"}}
              ref={el => this.pwdInput = el}
            ></InputItem>
          </div>
          {/* <div style={{ marginBottom: 20, textAlign: 'right', fontSize: 16, color: 'var(--text-black-color)' }}>忘记支付密码？</div> */}
          <div>
            <Button type="primary" disabled={state.password.length < 6} onClick={props.submit}>确定</Button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default PwdModal