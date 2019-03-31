import React, { Component } from 'react'
import { List } from 'antd-mobile'

const Item = List.Item

export default class Options extends Component {
  state = {

  }

  componentDidMount() {

  }

  render() {

    return (
      <div style={{ textAlign: 'center', padding: '15px' }}>
        <List >
          <Item arrow="horizontal" onClick={() => { }}>
            个人资料
          </Item>
          <Item arrow="horizontal" extra="去设置" onClick={() => { }}>
            设置支付密码
          </Item>
        </List>
        <List >
          <Item arrow="horizontal" onClick={() => { }}>
            反馈与建议
          </Item>
          <Item arrow="horizontal" onClick={() => { }}>
            关于
          </Item>
        </List>
      </div>
    )
  }
}