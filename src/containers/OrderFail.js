import React, { Component } from 'react'
import { NavBar, Button, Icon } from 'antd-mobile';

export default class OrderFail extends Component {
  state = {

  }

  componentDidMount() {

  }

  render() {

    return (
      <div style={{ textAlign: 'center', padding: '15px' }}>
        <NavBar
          mode="light"

        >下单失败</NavBar>
        <div style={{ marginBottom: 15 }}>
          <Icon type="cross-circle-o" style={{ width: 60, height: 60 }} />
        </div>
        <div style={{ marginBottom: 25 }}>
          下单失败
        </div>
        <div>
          <Button type="primary">重新下单</Button>
        </div>
      </div>
    )
  }
}