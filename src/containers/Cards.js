import React, { Component } from 'react'
import withUser from 'components/withUser'
import styles from './Cards.module.scss'
import api from '../api'

class Cards extends Component {
  state = {

  }

  componentDidMount() {
    api.getCards().then(r => {
      this.setState(r)
    })
  }


  render() {

    return (
      <div style={{ padding: '20px 15px' }}>
        <div className={styles.main} onClick={e => this.props.history.push('/charge')}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 24 }}>一卡通</p>
            <p style={{ fontSize: 14 }}>全国门店通用</p>
          </div>
          <div>
            <p style={{ fontSize: 20 }}>0</p>
            <p style={{ fontSize: 14 }}>余额</p>
          </div>
        </div>

        <div className={styles.card} onClick={e => this.props.history.push(`/charge?store=1`)}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 17, color: 'var(--main-color)' }}>叁度会所-潇湘店</p>
            <p style={{ fontSize: 14 }}>单店会员卡</p>
          </div>
          <div>
            <p style={{ fontSize: 20 }}>0</p>
            <p style={{ fontSize: 14 }}>余额</p>
          </div>
        </div>
      </div>
    )
  }
}

export default withUser(Cards)