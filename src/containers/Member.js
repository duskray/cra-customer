import React, { Component } from 'react'
import withUser from 'components/withUser'
import styles from './Member.module.scss'
import ax from 'utils/ax'

class Member extends Component {
  state = {
    lasted: '-',
    sum: '-',
    expiryDateEnd: '-',
  }

  componentDidMount() {
    ax.get('member').then((r) => {
      this.setState({
        ...r
      })
    })
  }

  render() {
    const state = this.state
    return (
      <div>
        <div className={styles.card}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>VIP会员</div>
          {/* <div style={{ fontSize: 16, marginBottom: 60 }}>成为会员{state.lasted}天，已为您节省{state.sum}元</div> */}
          <div style={{ fontSize: 16, verticalAlign: 'bottom' }}>
            {state.expiryDateEnd} 会员到期
            {
              state.willExpiry ? 
              <span className={styles.userGetMember} onClick={e => this.props.history.push('/member/buy')}>会员续费</span>
              : ''
            }
          </div>
        </div>
        <div style={{ padding: '0 15px', fontSize: 18, marginBottom: 10 }}>会员说明</div>
        <div style={{ padding: '0 15px', fontSize: 16, whiteSpace: 'pre-line' }}>{state.description}</div>
      </div>
    )
  }
}

export default withUser(Member)