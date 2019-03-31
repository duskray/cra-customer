import React, { Component } from 'react'
import { List, Radio, TextareaItem, Button } from 'antd-mobile'
import api from '../api'

class CancelReason extends Component {
  state = {
    reasons: [],
    reasonID: null,
    comments: '',
  }

  componentDidMount() {
    api.getCancelReason().then(r => {
      this.setState({
        reasons: r.reasons,
        reasonID: r.reasons.length > 0 ? r.reasons[0].id : null,
      })
    })
  }

  submit = () => {
    api.orderCancel({
      orderId: this.props.location.state.id,
      reasonId: this.state.reasonID,
      comments: this.state.comments,
    }).then(r => {
      this.props.history.push('/')
    })
  }

  render() {
    const state = this.state
    return (
      <div style={{padding: 15}}>
        <List renderHeader={() => '取消原因'}>
          {
            state.reasons.map(i => (
              <Radio.RadioItem key={i.id} checked={state.reasonID === i.id} onChange={() => this.setState({ reasonID: i.id })}>
                {i.reason}
              </Radio.RadioItem>
            ))
          }
          <TextareaItem
            rows={3}
            placeholder="其他原因"
            value={state.comments}
            onChange={v => this.setState({ comments: v })}
          />
        </List>
        <Button type="primary" onClick={this.submit}>取消订单</Button>
      </div>
    )
  }
}

export default CancelReason